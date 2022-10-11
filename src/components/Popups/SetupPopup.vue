<template>
    <div class="setup_popup_container">
        <form class="flex flex-col gap-[1rem]" v-if="!formSubmittedToggle"> 
            <div class="flex flex-col gap-[0.5rem]">
                <FieldErrorSlot :errorMessage="settingsFormError.backendUrlError">
                    <input class="popupInputField"
                        type="text"
                        v-model="settingsForm.backend_url"
                        placeholder="Backend   URL / Hostname and port e.g. http://127.0.0.1:2234/"
                        @click="settingsFormError.backendUrlError = ''"
                    />
                </FieldErrorSlot>
            </div>
            <div class="flex flex-col gap-[0.5rem]">


            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleASettingsFormVariable('use_mongodb')">   
                        <Icon :icon="settingsForm.use_mongodb ? 'checked_checkbox' : 'unchecked_checkbox'" />
                        <h2>Use a mongoDB database</h2>
                    </div>
                </div>
            </div>
            <FieldErrorSlot :errorMessage="settingsFormError.databaseUrlError">
                <input :class="`${settingsForm.use_mongodb ? 'popupSaucenaoKeyInputField' : 'popupSaucenaoKeyInputFieldDisabled'}`"
                type="text"
                v-model="settingsForm.database_url"
                placeholder="Database URL, use the form mongodb://username:password@host:port/moefetch"
                :disabled="settingsForm.use_mongodb"
                @click="settingsFormError.databaseUrlError = ''"
            />
            </FieldErrorSlot>
            </div>

            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleASettingsFormVariable('pixiv_download_first_image_only')">   
                        <Icon :icon="!settingsForm.pixiv_download_first_image_only? 'checked_checkbox' : 'unchecked_checkbox'" />
                        <h2>Download all images in pixiv pages</h2>
                    </div>
                </div>
            </div>

            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleASettingsFormVariable('search_diff_sites')">   
                        <Icon :icon="!settingsForm.search_diff_sites? 'unchecked_checkbox' : 'checked_checkbox'" />
                        <h2>Use SauceNao to search different sites for possibly higher quality</h2>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-[0.5rem]">
                <FieldErrorSlot :errorMessage="settingsFormError.saucenaoApiKeyError">
                    <input :class="`${settingsForm.search_diff_sites ? 'popupSaucenaoKeyInputField' : 'popupSaucenaoKeyInputFieldDisabled'}`"
                    type="text"
                    v-model="settingsForm.saucenao_api_key"
                    placeholder="Saucenao API key (for the option above)"
                    :disabled="!settingsForm.search_diff_sites"
                    @click="settingsFormError.saucenaoApiKeyError = ''"
                    />
                </FieldErrorSlot>
            </div>
            
            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleASettingsFormVariable('show_nsfw')">   
                        <Icon :icon="settingsForm.show_nsfw  ? 'checked_checkbox' : 'unchecked_checkbox'" />
                        <h2>Show NSFW tagged posts</h2>
                    </div>
                </div>
            </div>
            
            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleASettingsFormVariable('blur_nsfw')">   
                        <Icon :icon="settingsForm.blur_nsfw? 'checked_checkbox' : 'unchecked_checkbox'" />
                        <h2>Blur NSFW tagged posts</h2>
                    </div>
                </div>
            </div>

            <div class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center">
                <div class="h-[24px] right-0 flex flex-row items-center">
                    <div class="checkbox_option" @click="toggleASettingsFormVariable('show_hidden')">   
                        <Icon :icon="settingsForm.show_hidden? 'checked_checkbox' : 'unchecked_checkbox'" />
                        <h2>Show hidden posts and albums</h2>
                    </div>
                </div>
            </div>
            <router-link to="/help" class="absolute bottom-8 left-8 w-[fit-content] rounded-[8px]">
                <Button type="button" text="Help" color="#525252" class="w-[fit-content] rounded-[8px]"  @click="state.popup = ''"/>
            </router-link>
            
            <Button type="button" text="Use Defaults" color="#a41414" class="absolute bottom-8 right-[25%] w-[fit-content] rounded-[8px]" @click="useDefaults()"/>

            <Button type="button" text="Confirm" color="#4d6d8d" class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]" @click="submit()"/>
        </form>
        <div v-else class="m-auto items-center flex flex-col pt-25 pb-25">
            <img :src="`${connectionSuccess ? '/Gifs/ok_success.gif' :'/Gifs/loading_three_circles.gif'}`" alt="" class="w-[6rem]">
            <h2 class="textLoadClass">{{connectionSuccess ? 'Connected' : 'Connecting' }}</h2>
            <Button v-if="connectionSuccess" type="button" text="Done" color="#254ee0" class="absolute bottom-8 w-[10rem] text-center rounded-[8px]" @click="emitSubmit()"/>

        </div>
    </div>
