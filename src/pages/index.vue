<script setup lang='ts'>
import type { UserFindType } from '~/api/user.api'

type UserItem = UserFindType['Res']['list'][0]

defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: '消息',
    requireAuth: true,
    icon: 'i-mage-message-conversation',
  },
})

const { data, loading } = useRequest(() => userApi.find({}))
const active = ref<UserItem>()
async function handleClick(item: UserItem) {
  active.value = undefined
  await nextTick()
  active.value = item
}
</script>

<template>
  <div class="wh-full flex">
    <div class="h-full w-[260px] flex-col gap-[10px] p-[10px]">
      <div class="w-full flex gap-[5px]">
        <n-input placeholder="搜索">
          <template #prefix>
            <i class="i-mage-search" />
          </template>
        </n-input>
        <n-button>
          <template #icon>
            <i class="i-mage-plus" />
          </template>
        </n-button>
      </div>
      <n-spin class="w-full flex-1" :show="loading">
        <n-scrollbar class="w-full">
          <div class="w-full flex-col gap-[5px]">
            <div
              v-for="item in data?.list"
              :key="item._id"
              class="w-full flex-y-center cursor-pointer gap-[10px] rounded-md p-[10px] transition-base hover:bg-black/5"
              :class="active?._id === item._id ? 'bg-black/5' : 'bg-transparent'"
              @click="handleClick(item)"
            >
              <n-avatar :src="item.avatar" size="large" round />
              <div class="flex-col">
                <p class="text-md">
                  {{ item.nickname ?? item.account }}
                </p>
                <p class="text-xs text-black/50">
                  {{ item.account }}
                </p>
              </div>
            </div>
          </div>
        </n-scrollbar>
      </n-spin>
    </div>
    <div class="h-full w-[1px] bg-black/5" />
    <div class="h-full flex-1 bg-white">
      <Transition name="fade" mode="out-in">
        <div v-if="active" class="relative wh-full bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${active.avatar})` }">
          <div class="wh-full flex-col-center gap-[20px] bg-white/90 backdrop-blur-xl">
            <n-avatar :src="active.avatar" :size="120" round />
            <div class="flex-col-center">
              <p class="text-2xl">
                {{ active.nickname ?? active.account }}
              </p>
              <p class="text-black/50">
                {{ active.account }}
              </p>
            </div>
            <div class="flex gap-[20px]">
              <n-button type="primary" circle size="large">
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
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
