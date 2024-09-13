import { defineStore } from 'pinia'

export const useAppStore = defineStore(
  'appStore',
  () => {
    const { language, toggle } = useLanguage()
    const { value: collapsed, toggle: toggleCollapsed } = useBoolean(false)
    const { token, logged, refreshed, userInfo } = useLogin()
    return {
      language,
      toggle,
      collapsed,
      toggleCollapsed,
      token,
      logged,
      refreshed,
      userInfo,
    }
  },
  {
    persist: {
      key: '__E_CHAT-APP_STORE_PERSIST__',
      pick: ['collapsed', 'token', 'logged'],
    },
  },
)
