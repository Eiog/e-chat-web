<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { FriendFindDocument } from '~server/db/models'

const props = defineProps<{
  data?: FriendFindDocument
}>()
const { createChat } = useChatStore()

function handleCreateMessage(_targetId: string, target: FriendFindDocument, type: 'message' | 'video' | 'audio') {
  console.log(type)

  createChat(_targetId, target)
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="props.data" class="relative wh-full bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${props.data.avatar})` }">
      <div class="wh-full flex-col-center gap-[20px] bg-white/90 backdrop-blur-xl dark:bg-black/80">
        <n-avatar :src="props.data.avatar" :size="120" round object-fit="cover">
          <i v-if="!props.data.avatar" class="i-mage-user text-5xl" />
        </n-avatar>
        <div class="flex-col-center">
          <p class="text-2xl">
            {{ props.data.nickname ?? props.data.account }}
          </p>
          <p class="text-black/50">
            {{ props.data.account }}
          </p>
        </div>
        <div class="flex gap-[20px]">
          <n-button type="primary" circle size="large" @click="handleCreateMessage(props.data._userId, props.data, 'message')">
            <template #icon>
              <i class="i-mage-message" />
            </template>
          </n-button>
          <n-button type="success" circle size="large">
            <template #icon>
              <i class="i-mage-phone" />
            </template>
          </n-button>
          <n-button type="info" circle size="large">
            <template #icon>
              <i class="i-mage-video" />
            </template>
          </n-button>
          <n-button type="error" circle size="large">
            <template #icon>
              <i class="i-mage-trash" />
            </template>
          </n-button>
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
