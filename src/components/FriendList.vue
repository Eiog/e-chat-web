<script setup lang='ts'>
import type { FriendFindDocument } from '~server/db/models'
import ApplyFriend from '~/components/ApplyFriend.vue'

const emit = defineEmits<{
  (e: 'change', v?: FriendFindDocument): void
}>()
const param = ref({
  page: 1,
  limit: 10,
  query: '',
})
const { data, loading, refresh } = useRequest(() => userApi.friend(param.value))
watch(param, () => {
  refresh()
}, {
  deep: true,
})
const _value = ref<string>()
async function handleClick(item: FriendFindDocument) {
  if (_value.value === item._id) {
    return
  }
  _value.value = item._id
  emit('change')
  await nextTick()
  emit('change', item)
}
function handleAddFriend() {
  window.$dialog.create({
    title: '添加好友',
    style: 'width:auto',
    content() {
      return h(ApplyFriend, {})
    },
  })
}
</script>

<template>
  <div class="wh-full flex-col p-x-[10px]">
    <div class="h-[60px] w-full flex-y-center gap-[5px]">
      <SearchInput v-model:value="param.query" />
      <n-button @click="handleAddFriend">
        <template #icon>
          <i class="i-mage-plus" />
        </template>
      </n-button>
    </div>
    <n-spin class="min-h-0 w-full flex-1" content-class="wh-full" :show="loading">
      <n-scrollbar v-if="data && data.list.length > 0" class="w-full">
        <div class="w-full flex-col gap-[5px]">
          <div
            v-for="item in data?.list"
            :key="item._id"
            class="w-full flex-y-center cursor-pointer gap-[10px] rounded-md p-[10px] transition-base hover:bg-black/5 dark:hover:bg-white/10"
            :class="_value === item._id ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'"
            @click="handleClick(item)"
          >
            <n-avatar :src="item.avatar" size="large" round object-fit="cover">
              <i v-if="!item.avatar" class="i-mage-user" />
            </n-avatar>
            <div class="flex-col">
              <p class="text-md">
                {{ item.nickname ?? item.account }}
              </p>
              <p class="text-xs text-black/50 dark:text-white/20">
                {{ item.account }}
              </p>
            </div>
          </div>
        </div>
      </n-scrollbar>
      <div v-else class="wh-full flex items-center justify-center">
        <n-empty />
      </div>
    </n-spin>
  </div>
</template>

<style scoped lang='less'>

</style>
