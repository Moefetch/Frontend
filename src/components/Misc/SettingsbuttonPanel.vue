<template>
  <div class="flex flex-row-reverse gap-4">
    <Button text="Apply" color="#4d6d8d" class="rounded-[8px] text-light-100" @click="state.saveSettings()"/>
    <Button text="Use Defaults" color="#a41414" class="rounded-[8px] text-light-100" @click="state.useDefaultSettings()"/>
  </div>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
import { AppState } from "../../../state";
import { inject } from "vue";
const state = inject("state") as AppState;

/* defineProps<{}>();
*/
//defineEmits(["apply", "use_defaults"]);
</script>

<style scoped lang="postcss">

</style>