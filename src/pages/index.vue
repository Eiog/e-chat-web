<!-- eslint-disable no-console -->
<script setup lang='ts'>
defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: '聊天',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-message-conversation',
  },
})
</script>

<template>
  <div class="wh-full flex">
    <div class="h-full w-[260px]">
      <ChatList />
    </div>
    <div class="h-full w-[1px] bg-black/5" />
    <div class="h-full min-w-0 flex-1">
      <ChatWindow />
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
