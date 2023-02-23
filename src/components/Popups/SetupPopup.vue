<template>
  <div class="setup_popup_container">
    <form class="flex flex-col gap-[1rem]" v-if="!formSubmittedToggle">
      <div
        class="flex flex-col gap-[0.5rem] overflow-y-auto overflow-x-hidden h-[70vh] w-[30rem]"
      >
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
          <div
            class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
          >
            <div class="h-[24px] right-0 flex flex-row items-center">
              <div
                class="checkbox_option"
                @click="
                  settingsForm.database_url.checkBoxValue =
                    !settingsForm.database_url.checkBoxValue
                "
              >
                <Icon
                  :icon="
                    settingsForm.database_url.checkBoxValue
                      ? 'checked_checkbox'
                      : 'unchecked_checkbox'
                  "
                />
                <h2>{{ settingsForm.database_url.checkBoxDescription }}</h2>
              </div>
            </div>
          </div>

          <FieldErrorSlot
            :errorMessage="settingsForm.database_url.errorMessage"
            v-if="settingsForm.database_url.stringValue"
          >
            <input
              :class="`${
                settingsForm.database_url.checkBoxValue
                  ? 'popupSaucenaoKeyInputField'
                  : 'popupSaucenaoKeyInputFieldDisabled'
              }`"
              type="text"
              v-model="settingsForm.database_url.stringValue.value"
              :placeholder="
                settingsForm.database_url.stringValue.stringPlaceholder
              "
              :disabled="!settingsForm.database_url.checkBoxValue"
              @click="settingsForm.database_url.errorMessage = ''"
            />
          </FieldErrorSlot>
        </div>
        <HorizontalSeparator :seperatorText="'Special Settings'" />
        <div
          v-for="(categorySettings, category) in settingsForm.special_settings"
        >
          <div v-for="(value, key) in categorySettings.specialCategorySettings">
            <div class="flex flex-col gap-[0.5rem]">
              <div
                class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
              >
                <div class="h-[24px] right-0 flex flex-row items-center">
                  <div
                    class="checkbox_option"
                    @click="value.checkBoxValue = !value.checkBoxValue"
                  >
                    <Icon
                      :icon="
                        value.checkBoxValue
                          ? 'checked_checkbox'
                          : 'unchecked_checkbox'
                      "
                    />
                    <h2>{{ value.checkBoxDescription }}</h2>
                  </div>
                </div>
              </div>

              <FieldErrorSlot
                :errorMessage="value.errorMessage"
                v-if="value.stringValue"
              >
                <input
                  :class="`${
                    value.checkBoxValue
                      ? 'popupSaucenaoKeyInputField'
                      : 'popupSaucenaoKeyInputFieldDisabled'
                  }`"
                  type="text"
                  v-model="value.stringValue.value"
                  :placeholder="value.stringValue.stringPlaceholder"
                  :disabled="!value.checkBoxValue"
                  @click="value.errorMessage = ''"
                />
              </FieldErrorSlot>
            </div>
          </div>
        </div>

        <HorizontalSeparator :seperatorText="'Special Params'" />
        <div
          v-for="(categorySettings, category) in settingsForm.special_params"
        >
          <div
            v-for="(
              params, key
            ) in categorySettings.specialHostnameSpecificParams"
          >
            <div v-for="(value, key) in params">
              <div class="flex flex-col gap-[0.5rem]">
                <div
                  class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
                >
                  <div class="h-[24px] right-0 flex flex-row items-center">
                    <div
                      class="checkbox_option"
                      @click="value.checkBoxValue = !value.checkBoxValue"
                    >
                      <Icon
                        :icon="
                          value.checkBoxValue
                            ? 'checked_checkbox'
                            : 'unchecked_checkbox'
                        "
                      />
                      <h2>{{ value.checkBoxDescription }}</h2>
                    </div>
                  </div>
                </div>

                <FieldErrorSlot
                  :errorMessage="value.errorMessage"
                  v-if="value.stringValue"
                >
                  <input
                    :class="`${
                      value.checkBoxValue
                        ? 'popupSaucenaoKeyInputField'
                        : 'popupSaucenaoKeyInputFieldDisabled'
                    }`"
                    type="text"
                    v-model="value.stringValue.value"
                    :placeholder="value.stringValue.stringPlaceholder"
                    :disabled="!value.checkBoxValue"
                    @click="value.errorMessage = ''"
                  />
                </FieldErrorSlot>
              </div>
            </div>
          </div>
        </div>

        <HorizontalSeparator :seperatorText="'Stock Settings'" />
        <div v-for="(value, key) in settingsForm.stock_settings">
          <div class="flex flex-col gap-[0.5rem]">
            <div
              class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
            >
              <div class="h-[24px] right-0 flex flex-row items-center">
                <div
                  class="checkbox_option"
                  @click="toggleAStockSettingsFormVariable(key)"
                >
                  <Icon
                    :icon="
                      value.checkBoxValue
                        ? 'checked_checkbox'
                        : 'unchecked_checkbox'
                    "
                  />
                  <h2>{{ value.checkBoxDescription }}</h2>
                </div>
              </div>
            </div>

            <FieldErrorSlot
              :errorMessage="value.errorMessage"
              v-if="value.stringValue"
            >
              <input
                :class="`${
                  value.checkBoxValue
                    ? 'popupSaucenaoKeyInputField'
                    : 'popupSaucenaoKeyInputFieldDisabled'
                }`"
                type="text"
                v-model="value.stringValue.value"
                :placeholder="value.stringValue.stringPlaceholder"
                :disabled="!value.checkBoxValue"
                @click="value.errorMessage = ''"
              />
            </FieldErrorSlot>
          </div>
        </div>
      </div>
      <router-link
        to="/help"
        class="absolute bottom-8 left-8 w-[fit-content] rounded-[8px]"
      >
        <Button
          type="button"
          text="Help"
          color="#525252"
          class="w-[fit-content] rounded-[8px]"
          @click="state.popup = ''"
        />
      </router-link>

      <Button
        type="button"
        text="Use Defaults"
        color="#a41414"
        class="absolute bottom-8 right-[25%] w-[fit-content] rounded-[8px]"
        @click="useDefaults()"
      />
      <Button
        type="button"
        text="Confirm"
        color="#4d6d8d"
        class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]"
        @click="submit()"
      />
    </form>
    <div v-else class="m-auto items-center flex flex-col pt-25 pb-25">
      <img
        :src="`${
          connectionSuccess
            ? '/Gifs/ok_success.gif'
            : '/Gifs/loading_three_circles.gif'
        }`"
        alt=""
        class="w-[6rem]"
      />
      <h2 class="textLoadClass">
        {{ connectionSuccess ? "Connected" : "Connecting" }}
      </h2>
      <Button
        v-if="connectionSuccess"
        type="button"
        text="Done"
        color="#254ee0"
        class="absolute bottom-8 w-[10rem] text-center rounded-[8px]"
        @click="emitSubmit()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppState } from "../../../state";
import Icon from "../Misc/Icon.vue";
import FieldErrorSlot from "../Misc/FieldErrorSlot.vue";
import { onMounted, ref, inject, reactive } from "vue";
import Button from "../Misc/Button.vue";
import HorizontalSeparator from "../Misc/HorizontalSeparator.vue";

import { api } from "../../services/api";
import { Settings, Setting } from "../../services/settings";
import type { ISettings, ISettingsErrorObject } from "../../services/types";
import { stockSettings, defaultDatabase_url } from "../../services/types";

const state = (inject("state") as AppState).stateVariables;

function emitSubmit() {
  state.popup = "";
}

const connectToBackendAndDB = api.connectToBackendAndDB;

const formSubmittedToggle = ref(false);
const connectionSuccess = ref(false);
const settingsFormError = reactive({
  backendUrlError: "",
  hasError: false,
});

const settingsForm = reactive<Settings>(api.settings); /* 
type TogglableVariable =
  | "search_diff_sites"
  | "use_mongodb"
  | "pixiv_download_first_image_only"
  | "show_hidden"
  | "blur_nsfw"
  | "use_pixiv_cookie"
  | "show_nsfw";
function toggleASettingsFormVariable(variableNameToToggle: TogglableVariable) {
  settingsForm[variableNameToToggle] = !settingsForm[variableNameToToggle];
} */
type TogglableVariable2 = "show_hidden" | "blur_nsfw" | "show_nsfw";
function toggleAStockSettingsFormVariable(
  variableNameToToggle: TogglableVariable2
) {
  settingsForm.stock_settings[variableNameToToggle].checkBoxValue =
    !settingsForm.stock_settings[variableNameToToggle].checkBoxValue;
}

const defaultSettings = new Settings({
  backend_url: "http://127.0.0.1:2234/",
  database_url: defaultDatabase_url,
  stock_settings: stockSettings,
  special_settings: undefined,
  special_params: undefined,
});

function checkValidMongoDb(enabledBool: boolean, stringValue?: string) {
  if (enabledBool && !stringValue) return "No Database url was provided";

  const HOSTS_REGEX =
    /(?<protocol>mongodb(?:\+srv|)):\/\/(?:(?<username>[^:]*)(?::(?<password>[^@]*))?@)?(?<hosts>(?!:)[^\/?@]+)(?<rest>.*)/;

  if (enabledBool && stringValue && !HOSTS_REGEX.test(stringValue))
    return "Database url invalid";
}

async function submit() {
  if (!settingsForm.backend_url)
    settingsFormError.backendUrlError = "No Backend url was provided";

  settingsForm.database_url.errorMessage =
    checkValidMongoDb(
      settingsForm.database_url.checkBoxValue,
      settingsForm.database_url.stringValue?.value
    ) ?? "";

  if (
    settingsFormError.backendUrlError ||
    settingsForm.database_url.errorMessage
  )
    return;
  else {
    formSubmittedToggle.value = true;

    const connectionResponse = await connectToBackendAndDB(settingsForm);
    if (connectionResponse.hasError) {
      formSubmittedToggle.value = false;
      settingsForm.database_url = new Setting(
        connectionResponse.responseSettings.database_url
      );
      settingsForm.stock_settings =
        connectionResponse.responseSettings.stock_settings;
      settingsForm.special_params =
        connectionResponse.responseSettings.special_params;
      settingsForm.special_settings =
        connectionResponse.responseSettings.special_settings;
    } else {
      localStorage.setItem("settings", JSON.stringify(settingsForm));
      connectionSuccess.value = true;
    }
  }
}
async function useDefaults() {
  //i have to to do this retarded bs cus it's a const reactive

  settingsForm.backend_url = defaultSettings.backend_url;
  settingsForm.database_url = defaultSettings.database_url;
  settingsForm.stock_settings = defaultSettings.stock_settings;
  settingsForm.special_params = defaultSettings.special_params;
  settingsForm.special_settings = defaultSettings.special_settings;
  await submit();
}
</script>

<style lang="postcss">
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
  @apply outline-none h-[2rem] w-[58vw] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
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
</style>
