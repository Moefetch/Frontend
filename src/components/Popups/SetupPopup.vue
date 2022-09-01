<template>
    <div class="setup_popup_container">
        <form class="flex flex-col gap-[1rem]" v-if="!formSubmittedToggle"> 
            <div class="flex flex-col gap-[0.5rem]">
                <h2 class="text-red-500 indent-2px text-14px" v-if="settingsFormError.backendUrlError" :style="`${settingsFormError.backendUrlError? '' : 'display: none;'}`">{{settingsFormError.backendUrlError}}</h2>
                <div :class="`${settingsFormError.backendUrlError ? 'error' : ''}`">
                    <input class="popupInputField"
                    type="text"
                    v-model="settingsForm.backend_url"
                    placeholder="Backend   URL / Hostname and port e.g. http://127.0.0.1:2234/"
                    @click="settingsFormError.backendUrlError = ''"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-[0.5rem]">

            <h2 class="text-red-500 indent-2px text-14px" v-if="settingsFormError.databaseUrlError" :style="`${settingsFormError.databaseUrlError? '' : 'display: none;'}`">{{settingsFormError.databaseUrlError}}</h2>
            <div :class="`${settingsFormError.databaseUrlError ? 'error' : ''}`">
                <input class="popupInputField"
                type="text"
                v-model="settingsForm.database_url"
                placeholder="Database URL, use the form mongodb://username:password@host:port/moefetch"
                @click="settingsFormError.databaseUrlError = ''"
            />
            </div>
            </div>

            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="togglePixivDownloadAll()">   
                        <Icon :icon="!settingsForm.pixiv_download_first_image_only? 'checked_checkbox' : 'unchecked_checkbox'" />
                        <h2>Download all images in pixiv pages</h2>
                    </div>
                </div>
            </div>

            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleSearchForDiffSites()">   
                        <Icon :icon="!settingsForm.search_diff_sites? 'unchecked_checkbox' : 'checked_checkbox'" />
                        <h2>Use SauceNao to search different sites for possibly higher quality</h2>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-[0.5rem]">
                <h2 class="text-red-500 indent-2px text-14px" v-if="settingsFormError.saucenaoApiKeyError" :style="`${settingsFormError.saucenaoApiKeyError? '' : 'display: none;'}`">{{settingsFormError.saucenaoApiKeyError}}</h2>
                <div :class="`${settingsFormError.saucenaoApiKeyError ? 'error' : ''}`">
                    <input :class="`${settingsForm.search_diff_sites ? 'popupSaucenaoKeyInputField' : 'popupSaucenaoKeyInputFieldDisabled'}`"
                    type="text"
                    v-model="settingsForm.saucenao_api_key"
                    placeholder="Saucenao API key (for the option above)"
                    :disabled="!settingsForm.search_diff_sites"
                    @click="settingsFormError.saucenaoApiKeyError = ''"
                    />
                </div>
            </div>
            <Button type="button" text="Use Defaults" color="#a41414" class="absolute bottom-8 left-8 w-[fit-content] rounded-[8px]" @click="useDefaults()"/>

            <Button type="button" text="Confirm" color="#4d6d8d" class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]" @click="submit()"/>
        </form>
        <div v-else class="m-auto items-center flex flex-col">
            <img :src="`${connectionSuccess ? '/Gifs/ok_success.gif' :'/Gifs/loading_three_circles.gif'}`" alt="" class="w-[6rem]">
            <h2 class="textLoadClass">{{connectionSuccess ? 'Connected' : 'Connecting' }}</h2>
            <Button v-if="connectionSuccess" type="button" text="Done" color="#254ee0" class="absolute bottom-8 w-[10rem] text-center rounded-[8px]" @click="emitSubmit()"/>

        </div>
    </div>
</template>

<script setup lang="ts">

import Icon from "../Misc/Icon.vue";

import { onMounted, ref, reactive } from "vue";
import Button from "../Misc/Button.vue";

import api from "../../services/api";
import type { ISettings, ISettingsErrorObject } from "../../services/types";

const emit = defineEmits(['sumbittedSettings']);

function emitSubmit() {
    emit('sumbittedSettings')
}


const connectToBackendAndDB = api.connectToBackendAndDB;
const HOSTS_REGEX = /(?<protocol>mongodb(?:\+srv|)):\/\/(?:(?<username>[^:]*)(?::(?<password>[^@]*))?@)?(?<hosts>(?!:)[^\/?@]+)(?<rest>.*)/;

