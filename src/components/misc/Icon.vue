<template>
  <img class="icon h-full w-full" :src="`${modeProd? '' : ''}/icons/${icon}.svg`" style="aspect-ratio: 1 / 1" :alt="icon" />
</template>

<script setup lang="ts">import { ref } from "vue";

  defineProps<{icon: string}>();
  const modeProd = ref(import.meta.env.PROD); //add /moefetch-client in the '' up above if you wanna build for github
</script>
