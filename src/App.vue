
<template>
  <Header class="h-[7vh]"/>
  <div class="h-[93vh] ">
    <router-view/>
  </div>
</template>
<script setup lang="ts">
import Header from './components/Global/Header.vue'

localStorage.setItem("backendUrl","http://localhost:2234/")
</script>

<style>
  body {
    @apply bg-[rgba(29,32,38,1)];
}
</style>
