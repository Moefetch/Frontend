<template>
  <Header class="min-h-[7vh] h-{fit-content]" />
  <div class="max-h-[93vh] overflow-y-auto h-{fit-content]">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { ref, provide } from "vue";
import Header from "./components/Global/Header.vue";
import { state } from "../state";
import { api } from "./services/api";

provide("state", state);
</script>

<style lang="postcss">
body {
  @apply bg-[rgba(29,32,38,1)] overflow-hidden;
}
</style>
