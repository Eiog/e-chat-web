import { createError, createRouter, eventHandler, readValidatedBody, setResponseStatus } from 'h3'
import { object, string } from 'zod'
import { UserModel } from '../db/models/user.model'
import { sign, verify } from '../jwt'

const router = createRouter()
router.post('/login', eventHandler(async (handler) => {
  try {
    const body = await readValidatedBody(handler, object({
      account: string({ required_error: '缺少账号名称' }).min(6, '账号至少6位'),
      password: string({ required_error: '缺少密码' }).min(6, '密码至少6位'),
    }).safeParse)
    if (!body.success) {
      setResponseStatus(handler, 400, '参数错误')
      return body
    }
    const { account, password } = body.data
    const hasUser = await UserModel.findOne({ account })
    if (!hasUser) {
      const user = await UserModel.create({ account, password })
      const token = sign({ _id: user._id.toString(), account })
      return {
        success: true,
        message: '登录成功',
        token,
        user: { ...user, password: undefined },
      }
    }
    if (hasUser.password !== password) {
      setResponseStatus(handler, 401, '账号或密码错误')
      return {
        success: false,
        message: '账号或密码错误',
      }
    }
    const token = sign({ _id: hasUser._id.toString(), account })
    setResponseStatus(handler, 200, '登录成功')
    return {
      success: true,
      message: '登录成功',
      token,
      user: { ...hasUser.toObject(), password: undefined },
    }
  }
  catch (error) {
    createError({
      statusCode: 500,
      message: error.toString(),
    })
  }
}))
router.post('/refresh', eventHandler(async (handler) => {
  try {
    const body = await readValidatedBody(handler, object({
      token: string({ required_error: '缺少Token' }).min(0),
    }).safeParse)
    if (!body.success) {
      setResponseStatus(handler, 400, '参数错误')
      return body
    }
    const { token } = body.data
    const jwt = await verify(token)
    if (!jwt) {
      setResponseStatus(handler, 401, 'Token无效')
      return {
        success: false,
        message: 'Token无效',
      }
    }
    const user = await UserModel.findOne({ _id: jwt._id }, { password: 0 })
    if (!user) {
      setResponseStatus(handler, 401, 'Token无效')
      return {
        success: false,
        message: 'Token无效',
      }
    }
    setResponseStatus(handler, 200)
    return {
      success: true,
      message: '刷新成功',
      token: sign({ _id: user._id.toString(), account: user.account }),
      user,
    }
  }
  catch (error) {
    createError({
      statusCode: 500,
      message: error.toString(),
    })
  }
}))
export default router
