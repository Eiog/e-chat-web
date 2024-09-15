import { createError, createRouter, eventHandler, readValidatedBody } from 'h3'
import { object, string } from 'zod'
import { UserModel } from '../db/models/user.model'
import { paramsError } from '../helps'
import { sign, verify } from '../jwt'

const router = createRouter()
router.post('/login', eventHandler(async (handler) => {
  const body = await readValidatedBody(handler, object({
    account: string({ required_error: '缺少账号名称' }).min(6, '账号至少6位'),
    password: string({ required_error: '缺少密码' }).min(6, '密码至少6位'),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
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
    throw createError({
      status: 401,
      statusMessage: 'No Permission',
      message: '账号或密码错误',
    })
  }
  const token = sign({ _id: hasUser._id.toString(), account })
  return {
    success: true,
    message: '登录成功',
    token,
    user: { ...hasUser.toObject(), password: undefined },
  }
}))
router.post('/refresh', eventHandler(async (handler) => {
  const body = await readValidatedBody(handler, object({
    token: string({ required_error: '缺少Token' }).min(0),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const { token } = body.data
  const jwt = await verify(token)
  if (!jwt) {
    throw createError({
      status: 401,
      statusMessage: 'No Permission',
      message: 'Token无效',
    })
  }
  const user = await UserModel.findOne({ _id: jwt._id }, { password: 0 })
  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'No Permission',
      message: 'Token无效',
    })
  }
  return {
    success: true,
    message: '刷新成功',
    token: sign({ _id: user._id.toString(), account: user.account }),
    user,
  }
}))
export default router
