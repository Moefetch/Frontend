<template>
  <img 
    class="icon h-full w-full"
    :src="`/icons/${icon}.svg`"
    style="aspect-ratio: 1 / 1; object-fit: contain"
    :alt="icon"
  />
</template>

<script setup lang="ts">
  defineProps<{icon: string}>();
  //const modeProd = ref(import.meta.env.PROD); //add /moefetch-client in the '' up above if you wanna build for github and add ${modeProd? '' : ''} before /icons/
</script>
