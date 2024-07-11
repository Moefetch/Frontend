<template>
  <div>
    <div class="flex flex-col gap-[0.5rem]">
      <FieldErrorSlot :errorMessage="state.stateVariables.settingsFormError.backendUrlError">
        <input class="popupInputField" type="text" v-model="settingsForm.backend_url"
          placeholder="Backend   URL / Hostname and port e.g. http://127.0.0.1:2234/"
          @click="state.stateVariables.settingsFormError.backendUrlError = ''" />
      </FieldErrorSlot>
      <fieldset class="border-light-50 border-1 rounded-[4px] h-[fit-content] p-2 flex flex-col gap-3">
        <legend class="text-light-50 pl-1">Database </legend>
        <FieldErrorSlot
          :errorMessage="state.stateVariables.settingsFormError.selectDabase ? 'Please select a database type' : undefined">
          <BaseDropMenu :dropdownItemsArray="typeORMSupportedDatabases" @item-selected="selectDB"
            :defaultSelected="settingsForm?.database?.type || 'Select Type'"
            :class="`w-36 ${state.stateVariables.settingsFormError.selectDabase ? 'error' : ''} box-content`"
            @click="state.stateVariables.settingsFormError.selectDabase = false;" />
        </FieldErrorSlot>
        <div id="databaseUrl">
          <input class="inputFieldText text-[#CACACA] w-60" type="text" placeholder="Host"
            v-model="settingsForm.database.host">
          <h2 class="text-gray-100">:</h2>
          <input class="inputFieldText text-[#CACACA] w-30" type="text" placeholder="Port"
            v-model="settingsForm.database.port">
          <h2 class="text-gray-100">/</h2>
          <input class="inputFieldText text-[#CACACA] w-60" type="text" placeholder="Database"
            v-model="settingsForm.database.database">
        </div>
        <div class="checkbox_option" @click="settingsForm.database.useLogin = !settingsForm.database.useLogin">
          <Icon :icon="settingsForm.database.useLogin
        ? 'checked_checkbox'
        : 'unchecked_checkbox'
        " />
          <h2>Use Login</h2>
        </div>
        <div id="databaseUrl" v-if="settingsForm.database.useLogin">
          <input :class="`inputFieldText w-70 ${settingsForm.database.useLogin ? 'text-[#CACACA]' : 'text-[#818181]'}`"
            type="text" placeholder="Username" v-model="settingsForm.database.username"
            :disabled="!settingsForm.database.useLogin">
          <input :class="`inputFieldText w-70 ${settingsForm.database.useLogin ? 'text-[#CACACA]' : 'text-[#818181]'}`"
            type="text" placeholder="Password" v-model="settingsForm.database.password"
            :disabled="!settingsForm.database.useLogin">
        </div>
      </fieldset>

    </div>
  </div>
</template>

<script setup lang="ts">
import FieldErrorSlot from "../Misc/FieldErrorSlot.vue";
import BaseDropMenu from "../Misc/BaseDropMenu.vue";
import Button from "../Misc/Button.vue";
import { inject, reactive, ref } from "vue";
import Icon from "../Misc/Icon.vue";
import { AppState } from "../../../state";
import { ITypeORMDatabase } from "../../services/types";
import { api } from "../../services/api";
const state = inject("state") as AppState;

const settingsForm = state.stateVariables.settingsInstance

const typeORMSupportedDatabases = ["Select Type", "sqlite", "mysql", "postgres", "cockroachdb", "sap", "spanner", "mariadb", "better-sqlite3"]
function selectDB(db: ITypeORMDatabase["type"]) {
  if ((db as string) == "Select Type") {
    settingsForm.database.type = undefined;
  } else settingsForm.database.type = db;
}

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

#databaseUrl {
  @apply flex flex-row gap-2;
}

.popupInputField[type="text"] {
  @apply outline-none h-[2rem] w-[48rem] max-w-[48rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(202, 202, 202);
}

.inputFieldText[type="text"] {
  @apply outline-none box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
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