const formSubmittedToggle = ref(false);
const connectionSuccess = ref(false);
const settingsFormError = reactive<ISettingsErrorObject>({
    backendUrlError: "" ,
    databaseUrlError: "",
    saucenaoApiKeyError: ""

})
const localStorageSettings = localStorage.getItem("settings") //to see if exists

const settingsForm = reactive<ISettings>(localStorageSettings ? JSON.parse(localStorageSettings) : {
    backend_url: "",
    database_url: "",
    search_diff_sites: false,
    pixiv_download_first_image_only: true,
    saucenao_api_key: undefined,
});

function toggleSearchForDiffSites() {
    settingsForm.search_diff_sites = !settingsForm.search_diff_sites;
}


function togglePixivDownloadAll() {
    settingsForm.pixiv_download_first_image_only = !settingsForm.pixiv_download_first_image_only;
}


const defaultSettings: ISettings = {
    backend_url: "http://127.0.0.1:2234/",
    database_url: "mongodb://127.0.0.1:27017/moefetch",
    search_diff_sites: false,
    pixiv_download_first_image_only: true,
    saucenao_api_key: undefined,
}

async function submit() {
    if (!settingsForm.backend_url) settingsFormError.backendUrlError = "No Backend url was provided";
    if (!settingsForm.database_url) settingsFormError.databaseUrlError = "No Database url was provided";
    if (!settingsForm.saucenao_api_key && settingsForm.search_diff_sites) settingsFormError.saucenaoApiKeyError = "No saucenao api key was provided";
    if (!HOSTS_REGEX.test(settingsForm.database_url)) settingsFormError.databaseUrlError = "Database url invalid";

    if (settingsFormError.backendUrlError || settingsFormError.databaseUrlError || settingsFormError.saucenaoApiKeyError) return;
    else {
        formSubmittedToggle.value = true;
        const connectionResponse = await connectToBackendAndDB(settingsForm);
        if ((connectionResponse.databaseUrlError || connectionResponse.saucenaoApiKeyError || connectionResponse.backendUrlError)) {
            formSubmittedToggle.value = false;
            if (connectionResponse.backendUrlError) {
                settingsFormError.backendUrlError = connectionResponse.backendUrlError;
            }
            if (connectionResponse.databaseUrlError) {
                settingsFormError.databaseUrlError = connectionResponse.databaseUrlError;
            } 
            
            if (connectionResponse.saucenaoApiKeyError) {
                settingsFormError.saucenaoApiKeyError = connectionResponse.saucenaoApiKeyError;
            }
        }
        else {
            localStorage.setItem("settings", JSON.stringify(settingsForm))
            connectionSuccess.value = true;
        }
    }

}
async function useDefaults() {
    //i have to to do this retarded bs cus it's a const reactive
    settingsForm.backend_url = defaultSettings.backend_url;
    settingsForm.database_url = defaultSettings.database_url;
    settingsForm.pixiv_download_first_image_only = defaultSettings.pixiv_download_first_image_only;
    settingsForm.saucenao_api_key = defaultSettings.saucenao_api_key;
    settingsForm.search_diff_sites = defaultSettings.search_diff_sites;

    await submit()
}
</script>

<style lang="postcss">

:root {
    --setup_popup_height: 500px;
    --setup_popup_width: 680px;
}
      
.setup_popup_container {
@apply absolute top-[50%] left-[50%] p-10 text-white-400;
@apply border-[3px] border-[#254EE0] gap-[14px];
@apply flex-row gap-[4px] align-center m-auto;

z-index: 1;

display: flex;
gap:32px;

box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
border-radius: 4px;
background-color: rgba(42, 45, 52, 1); 

width: var(--setup_popup_width);
height: var(--setup_popup_height);



left: calc((100vw - var(--setup_popup_width))/2);
right: calc((100vw - var(--setup_popup_width) )/2);
top: calc((100vh - var(--setup_popup_height) + 7vh)/2)
}
.popupInputField[type="text"] {
    @apply outline-none h-[2rem] w-[37.5rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
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
    @apply outline-none h-[2rem] w-[37.5rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
    background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
    font-family: "Work Sans", sans-serif;
    color: rgb(202, 202, 202);
}
.popupSaucenaoKeyInputFieldDisabled[type="text"] {
    @apply outline-none h-[2rem] w-[37.5rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
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