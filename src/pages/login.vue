<script setup lang='ts'>
defineOptions({

})
definePage({
  meta: {
    layout: 'blank',
    title: '登录',
    hideOnMenu: true,
  },
})
const router = useRouter()
const redirect = useRoute().query.redirect as string || '/'

const { login } = useLogin()
const { formRef, formProps, formValue, validate } = useNaiveForm({
  value: {
    account: '',
    password: '',
  },
  rules: {
    account: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
    password: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
  },
})
const { loading, runAsync } = useRequest(() => login(formValue.value), { manual: true })

async function handleValidate() {
  try {
    await validate()
    const { message } = await runAsync()
    window.$message.success(message)
    router.push(redirect)
  }
  catch {

  }
}
</script>

<template>
  <div class="wh-full flex-col-center">
    <div class="window-bg h-[400px] w-[300px] flex-col-center border rounded-xl p-[20px] shadow-2xl shadow-black/5 dark:brightness-75">
      <div class="h-[120px] w-[120px] flex-col-center overflow-hidden rounded-full bg-white">
        <SvgIcon name="boluo" :width="6" :height="6" />
      </div>
      <div class="m-t-[20px] flex-col">
        <n-form ref="formRef" v-bind="formProps" :show-label="false">
          <n-form-item path="account">
            <n-input v-model:value="formValue.account" placeholder="输入账号" />
          </n-form-item>
          <n-form-item path="password">
            <n-input v-model:value="formValue.password" placeholder="输入密码" type="password" />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" block :loading="loading" @click="handleValidate">
              登录
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.window-bg {
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
