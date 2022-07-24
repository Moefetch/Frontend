<template>
<img :src="pictureURL" class="picture_card"/>
</template>

<script setup lang="ts">
defineProps<{
  pictureURL?: string;
}>();
</script>

<style lang="postcss">
.picture_card {

  @apply max-h-[150px] max-w-[280px];

  border-radius: 4px;
  object-fit: cover;
  border-radius: 4px;
  column-gap: 1rem;
}
</style>