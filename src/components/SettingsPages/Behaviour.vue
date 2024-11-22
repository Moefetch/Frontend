<template>
  <div>
    <div class="flex flex-col gap-[0.5rem]">
      <BinaryTextField :value="settingsForm.stock_settings.show_nsfw" />
      <BinaryTextField v-if="settingsForm.stock_settings.show_nsfw.checkBox?.checkBoxValue"
        :value="settingsForm.stock_settings.blur_nsfw" />
      <BinaryTextField :value="settingsForm.stock_settings.show_hidden" />
      <BinaryTextField :value="settingsForm.stock_settings.immidiately_apply_settings_after_import" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BinaryTextField from "../Misc/BinaryTextField.vue";
import { inject } from "vue";
import { AppState } from "../../../state";
const state = inject("state") as AppState;


const settingsForm = state.stateVariables.settingsInstance

</script>

<style scoped lang="postcss"></style>