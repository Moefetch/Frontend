<template>
  <button :class="`${color? '' : 'bg-transparent'} ${disabled ? 'cursor-default' : 'cursor-pointer'}`" :style="`${color? 'background-color: ' + `${disabled ? (colorGray ?? '#444') : color }` : '' }`" :id="buttonID" :cursor="disabled ? 'default' : 'pointer'" :disabled="disabled">
    <div :class='`${text ? "py-1 px-4" : "p-2 "} flex items-center justify-between gap-2 transition-all duration-100 text-center`' :id="buttonID" >
      <Icon v-if="icon" :class="`h-6 transition-all duration-100 ${disabled ? 'grayedOut' : ''}`" :icon="icon" :id="buttonID"/>
      <h1 v-if="text" class="m-auto" :id="buttonID">{{ text }}</h1>
    </div>
  </button>
</template>
<script setup lang=ts>
import Icon from "./Icon.vue";
defineProps<{
  text?: string;
  icon?: string;
  color?: string;
  colorGray?: string;
  buttonID?: string;
  disabled?: boolean;
}>();
</script>

<style lang="postcss">

:root {
  --color: var(--color);
}
.transparent {
  background-color: Transparent;
  background-repeat:no-repeat;
}
.buttonColor{
  background-color: color;
}

.grayedOut{
  filter: opacity(50%);
}

</style>