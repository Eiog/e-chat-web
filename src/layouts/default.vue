<script setup lang="ts">
import { type DropdownOption, NAvatar } from 'naive-ui'
import UserForm from '~/components/UserForm.vue'

const router = useRouter()
const { logout } = useLogin()
const { collapsed, userInfo } = storeToRefs(useAppStore())
const { toggleCollapsed } = useAppStore()
const { menu, currentPath, changePath } = useRoutesMenu()
const options: DropdownOption[] = [
  {
    key: 'info',
    type: 'render',
    render() {
      return h('div', { class: 'w-160px flex-y-center gap-3 p-3' }, [
        h(NAvatar, { round: true, size: 'large', src: userInfo.value?.avatar }),
        h('div', { class: 'flex-col' }, [
          h('span', { class: 'text-md' }, { default: () => userInfo.value?.nickname ?? userInfo.value?.account }),
          h('span', { class: 'text-xs text-black/50' }, { default: () => userInfo.value?.account }),
        ]),
      ])
    },

  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    key: 'update',
    label: '修改资料',
    icon() {
      return h('i', { class: 'i-mage-edit' })
    },
    props: {
      onClick() {
        const dialog = window.$dialog.create({
          title: '修改资料',
          content() {
            return h(UserForm, {
              data: userInfo.value,
              onSubmit() {
                dialog.destroy()
              },
              onCancel() {
                dialog.destroy()
              },
            })
          },
        })
      },
    },
  },
  {
    key: 'logout',
    label: '退出登录',
    icon() {
      return h('i', { class: 'i-mage-logout' })
    },
    props: {
      onClick() {
        logout()
        router.push('/login')
      },
    },
  },
]
</script>

<template>
  <div class="wh-full">
    <n-layout has-sider class="wh-full">
      <n-layout-sider
        :width="160"
        :collapsed-width="60"
        collapse-mode="width"
        :collapsed="collapsed"
        bordered
        content-class="flex flex-col"
      >
        <div class="w-full flex-1">
          <div class="h-[60px] w-full flex items-center justify-center overflow-hidden">
            <n-dropdown trigger="click" :options="options">
              <NAvatar
                round
                size="medium"
                :src="userInfo?.avatar"
              >
                <i class="i-mage-user" />
              </NAvatar>
            </n-dropdown>
          </div>
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="60"
            :collapsed-icon-size="24"
            :root-indent="20"
            :value="currentPath"
            :options="menu"
            @update:value="changePath"
          />
        </div>
        <div class="flex items-center justify-center p-y-[10px]">
          <n-button quaternary @click="toggleCollapsed">
            <template #icon>
              <Transition name="fade" mode="out-in">
                <i v-if="collapsed" class="i-mage-dots-menu" />
                <i v-else class="i-mage-dash-menu" />
              </Transition>
            </template>
          </n-button>
        </div>
      </n-layout-sider>
      <n-layout-content>
        <main class="wh-full">
          <RouterEntry />
        </main>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style scoped lang="less"></style>
