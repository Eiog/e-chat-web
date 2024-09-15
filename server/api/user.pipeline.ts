import type { PipelineStage } from 'mongoose'

import { $timeProject } from './pipeline'

export const $userProject: PipelineStage.Project = $timeProject({
  _id: 1,
  account: 1,
  nickname: 1,
  avatar: 1,
  status: 1,
  realIp: 1,
  enable: 1,
  deletedAt: 1,
  lastLoginAt: 1,
})
export const $friendProject: PipelineStage.Project = $timeProject({
  _id: 1,
  _fromId: 1,
  _targetId: 1,
  account: '$users.account',
  nickname: '$users.nickname',
  avatar: '$users.avatar',
  realIp: '$users.realIp',
  enable: '$users.enable',
  createdAt: '$users.createdAt',
  updatedAt: '$users.updatedAt',
  deletedAt: '$users.deletedAt',
  lastLoginAt: '$users.lastLoginAt',
  status: 1,
  delete: 1,
})
