import { defineStore } from 'pinia'

export const useAppStore = defineStore(
  'appStore',
  () => {
    const { language, toggle, setLanguage } = useLanguage()
    const { value: collapsed, toggle: toggleCollapsed } = useBoolean(false)
    const { token, logged, refreshed, userInfo } = useLogin()
    return {
      language,
      toggle,
      setLanguage,
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
      pick: ['language', 'collapsed', 'token', 'logged'],
    },
  },
)
