<template>
  <div>
    <div class="flex flex-col gap-[0.5rem]">
      <BinaryTextField :value="settingsForm.stock_settings.thumbnail_list_to_left" />
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