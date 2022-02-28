<template>
<img :src="pictureURL" class="picture_card"/>
</template>

<script setup lang="ts">
defineProps<{
  pictureURL?: string;
}>();
</script>

<style>
.picture_card {

  @apply max-h-[280px] max-w-[280px];
  @apply bg-[#3D3D3D] border-[3px] border-[#254EE0] ;
  
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  object-fit: cover;
  border-radius: 4px;
  column-gap: 1rem;
}
</style>