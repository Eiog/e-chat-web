import type { UserFindDocument } from '~server/db/models/user.model'
import md5 from 'md5'

export interface LoginType {
  Data: {
    account: string
    password: string
  }
  Res: {
    success: boolean
    message: string
    token: string
    user: UserFindDocument
  }
}
export interface StatusType {
  Data: {
    token: string
  }
  Res: {
    success: boolean
    message: string
    token: string
    user: UserFindDocument
  }
}
const token = ref<string>()
const logged = ref(false)
const refreshed = ref(false)
const userInfo = ref<UserFindDocument>()
function login({ account, password }: LoginType['Data']): Promise<LoginType['Res']> {
  return new Promise((resolve, reject) => {
    post<LoginType['Res']>('/login', { account, password: md5(password) }).then((result) => {
      token.value = result.token
      userInfo.value = result.user
      logged.value = true
      refreshed.value = true
      return resolve(result)
    }).catch(err => reject(err))
  })
}
async function refresh(data: { token: string }): Promise<StatusType['Res']> {
  return new Promise((resolve, reject) => {
    post<StatusType['Res']>('/refresh', { token: data.token }).then((result) => {
      token.value = result.token
      userInfo.value = result.user
      logged.value = true
      refreshed.value = true
      return resolve(result)
    }).catch((err) => {
      logout()
      reject(err)
    })
  })
}
function logout() {
  token.value = undefined
  logged.value = false
  refreshed.value = false
  userInfo.value = undefined
}
export function useLogin() {
  return {
    token,
    logged,
    refreshed,
    userInfo,
    login,
    refresh,
    logout,
  }
}
