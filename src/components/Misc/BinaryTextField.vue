<template>
  <div>
    <div v-if="value.checkBox"
      class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
      <div class="h-[24px] right-0 flex flex-row items-center">
        <button class="checkbox_option" @click="value.checkBox.checkBoxValue = !value.checkBox.checkBoxValue">
          <Icon :icon="value.checkBox.checkBoxValue
      ? 'checked_checkbox'
      : 'unchecked_checkbox'
      " />
          <h2>{{ value.checkBox.checkBoxDescription }}</h2>
        </button>
      </div>
    </div>

    <FieldErrorSlot :errorMessage="value.errorMessage" v-if="value.textField">
      <input :class="`${value.checkBox ?
      value.checkBox?.checkBoxValue
        ? 'addNewImageInputField'
        : 'addNewImageInputFieldDisabled'
      : 'addNewImageInputField'
      }`" type="text" v-model="value.textField.value" :placeholder="value.textField.fieldPlaceholder"
        :disabled="value.checkBox ? !value.checkBox.checkBoxValue : false" @click="value.errorMessage = ''" />
    </FieldErrorSlot>
  </div>
</template>

<script setup lang="ts">
import FieldErrorSlot from "./FieldErrorSlot.vue";
import { IParam } from '../../services/types';
import Icon from './Icon.vue';


defineProps<{
  value: IParam
}>();


/* 
defineEmits([]);
 */
</script>

<style scoped lang="postcss">
.checkbox_option {
  @apply text-12px flex flex-row items-center h-[24px] align-middle w-[35rem] gap-1 cursor-pointer;
  font-family: "Work Sans", sans-serif;
  color: white;
}
</style>