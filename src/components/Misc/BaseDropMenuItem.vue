<template>
  <div class="flex flex-row items-center gap-1">
    <h2 class="text-size-[0.75rem] text-center text-white-500">{{ item }}</h2>
  </div>
</template>
<script setup lang="ts">

const props = defineProps<{ item: string }>();
</script>
<style scoped>
div h2 {
  text-indent: 0.25rem;
}
</style>
