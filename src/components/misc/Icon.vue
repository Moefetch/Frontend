<template>
  <img class="icon h-full w-full" :src="`/icons/${icon}.svg`" style="aspect-ratio: 1 / 1" :alt="icon" />
</template>

<script setup lang="ts">
  defineProps<{icon: string}>();
</script>