import { defineStore } from 'pinia'

const SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL || ''

export const useChatStore = defineStore(
  'chatStore',
  () => {
    const { userInfo } = storeToRefs(useAppStore())
    const { status, connect, close } = useWebSockets(SOCKET_URL, { manual: true })
    watch(userInfo, (v) => {
      if (v) {
        connect([`_id-${v._id}`])
      }
      else {
        close()
      }
    }, { immediate: true })
    return {
      status,
    }
  },
  {
    persist: {
      key: '__E_CHAT-CHAT_STORE_PERSIST__',
      pick: [],
    },
  },
)
