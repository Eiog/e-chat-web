<script setup lang='ts'>
import type { FriendFindDocument } from '~server/db/models'

defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: '通讯录',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-checklist-note',
  },
})
const activeFriend = ref<FriendFindDocument>()
function onFriendChange(item?: FriendFindDocument) {
  activeFriend.value = item
}
</script>

<template>
  <div class="wh-full flex">
    <div class="h-full w-[260px] flex-col">
      <FriendList @change="onFriendChange" />
    </div>
    <div class="h-full w-[1px] bg-black/5" />
    <div class="h-full flex-1 bg-white dark:bg-black">
      <FriendPage :data="activeFriend" />
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
