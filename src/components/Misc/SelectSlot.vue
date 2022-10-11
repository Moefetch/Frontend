<template>
  <div>
    <div class="selectedTopLeft" :style="checkboxStyle"  v-if="state.isEditing">
        <Icon :icon="selected ? 'checked_checkbox' : 'unchecked_checkbox'" class="w-[24px] h-[24px]"/>
    </div>
    <div :class="(selected ? ' border-[#254EE0] rounded-[0.5rem] border-width-[2px] relative': 'relative')" 
    :style="slotStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { AppState } from '../../../state'
import Icon from "../Misc/Icon.vue";

const state = (inject('state') as AppState).stateVariables;

defineProps<{
    selected?: boolean;
    slotStyle: string;
    checkboxStyle: string;
}>();

/* defineEmits([]);
 */
</script>

<style scoped lang="postcss">

.selectedTopLeft{
  @apply relative p-[2px] rounded-[6px] z-1;
  background-color: rgba(134, 134, 134, 0.575);
  margin-right: auto;
  width: fit-content;
  left: 1px;
  display: flex;
  flex-direction: row;
  gap: 4px;
}

</style>