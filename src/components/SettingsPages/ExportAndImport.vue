<template>
    <div>
        <div class="flex flex-col gap-3 w-38">
            <input type="file" hidden ref="importJsonHTMLElement" @change="onAddFiles" accept="application/json">
            <Button text="Export Settings" class=" border-dark-500 border-2 rounded-[8px] text-light-100"
                @click="anele.click()" />
            <Button text="Import Settings" class=" border-dark-500 border-2 rounded-[8px] text-light-100"
                @click="importJsonHTMLElement?.click()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import { AppState } from "../../../state";
import { api } from "../../services/api";
import Button from "../Misc/Button.vue";
import { ISettings } from "../../services/types";
const state = inject("state") as AppState;


const importJsonHTMLElement = ref<HTMLDivElement | undefined>(undefined);
const localStorageSettings = api.localStorageSettings;

let blobdtMIME = new Blob([JSON.stringify(localStorageSettings)], { type: "application/json" })
let urlToDownloadableSettings = URL.createObjectURL(blobdtMIME);
let anele = document.createElement("a")
anele.setAttribute("download", "moefetch_settings.json");
anele.href = urlToDownloadableSettings;

const onAddFiles = (event: any) => {
    const newFiles = event.target.files as File[];
    newFiles[0].text().then(txt => {
        try {
            const immidiateApply = state.stateVariables.settingsInstance.stock_settings.immidiately_apply_settings_after_import.checkBox?.checkBoxValue;
            let importedSettings: ISettings = JSON.parse(txt);
            state.stateVariables.settingsInstance.backend_url = importedSettings.backend_url;
            state.stateVariables.settingsInstance.database = importedSettings.database;
            state.stateVariables.settingsInstance.stock_settings = importedSettings.stock_settings;

            for (const key in importedSettings.special_params) {
                if (Object.prototype.hasOwnProperty.call(importedSettings.special_params, key)) {
                    if (state.stateVariables.settingsInstance.special_params && state.stateVariables.settingsInstance.special_params[key]) {
                        state.stateVariables.settingsInstance.special_params[key] = importedSettings.special_params[key];
                    }
                    else console.log("warning: couldn't import setting: ", key, " into ", "special_params");
                }
            }
            for (const key in importedSettings.special_settings) {
                if (Object.prototype.hasOwnProperty.call(importedSettings.special_settings, key)) {
                    if (state.stateVariables.settingsInstance.special_settings && state.stateVariables.settingsInstance.special_settings[key]) {
                        state.stateVariables.settingsInstance.special_settings[key] = importedSettings.special_settings[key];
                    }
                    else console.log("warning: couldn't import setting: ", key, " into ", "special_settings");
                }
            }
            if (immidiateApply) {
                state.saveSettings();
            }
        } catch (error) {
            //invalid json file
        }

    });
}

</script>

<style scoped lang="postcss"></style>