</template>

<script setup lang="ts">
import { AppState } from '../../../state';
import Icon from "../Misc/Icon.vue";
import FieldErrorSlot from '../Misc/FieldErrorSlot.vue';
import { onMounted, ref, inject, reactive  } from "vue";
import Button from "../Misc/Button.vue";

import { api } from "../../services/api";
import type { ISettings, ISettingsErrorObject } from "../../services/types";
const state = (inject('state') as AppState).stateVariables;

function emitSubmit() {
    
    state.popup = ''
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
const parsedLocalStorageSettings: ISettings | null = localStorageSettings ? JSON.parse(localStorageSettings) : null;
const settingsForm = reactive<ISettings>(parsedLocalStorageSettings ? {...parsedLocalStorageSettings} : {
    backend_url: "",
    use_mongodb: false,
    show_nsfw: true,
    blur_nsfw: true,
    show_hidden: false,
    search_diff_sites: false,
    pixiv_download_first_image_only: true,
    saucenao_api_key: undefined,
});
type TogglableVariable = 'search_diff_sites' | 'use_mongodb' | 'pixiv_download_first_image_only' | 'show_hidden' | 'blur_nsfw' | 'show_nsfw';
function toggleASettingsFormVariable(variableNameToToggle: TogglableVariable) {
    settingsForm[variableNameToToggle] = !settingsForm[variableNameToToggle]
}

const defaultSettings: ISettings = {
    backend_url: "http://127.0.0.1:2234/",
    use_mongodb: false,
    show_nsfw: true,
    blur_nsfw: true,
    show_hidden: false,
    search_diff_sites: false,
    pixiv_download_first_image_only: true,
    saucenao_api_key: undefined,
}

async function submit() {
    if (parsedLocalStorageSettings && (parsedLocalStorageSettings.backend_url === settingsForm.backend_url) && (parsedLocalStorageSettings.database_url === settingsForm.database_url) && (parsedLocalStorageSettings.saucenao_api_key === settingsForm.saucenao_api_key)) {
        connectToBackendAndDB(settingsForm);
        localStorage.setItem("settings", JSON.stringify(settingsForm));
        state.popup = '';
        return 
    }
    if (!settingsForm.backend_url) settingsFormError.backendUrlError = "No Backend url was provided";
    if (settingsForm.use_mongodb && !settingsForm.database_url) settingsFormError.databaseUrlError = "No Database url was provided";
    if (!settingsForm.saucenao_api_key && settingsForm.search_diff_sites) settingsFormError.saucenaoApiKeyError = "No saucenao api key was provided";

    if (settingsForm.use_mongodb && settingsForm.database_url && !HOSTS_REGEX.test(settingsForm.database_url)) settingsFormError.databaseUrlError = "Database url invalid";

    if (settingsFormError.backendUrlError || settingsFormError.databaseUrlError || settingsFormError.saucenaoApiKeyError) return;
    else {
        formSubmittedToggle.value = true;
        
        const connectionResponse = await connectToBackendAndDB(settingsForm);
        if ((connectionResponse.databaseUrlError || connectionResponse.saucenaoApiKeyError || connectionResponse.backendUrlError)) {
            formSubmittedToggle.value = false;

            settingsFormError.backendUrlError = connectionResponse.backendUrlError;
            settingsFormError.databaseUrlError = connectionResponse.databaseUrlError;
            settingsFormError.saucenaoApiKeyError = connectionResponse.saucenaoApiKeyError;
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
@apply absolute p-10 pb-24 text-white-400;
@apply border-[3px] border-[#254EE0] gap-[14px];
@apply flex-row gap-[4px] align-center m-auto;

z-index: 3;

display: flex;
gap:32px;

box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
border-radius: 4px;
background-color: rgba(42, 45, 52, 1); 

width: var(--setup_popup_width);
height: fit-content;


/* 
left: calc((100vw - var(--setup_popup_width))/2);
right: calc((100vw - var(--setup_popup_width) )/2);
top: calc((100vh - var(--setup_popup_height) + 7vh)/2) */
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