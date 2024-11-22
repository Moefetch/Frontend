<template>
  <Header class="min-h-[40px] h-{fit-content]" />
  <div
    :class="`max-h-[calc(100vh-40px)] nice_scroll ${state.stateVariables.advancedSearch ? 'h-[calc(83vh-40px)]' : 'h-[calc(100vh-40px)]'}`">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { provide } from "vue";
import Header from "./components/Global/Header.vue";
import { state } from "../state";

provide("state", state);
</script>

<style lang="postcss">
body {
  @apply bg-[#1D2026] overflow-hidden
}

.nice_scroll {
  @apply overflow-x-auto overflow-y-auto;
  scrollbar-color: gray transparent;
  scrollbar-width: thin;
}
</style>
