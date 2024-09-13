import { createError, createRouter, eventHandler, readValidatedBody, setResponseStatus } from 'h3'
import { number, object, string } from 'zod'
import { UserModel } from '../db/models/user.model'

const router = createRouter()
router.post('/update', eventHandler(async (handler) => {
  try {
    const body = await readValidatedBody(handler, object({
      _id: string({ required_error: '缺少id' }),
      account: string().optional(),
      nickname: string().optional(),
      password: string().optional(),
      avatar: string().optional(),
    }).safeParse)
    if (!body.success) {
      setResponseStatus(handler, 400, '参数错误')
      return body
    }
    const { _id } = body.data
    const user = await UserModel.findByIdAndUpdate(_id, body.data)
    return {
      success: true,
      message: '修改成功',
      user: { ...user?.toObject(), password: undefined },
    }
  }
  catch (error) {
    createError({
      statusCode: 500,
      message: error.toString(),
    })
  }
}))
router.post('/find', eventHandler(async (handler) => {
  try {
    const body = await readValidatedBody(handler, object({
      page: number().optional(),
      limit: number().optional(),
      query: string().optional(),
    }).safeParse)
    if (!body.success) {
      setResponseStatus(handler, 400, '参数错误')
      return body
    }
    const list = await UserModel.find()
    return {
      success: true,
      message: '查询成功',
      list: list.map((m) => {
        m.avatar = `https://picsum.photos/200?s=${m._id}`
        return m
      }),
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
