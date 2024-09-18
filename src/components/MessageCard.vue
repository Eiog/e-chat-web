<script setup lang='ts'>
import type { FriendFindDocument } from '~server/db/models'

const props = withDefaults(defineProps<{
  type?: 'text' | 'image' | 'video' | 'audio'
  placement?: 'left' | 'right'
  user?: FriendFindDocument
  content?: string
  time?: string
  status?: 'pending' | 'success' | 'error'
}>(), {
  type: 'text',
  placement: 'left',
  content: '你好',
  time: '2023-05-01 12:00:00',
  status: 'pending',
})
const emit = defineEmits<{
  (e: 'refresh'): void
}>()
const isRight = computed(() => props.placement === 'right')
</script>

<template>
  <div class="flex gap-[15px]" :class="isRight ? 'flex-row-reverse' : ''">
    <div class="flex-col">
      <n-popover trigger="hover" :placement="isRight ? 'top-end' : 'top-start'">
        <template #trigger>
          <n-avatar round :size="40" />
        </template>
        <span>或许不想知道你的花园长得咋样</span>
      </n-popover>
      <div class="flex items-center justify-center">
        <span>AA</span>
      </div>
    </div>
    <div class="flex-col gap-[5px]">
      <div class="relative min-h-[20px] min-w-[200px] flex-col">
        <div class="absolute top-0 z-0 h-full flex-col" :class="isRight ? 'right-[-5px]' : 'left-[-5px]'">
          <div class="m-t-[20px] h-[10px] w-[10px] rotate-45 border bg-light-1 dark:border-dark-4 dark:bg-dark-5" />
        </div>
        <div class="relative z-1 flex-col gap-[5px] border rounded-lg bg-light-1 p-[10px] dark:border-dark-4 dark:bg-dark-5">
          <div class="text-base">
            <slot>
              {{ props.content }}
            </slot>
          </div>
        </div>
        <div v-if="isRight && props.status !== 'success'" class="t-0 absolute left-[-30px] h-full flex-y-center">
          <div class="flex items-center justify-center p-[5px]" @click="emit('refresh')">
            <i
              class="i-mage-reload text-black/50 dark:text-white/20"
              :class="[props.status === 'pending' ? 'animate-inherit animated animate-roll-in' : '', props.status === 'error' ? 'text-red-5' : '']"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <span class="text-xs text-zinc-3">
          <slot name="time">
            {{ props.time }}
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
