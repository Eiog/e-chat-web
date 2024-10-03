<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { EmojiResult } from '~/components/EmojiPicker.vue'

const { active, status, activeMessageList } = storeToRefs(useChatStore())
const { removeChat, sendMessage } = useChatStore()
const inputValue = ref('')
const disabled = computed(() => inputValue.value.length <= 0 || status.value !== 'OPEN')
function handleSend() {
  sendMessage('text', inputValue.value)
  inputValue.value = ''
}
function onEmojiSelect(v: EmojiResult) {
  console.log(v)
  inputValue.value += v.native
}
function handleKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Enter' && !ev.shiftKey) {
    ev.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="active" class="wh-full flex-col bg-white dark:bg-black">
      <div class="h-[60px] w-full flex p-[10px]">
        <div class="flex-y-center flex-1">
          <div class="flex-col">
            <h2 class="text-lg">
              {{ active.target.nickname ?? active.target.account }}
            </h2>
            <p class="text-xs text-black/50 dark:text-white/20">
              {{ active.target.account }}
            </p>
          </div>
        </div>
        <div class="flex-y-center gap-[10px]">
          <n-button type="success" size="small" strong secondary circle>
            <template #icon>
              <i class="i-mage-phone" />
            </template>
          </n-button>
          <n-button type="info" circle size="small" strong secondary>
            <template #icon>
              <i class="i-mage-video" />
            </template>
          </n-button>
          <n-button type="error" circle size="small" strong secondary @click="removeChat(active._targetId)">
            <template #icon>
              <i class="i-mage-trash" />
            </template>
          </n-button>
        </div>
      </div>
      <div class="h-[1px] w-full bg-black/5 dark:bg-white/10" />
      <div class="min-h-0 w-full flex-1 p-[10px]">
        <n-scrollbar class="min-h-0 wh-full">
          <div class="flex-col gap-[20px]">
            <MessageCard
              v-for="item in activeMessageList"
              :key="item._id"
              :content="item.content"
              :placement="item.subType === 'receive' ? 'left' : 'right'"
              :time="item.createAt.toLocaleString()"
              :status="item.status"
            />
          </div>
        </n-scrollbar>
      </div>
      <div class="h-[1px] w-full bg-black/5 dark:bg-white/10" />
      <div class="h-[140px] w-full flex-col gap-[5px] p-[10px]">
        <div class="h-[20px] w-full flex-y-center gap-[10px]">
          <EmojiPicker @select="onEmojiSelect" />
          <n-button text>
            <template #icon>
              <i class="i-mage-image" />
            </template>
          </n-button>
        </div>
        <div class="h-[95px] w-full flex gap-[5px]">
          <n-input
            v-model:value="inputValue"
            type="textarea"
            show-count
            class="wh-full"
            @keydown="handleKeyDown"
          />
          <div class="flex-col justify-end gap-[10px]">
            <n-button type="primary" size="small" :disabled="disabled" @click="handleSend">
              发送
            </n-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="wh-full flex items-center justify-center">
      <n-empty />
    </div>
  </Transition>
</template>

<style scoped lang='less'>

</style>
