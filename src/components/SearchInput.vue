<script setup lang='ts'>
const props = defineProps<{
  value?: string
}>()
const emit = defineEmits<{
  (e: 'update:value', v: typeof props.value): void
}>()
const _value = ref(props.value)
watch(() => props.value, (v) => {
  _value.value = v
})
function handleClick() {
  emit('update:value', _value.value)
}
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleClick()
  }
}
</script>

<template>
  <n-input-group>
    <n-input v-model:value="_value" placeholder="搜索" @keydown="handleKeyDown">
      <template #prefix>
        <i class="i-mage-search" />
      </template>
    </n-input>
    <n-button @click="handleClick">
      <template #icon>
        <i class="i-mage-search" />
      </template>
    </n-button>
  </n-input-group>
</template>

<style scoped lang='less'>

</style>
