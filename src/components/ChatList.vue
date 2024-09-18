<script setup lang='ts'>
const { chatList, activeId } = storeToRefs(useChatStore())
async function handleClick(_targetId: string) {
  activeId.value = undefined
  await nextTick()
  activeId.value = _targetId
}
</script>

<template>
  <div class="wh-full flex-col p-x-[10px]">
    <div class="h-[60px] w-full flex-y-center">
      <SearchInput />
    </div>
    <n-scrollbar v-if="chatList && chatList.length > 0" class="w-full">
      <div class="w-full flex-col gap-[5px]">
        <div
          v-for="item in chatList"
          :key="item._id"
          class="w-full flex-y-center cursor-pointer gap-[10px] rounded-md p-[10px] transition-base hover:bg-black/5 dark:hover:bg-white/10"
          :class="activeId === item._targetId ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'"
          @click="handleClick(item._targetId)"
        >
          <n-avatar :src="item.target.avatar" size="large" round object-fit="cover">
            <i v-if="!item.target.avatar" class="i-mage-user" />
          </n-avatar>
          <div class="flex-col">
            <p class="text-md">
              {{ item.target.nickname ?? item.target.account }}
            </p>
            <p class="text-xs text-black/50 dark:text-white/20">
              {{ item.target.account }}
            </p>
          </div>
        </div>
      </div>
    </n-scrollbar>
    <div v-else class="wh-full flex items-center justify-center">
      <n-empty />
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
