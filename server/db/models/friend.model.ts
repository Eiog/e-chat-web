import { model, Schema } from 'mongoose'
import type { UserFindDocument } from './'

export interface FriendDocument {
  _id: Schema.Types.ObjectId
  _fromId: Schema.Types.ObjectId
  _targetId: Schema.Types.ObjectId
  status: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
export type FriendFindDocument = FriendDocument & UserFindDocument & {

}
export const FriendModel = model<FriendDocument>('friend-approvals', new Schema(
  {
    _fromId: { type: Schema.Types.ObjectId, required: true },
    _targetId: { type: Schema.Types.ObjectId, required: true },
    status: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
))
