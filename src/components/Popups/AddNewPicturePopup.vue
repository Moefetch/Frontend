<template>
  <div class="add_new_popup_container">
    <div class="flex flex-col gap-2">
      <div class="m-auto w-full justify-center align-middle items-center flex flex-col">
        <div class="overflow-hidden rounded-[0.25rem] max-w-[180px] max-h-[140px] min-h-2" >
          <div v-if="picForm.tempFileStore?.length" class="flex flex-row gap-1 overflow-x-scroll">
            <div v-for="pic in picForm.tempFileStore" class="border-transparent border-b-width-[10px] border-t-width-[10px]">
              <img 
                class="max-w-[90px] max-h-[100px] rounded-[8px] relative object-contain"
                :src="pic.filePreviewURL" alt=""
              >
            </div>
          </div>
        </div>
        <div v-if="picFormArrayLength > 1" class="m-auto w-full justify-center align-middle items-center flex flex-row">
          <Button
            text=""
            icon="left"
            color=""
            :disabled="(entryIndexer == 0 && picFormArrayLength == 1)"
            class="w-[36px] rounded-[8px]"
            @click="changeIndexer('minus')"
            />

          <h2 >{{ (entryIndexer + 1) + " / " + picFormArrayLength }}</h2>

          <Button
            text=""
            icon="right"
            :disabled="((entryIndexer - 1) == picFormArrayLength)"
            color=""
            class="w-[36px] rounded-[8px]"
            @click="changeIndexer('plus')"
            />
        </div>
      </div>

      <div class="flex flex-row gap-1">
        <div class="flex flex-col gap-1">
          <FieldErrorSlot :errorMessage="picUrlErrorMessage">
            <input v-if="!editBulkToggle"
            v-model="picForm.url"
              class="inputField"
              type="text"
              :disabled="!!picForm.tempFileStore?.length"
              placeholder="Image URL or post URL"
              @click="picUrlErrorMessage = ''"
            />
            <textarea v-else
              v-model="picForm.url"
              class="inputField"
              :style="`height: ${calculateHeightForTextArea(
                picForm.url.split('\n').length * 11.6 + 20
              )}px`"
              type="text"
              :disabled="!!picForm.tempFileStore?.length"
              placeholder="Image URL or post URL"
              @click="picUrlErrorMessage = ''"
            />
          </FieldErrorSlot>
        </div>
        <img 
          class="w-[28px]"
          src="/icons/image_add.svg" alt="" 
          @click="picHTMLElement?.click()">
      <input 
      type="file" multiple 
      style="display: none;"
      ref="picHTMLElement"
      @change="onAddFiles"
      >
      </div>

      <BaseDropMenu
        :dropdownItemsArray="modelTypesArray"
        @item-selected="typeSelect"
        :defaultSelected="defaultSelectedAlbumType"
        :class="`${picFormError.picTypeError ? 'error' : ''} box-content`"
        @click="picFormError.picTypeError = false;"
      />
      
      <BaseDropMenu
        v-if="!picForm.createAlbumToggle"
        :dropdownItemsArray="albumsNamesArray"
        :defaultSelected="defaultSelectedAlbumName"
        :specialItem="'Create New Album'"
        @item-selected="albumSelect"
        @special-item-selected="toggleCreateNewAblum"
        :class="`${picFormError.picAlbumError ? 'error' : ''} box-content`"
        @click="picFormError.picAlbumError = false"
      />

      <FieldErrorSlot :errorMessage="AlbumNameErrorMessage">
        <input
          v-if="picForm.createAlbumToggle"
          type="text"
          v-model="picForm.createAlbumName"
          ref="newAlbumInput"
          id="newAlbumInput"
          name="newAlbumInput"
          style="height: 32px"
          class="inputField"
          placeholder="Enter new Album name"
          min="1"
          max="64"
        />
      </FieldErrorSlot>

      <div class="flex flex-row gap-2 pl-1" @click="advancedOptionsToggle = !advancedOptionsToggle">
        <h2>Advanced options</h2> <div class="w-[16px] "><Icon :icon="advancedOptionsToggle ? 'up' : 'down'" /></div>
      </div>

      <div v-if="picForm.stockOptionalOverrides && advancedOptionsToggle"> 
        <div v-for="(value, key) in picForm.stockOptionalOverrides">
          <div class="flex flex-col gap-[0.5rem]">
            <div v-if="value.checkBox"
              class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
            >
              <div class="h-[24px] right-0 flex flex-row items-center">
                <div
                  class="checkbox_option w-[16rem]"
                  @click="value.checkBox.checkBoxValue = !value.checkBox.checkBoxValue"
                >
                  <Icon
                    :icon="
                      value.checkBox.checkBoxValue
                        ? 'checked_checkbox'
                        : 'unchecked_checkbox'
                    "
                  />
                  <h2>{{ value.checkBox.checkBoxDescription }}</h2>
                </div>
              </div>
            </div>

            <FieldErrorSlot
              :errorMessage="value.errorMessage"
              v-if="value.textField"
            >
            <input
                v-if="!value.useTextArea && !editBulkToggle"
                :class="`${
                  value.checkBox ? 
                  value.checkBox?.checkBoxValue
                    ? 'addNewImageInputField'
                    : 'addNewImageInputFieldDisabled' 
                  :  'addNewImageInputField'
                }`"
                type="text"
                v-model="value.textField.value"
                :placeholder="value.textField.fieldPlaceholder"
                :disabled="value.checkBox ? !value.checkBox?.checkBoxValue : false"
                @click="value.errorMessage = ''"
              />
              <textarea
                v-else
                v-model="value.textField.value"
                :class="`${
                  value.checkBox ? 
                  value.checkBox?.checkBoxValue
                    ? 'addNewImageInputField'
                    : 'addNewImageInputFieldDisabled' 
                  :  'addNewImageInputField'
                }`"
                :style="`height: ${calculateHeightForTextArea(
                  value.textField.value.split('\n').length * 11.6 + 20,
                  value.textField.fieldPlaceholder
                )}px`"
                type="text"
                :placeholder="value.textField.fieldPlaceholder"
                :disabled="value.checkBox ? !value.checkBox?.checkBoxValue : false"
                @click="value.errorMessage = ''"
              />
              
            </FieldErrorSlot>
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-2 pl-1" @click="advancedParamsToggle = !advancedParamsToggle">
        <h2>Category Parameters</h2> <div class="w-[16px] "><Icon :icon="advancedParamsToggle ? 'up' : 'down'" /></div>
      </div>

      <div v-if="picForm.optionalOverrideParams && advancedParamsToggle">
        
        <div
          v-for="(value, key) in picForm.optionalOverrideParams"
        >
        <div class="flex flex-col gap-[0.5rem]">
          <div v-if="value && value.checkBox"
            class="checkbox_option_container pl-[6px] pr-[6px] pt-[8px] pb-[8px] h-[32px] flex flex-row items-center"
          >
            <div class="h-[24px] right-0 flex flex-row items-center">
              <div
                class="checkbox_option w-[16rem]"
                @click="value.checkBox.checkBoxValue = !value.checkBox?.checkBoxValue"
              >
                <Icon
                  :icon="
                    value.checkBox.checkBoxValue
                    ? 'checked_checkbox'
                    : 'unchecked_checkbox'
                  "
                />
                <h2>{{ value.checkBox.checkBoxDescription }}</h2>
              </div>
            </div>
          </div>

          <FieldErrorSlot
            :errorMessage="value.errorMessage"
            v-if="value.textField"
          >
            <input
            :class="`${
              value.checkBox ? 
              value.checkBox?.checkBoxValue
                ? 'addNewImageInputField'
                : 'addNewImageInputFieldDisabled' 
              :  'addNewImageInputField'
            }`"
              type="text"
              v-model="value.textField.value"
              :placeholder="value.textField.fieldPlaceholder"
              :disabled="value.checkBox ? !value.checkBox?.checkBoxValue : false"
              @click="value.errorMessage = ''"
            />
          </FieldErrorSlot>
        </div>
        </div>
      </div>
      
      <Button
        text=""
        icon="remove"
        color="#991b1b"
        :disabled="(entryIndexer == 0 && picFormArray.length == 1)"
        class="absolute bottom-8 left-8 w-[32px] rounded-[8px]"
        @click="removeCurrentEntrt()"/>

      <Button
        text=""
        icon="plus"
        color="#4d6d8d"
        class="absolute bottom-8 left-17 w-[32px] rounded-[8px]"
        @click="addNewEntry()"/>

        <Button
        text=""
        icon="bulk_edit"
        color="#4d6d8d"
        class="absolute bottom-8 right-30 w-[32px] rounded-[8px]"
        @click="editBulkToggle = !editBulkToggle"/>

      <Button
        text="Submit"
        color="#4d6d8d"
        class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]"
        @click="submit()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref, inject, reactive, computed } from "vue";
import BaseDropMenu from "../Misc/BaseDropMenu.vue";
import Button from "../Misc/Button.vue";
import Icon from "../Misc/Icon.vue";
import FieldErrorSlot from "../Misc/FieldErrorSlot.vue";
import { AppState } from "../../../state";

import { api } from "../../services/api";
import {
  INewPic,
  AlbumSchemaType,
  IAlbum,
  ISettings,
  defaultPicFormStockOverrides,
} from "../../services/types";

const state = inject("state") as AppState;

const route = useRoute();

let defaultAlbumCollection: IAlbum = {
  albumCoverImage: "",
  name: "Select Album",
  uuid: "",
  type: "",
  estimatedPicCount: 0,
};
function calculateHeightForTextArea(something: number, placeholder?: string) {
  if (placeholder && placeholder?.length > 45) {
    return 40;
  }
  if (something > 300) {
    return 300;
  } else return something;
}
let albumCollection: IAlbum[] = [
  defaultAlbumCollection,
  ...Object.values(state.stateVariables.albums),
];

let albumsNamesArray = albumCollection.map((a) => a.name);

const picHTMLElement = ref<HTMLDivElement | undefined>(undefined);
const newAlbumInput = ref<HTMLDivElement | undefined>(undefined);
const advancedOptionsToggle = ref(false);
const advancedParamsToggle = ref(false);
const modelTypesArray = ref(["Select type"]);

const entryIndexer  = ref(0);
const editBulkToggle = ref(false);

const defaultSelectedAlbumName = ref("");
const defaultSelectedAlbumType = ref("");

let settingsForm = reactive<ISettings>(api.settings);

const newPicForm: () => INewPic = () => ({
  files: undefined,
  tempFileStore: [],
  url: "",
  createAlbumName: "",
  thumbnail_file: "",
  type: undefined,
  album: "",
  stockOptionalOverrides: JSON.parse(
    JSON.stringify(defaultPicFormStockOverrides)
  ) as typeof defaultPicFormStockOverrides,
  optionalOverrideParams: undefined,
})

const picFormArray: INewPic[]= [newPicForm()]
const picFormArrayLength = ref(1);

const picForm = ref<INewPic>(picFormArray[entryIndexer.value]);

let albumUUID: string | undefined = undefined;
let optionalOverrideParams = settingsForm.paramsTree ?? {}
//make it autoselect album when you're in an album page
if (route.name == "album") {
  const albumObj = albumCollection.find(
    (a) => a.uuid == route.params.albumUUID
  );
  if (albumObj) {
    defaultSelectedAlbumName.value = albumObj.name;
    picForm.value.album = albumObj.name;

    defaultSelectedAlbumType.value = albumObj.type;
    picForm.value.type = albumObj.type as INewPic["type"];
    setOptionalParams();
    albumUUID = albumObj.uuid;
  }
}

const picFormError = reactive({
  picTypeError: false,
  picAlbumError: false,
});

const picUrlErrorMessage = ref<string>("");
const AlbumNameErrorMessage = ref<string>("");

onMounted(async () => {
  modelTypesArray.value = modelTypesArray.value.concat(
    await api.getModelTypes()
  );
});

const onAddFiles = (event: any) => {
  if (picForm.value.url) {
    picUrlErrorMessage.value = "Cannot use both URL and Files in an Entry";
    setTimeout(() => {
    picUrlErrorMessage.value = "";
    }, 3000);
  }
  picForm.value.url = "";
  const newFiles = event.target.files as File[];  
  if (editBulkToggle.value) {
    if (!picForm.value.tempFileStore) {
      picForm.value.tempFileStore =  [];
    }

    for (let index = 0; index < newFiles.length; index++) {
    const file = newFiles[index];
      
      picForm.value.tempFileStore?.push({
      fileBlob: file,
      fileName: file.name,
      filePreviewURL: URL.createObjectURL(file)
      })

      
    } 

  } else {
    let skipfirst = !picForm.value.tempFileStore?.length ? 1 : 0;
    if (skipfirst) picForm.value.tempFileStore = [{
      fileBlob: newFiles[0],
      fileName: newFiles[0].name,
      filePreviewURL: URL.createObjectURL(newFiles[0])
    }]

    for (let index = skipfirst; index < newFiles.length; index++) {
    addNewEntry();
      picForm.value.tempFileStore = [{
      fileBlob: newFiles[index],
      fileName: newFiles[index].name,
      filePreviewURL: URL.createObjectURL(newFiles[index])
      }]
    } 
    
  }
  
}

function typeSelect(a: AlbumSchemaType) {
  if ((a as string) == "Select type") {
    picForm.value.type = undefined;
    picForm.value.optionalOverrideParams = undefined;
  } else picForm.value.type = a;
  
  setOptionalParams()  
}

function setOptionalParams() {
  const currentPicFormType = picForm.value.type;
  if (optionalOverrideParams && settingsForm.paramsTree && currentPicFormType && optionalOverrideParams[currentPicFormType]) {
      picForm.value.optionalOverrideParams = 
      (JSON.parse(
            JSON.stringify(optionalOverrideParams[currentPicFormType])
      ) as typeof settingsForm.paramsTree[string])
    } else picForm.value.optionalOverrideParams = {}
  }
function albumSelect(a: string) {
  if ((a as string) == "Select Album") picForm.value.album = "";
  else picForm.value.album = a;
}

function toggleCreateNewAblum() {
  picForm.value.createAlbumToggle = !picForm.value.createAlbumToggle;
  setTimeout(() => {
    newAlbumInput.value?.focus();
  }, 200);
}
function addNewEntry() {
  picFormArray.push(newPicForm())
  entryIndexer.value = picFormArray.length -1;
  picFormArrayLength.value = picFormArray.length;
  picForm.value = picFormArray[entryIndexer.value];


  if (route.name == "album") {
  const albumObj = albumCollection.find(
    (a) => a.uuid == route.params.albumUUID
  );
  if (albumObj) {
    defaultSelectedAlbumName.value = albumObj.name;
    picForm.value.album = albumObj.name;

    defaultSelectedAlbumType.value = albumObj.type;
    picForm.value.type = albumObj.type as INewPic["type"];
    setOptionalParams();
    albumUUID = albumObj.uuid;
  }
}

}



function changeIndexer(direction: "plus" | "minus") {
  if (direction == "minus" && entryIndexer.value > 0) {
    entryIndexer.value--
  } else if (direction == "plus" && (entryIndexer.value + 1) < picFormArray.length) {   
    entryIndexer.value++
  }
  picForm.value = picFormArray[entryIndexer.value];
}

function removeCurrentEntrt() {
  if (!(entryIndexer.value == 0 && picFormArray.length == 1)) {
    picFormArray.splice(entryIndexer.value, 1);
  }
  entryIndexer.value = !entryIndexer.value ? 0 : (entryIndexer.value - 1)
  picFormArrayLength.value = picFormArray.length;
  picForm.value = picFormArray[entryIndexer.value];

}

//garbage checks for incorrect entries

async function submit() {
  for (let index = 0; index < picFormArray.length; index++) {
    const pic = picFormArray[index];
      //url errors brrrrrr
      if (!pic.url && !pic.tempFileStore?.length) urlEmpty();
    
      //pic type errors brrrrrrrrrrrrrrrrrr
      if (!pic.type) noTypeSelected();
    
      if (!pic.album && !pic.createAlbumToggle) noAlbumelected();
    
      if (
        (pic.album == undefined || pic.album == "") &&
        pic.createAlbumToggle
      )
        albumNameEmpty();
      if (pic.album && pic.createAlbumToggle) {
        if ((pic.album as string)[0].match(/[0-9]/))
          albumNameStartsWithNumOrSpecial();
      }
      if (pic.album?.match(/[^A-Za-z0-9_\s]/g)) albumNameContainsSpecialChar();
    
      if (
        picFormError.picAlbumError ||
        picUrlErrorMessage.value ||
        picFormError.picTypeError
      )
        return;
    
      if (pic.createAlbumToggle && pic.createAlbumName) {
        await api.createNewAlbum({
          name: pic.createAlbumName,
          type: pic.type,
          album_thumbnail_file: "",
          isHidden: false,
        });
    
        const tablesContentRes = await api.getTableOfContents();
        localStorage.setItem("albums", JSON.stringify(tablesContentRes));
      }
  }
  //the actual submit function
  api
    .addPictures(picFormArray)
    .then((result) => {
      if (albumUUID) state.stateVariables.albums[albumUUID].addPictures(result);
    });
  state.stateVariables.popup = ""; //disables the popup aka exits
}

function urlEmpty() {
  picUrlErrorMessage.value = "Please provide a url to picture or upload";
}

function noTypeSelected() {
  picFormError.picTypeError = true;
}

function noAlbumelected() {
  picFormError.picAlbumError = true;
}

//when the new album inputed bla bla
function albumNameEmpty() {
  picFormError.picAlbumError = true;
  AlbumNameErrorMessage.value = "Please give a name to your new album";
}

function albumNameStartsWithNumOrSpecial() {
  picFormError.picAlbumError = true;
  AlbumNameErrorMessage.value = "album name must start with a leter";
}

function albumNameContainsSpecialChar() {
  picFormError.picAlbumError = true;
  AlbumNameErrorMessage.value = "album name cannot include special characters";
}
</script>

<style lang="postcss">
:root {
  --popup_height: 320px;
  --popup_width: 480px;
}

.add_new_popup_container {
  @apply absolute top-0 left-0 right-0 bottom-0 m-auto;
  @apply p-10 pt-6 pb-[5rem] h-[fit-content];
  @apply border-[3px] border-[#254EE0] gap-[14px] text-light-400;
  @apply flex-row gap-[4px] align-middle;

  z-index: 3;

  display: flex;
  gap: 32px;

  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background-color: rgba(42, 45, 52, 1);

  width: 19.5rem;
}
.album_thumbnail_preview {
  @apply h-[12.4vh] w-[12.4vh];
  object-fit: cover;
  border-radius: 4px;
}

.inputField[type="text"] {
  @apply outline-none w-[12rem] h-[2rem] box-content transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 placeholder-light-400;
  @apply max-h-[90vh];
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: white;
  box-sizing: border-box;
  resize: none;
}
.error {
  @apply border-rose-600 border-width-[2px] !important;
}

.addNewImageInputField[type="text"] {
  @apply outline-none h-[2rem] w-[14rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 resize-none;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(202, 202, 202);
}
.addNewImageInputFieldDisabled[type="text"] {
  @apply outline-none h-[2rem] w-[14rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 resize-none;
  background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
  font-family: "Work Sans", sans-serif;
  color: rgb(129, 129, 129);
}

.muliNewImageNum {
  @apply relative p-[2px] rounded-[6px] z-1;
  background-color: rgba(134, 134, 134, 0.575);
  margin-left: auto;
  padding:  0px 6px 0px 6px;
  width: fit-content;
  display: flex;
  flex-direction: row;
  gap: 4px;
}

</style>
