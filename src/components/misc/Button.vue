<template>
  <button v-bind:class="`${color? color : 'bg-transparent'}`">
    <div :class='`${text ? "py-1 px-4" : "p-2 "} flex items-center justify-between gap-2 transition-all duration-100`'>
      <Icon v-if="icon" class="h-6 transition-all duration-100" :icon="icon" />
      <h1 v-if="text">{{ text }}</h1>
    </div>
  </button>
</template>
<script setup lang=ts>
import Icon from "./Icon.vue";
defineProps<{
  text?: string;
  icon?: string;
  color?: string;
}>();
</script>

<style>
    .transparent {
      background-color: Transparent;
      background-repeat:no-repeat;
    }
    .buttonColor{
      background-color: color;
    }

</style>