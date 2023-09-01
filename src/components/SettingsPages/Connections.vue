<template>
  <div>
    <div class="flex flex-col gap-[0.5rem]">
        <FieldErrorSlot :errorMessage="settingsFormError.backendUrlError">
        <input
            class="popupInputField"
            type="text"
            v-model="settingsForm.backend_url"
            placeholder="Backend   URL / Hostname and port e.g. http://127.0.0.1:2234/"
            @click="settingsFormError.backendUrlError = ''"
        />
        </FieldErrorSlot>
    </div>

    <div class="flex flex-col gap-[0.5rem]">
          <div v-if="settingsForm.database_url.checkBox"
            class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
          >
            <div class="h-[24px] right-0 flex flex-row items-center">
              <div
                class="checkbox_option"
                @click="
                  settingsForm.database_url.checkBox.checkBoxValue =
                    !settingsForm.database_url.checkBox.checkBoxValue
                "
              >
                <Icon
                  :icon="
                    settingsForm.database_url.checkBox.checkBoxValue
                      ? 'checked_checkbox'
                      : 'unchecked_checkbox'
                  "
                />
                <h2>{{ settingsForm.database_url.checkBox.checkBoxDescription }}</h2>
              </div>
            </div>
          </div>

          <FieldErrorSlot
            :errorMessage="settingsForm.database_url.errorMessage"
            v-if="settingsForm.database_url.textField" 
          >
            <input
            :class="`${
                  settingsForm.database_url.checkBox ? 
                  settingsForm.database_url.checkBox?.checkBoxValue
                    ? 'settingsInputField'
                    : 'settingsInputFieldDisabled' 
                  :  'settingsInputField'
                }`"
              type="text"
              v-model="settingsForm.database_url.textField.value"
              :placeholder="
                settingsForm.database_url.textField.fieldPlaceholder
              "
              :disabled="settingsForm.database_url.checkBox ? !settingsForm.database_url.checkBox.checkBoxValue : false"
              @click="settingsForm.database_url.errorMessage = ''"
            />
          </FieldErrorSlot>
        </div>
  </div>
</template>

<script setup lang="ts">
import FieldErrorSlot from "../Misc/FieldErrorSlot.vue";
import { inject, reactive } from "vue";
import Icon from "../Misc/Icon.vue";
import { AppState } from "../../../state";
const state = inject("state") as AppState;


const settingsForm = state.stateVariables.settingsInstance
const settingsFormError = reactive({
  backendUrlError: "",
  hasError: false,
});

/* defineProps<{}>();
defineEmits([]);
 */
</script>

<style scoped lang="postcss">
:root {
  --setup_popup_height: 500px;
  --setup_popup_width: 680px;
}

.setup_popup_container {
  @apply absolute p-10 pb-24 text-gray-100 top-3 max-h-[90vh] min-w-[30rem];
  @apply border-[3px] border-[#254EE0] gap-[14px];
  @apply flex-row gap-[4px] align-middle m-auto;

  z-index: 3;

  display: flex;
  gap: 32px;

  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background-color: rgba(42, 45, 52, 1);

  width: fit-content;
  height: fit-content;

  /* 
left: calc((100vw - var(--setup_popup_width))/2);
right: calc((100vw - var(--setup_popup_width) )/2);
top: calc((100vh - var(--setup_popup_height) + 7vh)/2) */
}
.popupInputField[type="text"] {
  @apply outline-none h-[2rem] w-[48rem] max-w-[48rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(202, 202, 202);
}

.textLoadClass {
  @apply box-border font-medium text-22px border-none px-6px py-2;
  font-family: "Work Sans", sans-serif;
  color: rgb(202, 202, 202);
}

.popupSaucenaoKeyInputField[type="text"] {
  @apply outline-none h-[2rem] w-[58vw] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(202, 202, 202);
}
.popupSaucenaoKeyInputFieldDisabled[type="text"] {
  @apply outline-none h-[2rem] w-[58vw] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(129, 129, 129);
}
.checkbox_option_container h1 {
  @apply text-12px w-[100%];
  font-family: "Work Sans", sans-serif;
  color: white;
}
.checkbox_option {
  @apply text-12px flex flex-row items-center h-[24px] align-middle w-[35rem] gap-1 cursor-pointer;
  font-family: "Work Sans", sans-serif;
  color: white;
}
.checkbox_option img {
  @apply h-[24px] w-[24px];
}

.error {
  @apply border-rose-600 border-width-[2px] !important;
}

.settingsInputField[type="text"] {
  @apply outline-none h-[2rem] w-[48rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 resize-none;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(202, 202, 202);
}
.settingsInputFieldDisabled[type="text"] {
  @apply outline-none h-[2rem] w-[48rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 resize-none;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(129, 129, 129);
}
</style>