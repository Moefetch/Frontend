<template>
  <h2 class="text-red-500 indent-2px text-14px" v-if="errorMessage" :style="`${errorMessage? '' : 'display: none;'}`">{{errorMessage}}</h2>
  <div :class="`${(errorMessage || showRedBorderOnlyBool) ? 'error' : ''}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage?: string;
  showRedBorderOnlyBool?: boolean;
}>()

</script>

<style lang='postcss'>
  
.error {
    @apply border-rose-600 border-width-[2px] !important;
}

</style>