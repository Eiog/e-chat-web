<script setup lang='ts'>
const { language } = storeToRefs(useAppStore())
const isDark = useDark()
</script>

<template>
  <n-form>
    <n-form-item label="语言">
      <n-radio-group v-model:value="language">
        <n-radio-button value="cn">
          中
        </n-radio-button>
        <n-radio-button value="en">
          英
        </n-radio-button>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="暗色模式">
      <n-radio-group v-model:value="isDark">
        <n-radio-button :value="false">
          亮
        </n-radio-button>
        <n-radio-button :value="true">
          暗
        </n-radio-button>
      </n-radio-group>
    </n-form-item>
  </n-form>
</template>

<style scoped lang='less'>

</style>
