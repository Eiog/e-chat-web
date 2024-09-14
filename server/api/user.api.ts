/* eslint-disable no-console */
import { createError, createRouter, eventHandler, readValidatedBody, setResponseStatus } from 'h3'
import { number, object, string } from 'zod'
import { UserModel } from '../db/models/user.model'
import type { UserDocument } from '../db/models/user.model'

const router = createRouter()
router.post('/user/update', eventHandler(async (handler) => {
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
router.post('/user/find', eventHandler(async (handler) => {
  try {
    const body = await readValidatedBody(handler, object({
      page: number().optional().default(1),
      limit: number().optional().default(10),
      query: string().optional(),
    }).safeParse)
    if (!body.success) {
      setResponseStatus(handler, 400, '参数错误')
      return body
    }
    const { page = 1, limit = 10, query = '' } = body.data
    const { list, count } = (await UserModel.aggregate<{ list: UserDocument[], count: number }>([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          $or: [
            {
              account: {
                $regex: query,
                $options: 'i',
              },
            },
            {
              nickname: {
                $regex: query,
                $options: 'i',
              },
            },
          ],
          $and: [
            {
              deleted: false,
            },
          ],
        },
      },
      {
        $facet: {
          list: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
            {
              $project: {
                _id: 1,
                account: 1,
                nickname: 1,
                avatar: 1,
                status: 1,
                realIp: 1,
                enable: 1,
                createdAt: {
                  $dateToString: {
                    format: '%Y-%m-%d %H:%M:%S',
                    date: '$createdAt',
                    timezone: 'Asia/Shanghai',
                  },
                },
                updatedAt: {
                  $dateToString: {
                    format: '%Y-%m-%d %H:%M:%S',
                    date: '$updatedAt',
                    timezone: 'Asia/Shanghai',
                  },
                },
                deletedAt: 1,
                lastLoginAt: 1,
              },
            },
          ],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          list: '$list',
          count: '$count.count',
        },
      },
      {
        $unwind: {
          path: '$count',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]))[0]
    return {
      success: true,
      message: '查询成功',
      list: list.map((m) => {
        m.avatar = `https://picsum.photos/200?s=${m._id}`
        return m
      }),
      count,
    }
  }
  catch (error) {
    console.log(error)

    createError({
      statusCode: 500,
      message: '服务器错误',
    })
  }
}))
export default router
