<script setup lang='ts'>
const props = defineProps<{
  src?: string
  aspectRatio?: `${number}/${number}` | number
}>()
</script>

<template>
  <div>
    {{ props }}
  </div>
</template>

<style scoped lang='less'>

</style>
