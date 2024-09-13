import md5 from 'md5'
import type { UserDocument } from '~server/db/models/user.model'

export interface UserFindType {
  Data: {
    page?: number
    limit?: number
    query?: string
  }
  Res: {
    success: boolean
    message: string
    list: (UserDocument & { _id: string })[]
  }
}
export interface UserUpdateType {
  Data: Partial<UserDocument>
  Res: {
    success: boolean
    message: string
    user: UserDocument
  }
}
export const userApi = {
  find(data: UserFindType['Data']) {
    return post<UserFindType['Res']>('/user/find', data)
  },
  update(data: UserUpdateType['Data']) {
    return post<UserUpdateType['Res']>('/user/update', { ...data, password: data.password ? md5(data.password) : undefined })
  },

}
