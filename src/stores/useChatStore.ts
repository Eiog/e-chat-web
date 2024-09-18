import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import type { FriendFindDocument } from '~server/db/models'
import { router } from '~/modules'
import type { MessageDispatch, MessageReceive, MessageType } from '../../server/useChat'

const SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL || ''
interface Chat {
  _id: string
  _targetId: string
  target: FriendFindDocument
  createAt: string
}

export const useChatStore = defineStore(
  'chatStore',
  () => {
    const { userInfo } = storeToRefs(useAppStore())
    const { status, connect, close, onMessage, send } = useWebSockets(SOCKET_URL, { manual: true })
    watch(userInfo, (v) => {
      if (v) {
        connect([`_id-${v._id}`])
      }
      else {
        close()
      }
    }, { immediate: true })
    const activeId = ref<string>()
    const chatList = ref<Chat[]>([])
    const active = computed(() => chatList.value.find(f => f._targetId === activeId.value))
    function createChat(_targetId: string, target: FriendFindDocument) {
      const chat = chatList.value.find(f => f._targetId === _targetId)
      if (chat) {
        activeId.value = chat._targetId
      }
      else {
        const chat = {
          _id: nanoid(),
          _targetId,
          target,
          createAt: new Date().toISOString(),
        }
        chatList.value.push(chat)
        activeId.value = chat._targetId
      }
      router.push('/')
    }
    function removeChat(_targetId: string) {
      const index = chatList.value.findIndex(f => f._targetId === _targetId)
      if (index !== -1) {
        chatList.value.splice(index, 1)
        activeId.value = undefined
      }
    }
    const chatMap = ref<{ [key: string]: MessageReceive[] }>({})
    const chatMapHas = computed(() => activeId.value ? Object.keys(chatMap.value).includes(activeId.value) : false)
    const activeMessageList = computed(() => {
      return activeId.value ? chatMap.value?.[activeId.value] || [] : []
    })
    function sendMessage(type: MessageType, content: string) {
      if (!userInfo.value || !activeId.value)
        return
      const data: MessageReceive = {
        _id: new Date().getTime() + nanoid(),
        type,
        status: 'pending',
        subType: 'dispatch',
        _targetId: activeId.value,
        content,
        createAt: new Date(),
      }
      if (!chatMapHas.value) {
        chatMap.value[activeId.value] = []
      }
      chatMap.value[activeId.value].push(data)

      send(JSON.stringify(data))
    }
    onMessage((message) => {
      const { method, status, payload, _id, _fromId, _targetId, createAt } = JSON.parse(message.data.toString()) as MessageDispatch
      if (method === 'message-status') {
        const index = chatMap.value[_targetId].findIndex(f => f._id === _id)
        if (index !== -1) {
          chatMap.value[_targetId][index].status = status
        }
      }
      if (method === 'message') {
        activeId.value = _fromId
        if (!chatMapHas.value) {
          chatMap.value[_fromId] = []
        }

        const data: MessageReceive = {
          _id,
          type: payload.messageType,
          status,
          subType: 'receive',
          _targetId: _fromId,
          content: payload.content,
          createAt,
        }
        chatMap.value[_fromId].push(data)
      }
    })
    return {
      status,
      activeId,
      active,
      chatList,
      createChat,
      removeChat,
      send,
      onMessage,
      chatMap,
      activeMessageList,
      sendMessage,
    }
  },
  {
    persist: {
      key: '__E_CHAT-CHAT_STORE_PERSIST__',
      pick: ['chatList', 'activeId', 'chatMap'],
    },
  },
)
