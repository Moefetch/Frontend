<template>
  <Teleport to="body">
    <div
      class="p-2 absolute bg-[#2a2d34] bottom-10 left-1/2 transform-gpu -translate-x-1/2 rounded-[16px] shadow-xl flex items-center justify-center gap-2"
    >
      <div class="iconContainer bg-red-700" @click="deleteSelection()" >
        <IconVue icon="trash" class="w-6 h-6" />
      </div>
      <div class="iconContainer" @click="hideSelection()" >
        <IconVue icon="hide" class="w-6 h-6" />
      </div>
      <div class="iconContainer" @click="unhideSelection()" >
        <IconVue icon="unhide" class="w-6 h-6" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import IconVue from "./Icon.vue";
import { inject } from "vue";
import { AppState } from "../../../state";
const state = (inject('state') as AppState)

defineProps<{
  deleteSelection: Function;
  hideSelection: Function;
  unhideSelection: Function;
}>()
</script>

<style scoped lang="postcss">
.iconContainer {
    @apply p-1 rounded-[8px] cursor-pointer;
}

</style>
