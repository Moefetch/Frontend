<template>
  <div :class="`popupContainer ${dontGrayBackground ? '' : 'grayBackground'}`">
    <div class="slottedElement" ref="target">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppState } from "../../../state";
import { ref, inject } from "vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";

const target = ref(null);
const props = defineProps<{
  dontGrayBackground?: boolean
}>();
onClickOutside(target, (e) => {
  if (!(e.target as HTMLElement).id) state.popup = "";
});

onKeyStroke("Escape", (e) => {
  state.popup = "";
  e.preventDefault();
}
);

const state = (inject("state") as AppState).stateVariables;
</script>

<style lang="postcss">
.popupContainer {
  @apply absolute cursor-pointer w-[100%] h-[calc(100vh-40px)] left-0 top-[40px] z-1 max-h-[calc(100vh-40px)] items-center flex justify-center;
}

.grayBackground {
  background-color: rgb(53, 53, 53, 0.4);
}

.slottedElement {
  @apply z-3 cursor-default flex items-center justify-center;
}
</style>
