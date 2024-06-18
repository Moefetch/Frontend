<template>
  <div>
    <div v-for="(value, category) in settingsForm.special_settings">
      <div class="flex flex-col gap-[0.5rem]">
        <BinaryTextField :value="value" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import BinaryTextField from "../Misc/BinaryTextField.vue";
import { inject } from "vue";
import { AppState } from "../../../state";
const state = inject("state") as AppState;

const settingsForm = state.stateVariables.settingsInstance

/* defineProps<{}>();
defineEmits([]);
 */
</script>

<style scoped lang="postcss"></style>