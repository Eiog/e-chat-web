import { createRouter, eventHandler, readValidatedBody } from 'h3'
import { number, object, string } from 'zod'
import { FriendModel, UserModel } from '../db/models'
import { paramsError } from '../helps'
import { $limit, $page, $string2ObjectId, $unwind } from './pipeline'
import { $friendProject, $userProject } from './user.pipeline'
import type { FriendFindDocument, UserFindDocument } from '../db/models'

const router = createRouter()
router.post('/user/update', eventHandler(async (handler) => {
  const body = await readValidatedBody(handler, object({
    _id: string({ required_error: '缺少id' }),
    account: string().optional(),
    nickname: string().optional(),
    password: string().optional(),
    avatar: string().optional(),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const { _id } = body.data
  const user = await UserModel.findByIdAndUpdate(_id, body.data)
  return {
    success: true,
    message: '修改成功',
    user: { ...user?.toObject(), password: undefined },
  }
},
))
router.post('/user/find', eventHandler(async (handler) => {
  const body = await readValidatedBody(handler, object({
    page: number().optional().default(1),
    limit: number().optional().default(10),
    query: string().optional().default(''),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const { page, limit, query } = body.data
  const { list, count } = (await UserModel.aggregate<{ list: UserFindDocument[], count: number }>([
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
          $page(page, limit),
          $limit(limit),
          $userProject,
        ],
        count: [
          {
            $count: 'count',
          },
        ],
      },
    },
    $unwind('$count'),
    {
      $project: {
        list: '$list',
        count: '$count.count',
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
}))
router.post('/user/apply-friend', eventHandler(async (event) => {
  const body = await readValidatedBody(event, object({
    _targetId: string({ required_error: '缺少id' }),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const _fromId = event.context._id
  const { _targetId } = body.data
  const result = await FriendModel.create({
    _fromId,
    _targetId,
  })
  return {
    success: true,
    message: '添加成功',
    result,
  }
}))
router.post('/user/friend', eventHandler(async (event) => {
  const body = await readValidatedBody(event, object({
    page: number().optional().default(1),
    limit: number().optional().default(10),
    query: string().optional().default(''),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const _fromId = event.context._id

  const { page, limit, query } = body.data
  const { list, count } = (await FriendModel.aggregate<{ list: FriendFindDocument[], count: number }>([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $match: {
        $and: [
          {
            deleted: false,
          },
          {
            _fromId: $string2ObjectId(_fromId),
          },
        ],
      },
    },
    {
      $facet: {
        list: [
          {
            $lookup: {
              from: 'users',
              localField: '_targetId',
              foreignField: '_id',
              as: 'users',
              pipeline: [
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
                $userProject,
              ],
            },
          },
          $unwind('$users'),
          $page(page, limit),
          $limit(limit),
          $friendProject,
        ],
        count: [
          {
            $count: 'count',
          },
        ],
      },
    },
    $unwind('$count'),
    {
      $project: {
        list: '$list',
        count: '$count.count',
      },
    },
  ]))[0]
  return {
    success: true,
    message: '查询成功',
    list: list.map((m) => {
      m.avatar = `https://picsum.photos/200?s=${m._targetId}`
      return m
    }),
    count,
  }
}))
export default router
