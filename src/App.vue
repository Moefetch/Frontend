
<template>
  <Header class="h-[7vh]"/>
  <router-view class=" h-[93vh] "/>
</template>
<script setup lang="ts">
import Header from './components/Global/Header.vue'
</script>

<style>
  body {
    @apply bg-[rgba(29,32,38,1)];
}
</style>
