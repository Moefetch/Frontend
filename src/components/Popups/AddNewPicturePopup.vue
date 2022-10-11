<template>
  <div class="popup_container">
    <div class="text-[12px] flex flex-col gap-[0.5rem]">
      <!--<div :class="`rounded-[4px] border-[#3D3D3D] border-[4px]`">
                <img :src="picPreview" alt="" class="album_thumbnail_preview h-[100px] w-[100px] max-h-[100px] max-w-[100px]"/>
            </div>
            <form>
                <input type="file" @change="OnAlbumCoverChange" style="display: none" id="picHTMLElement" name="picHTMLElement" ref="picHTMLElement" accept="image/*" />
            </form> -->
    </div>
    <div class="flex flex-col gap-2">
      <FieldErrorSlot :errorMessage="picUrlErrorMessage">
        <textarea
          v-model="picForm.url"
          class="inputField"
          :style="`height: ${(picForm.url.split('\n').length * 11.6) + 20 }px`"
          type="text"
          placeholder="Image URL or post URL"
          @click="picFormError.picNameError = false"
        />

      </FieldErrorSlot>
      
       
      <BaseDropMenu
        :dropdownItemsArray="modelTypesArray"
        @item-selected="typeSelect"
        :defaultSelected="defaultSelectedAlbumType"
        :class="`${picFormError.picTypeError ? 'error' : ''} box-content`"
        @click="picFormError.picTypeError = false"
      />
      <BaseDropMenu
        v-if="!createAlbumToggle"
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
          v-if="createAlbumToggle"
          type="text"
          v-model="picForm.album"
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
      
      <div class="checkbox_option w-[16rem]" v-if="settingsForm.saucenao_api_key" @click="toggleUseSaucenao()">   
        <Icon :icon="picForm.useSauceNao? 'checked_checkbox' : 'unchecked_checkbox'" />
        <h2>Use Saucenao to get highest Quality</h2>
      </div>

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
import { onMounted, ref, inject, reactive } from "vue";
import BaseDropMenu from "../Misc/BaseDropMenu.vue";
import Button from "../Misc/Button.vue";
import Icon from "../Misc/Icon.vue";
import FieldErrorSlot from "../Misc/FieldErrorSlot.vue";
import { AppState } from '../../../state';

import { api } from "../../services/api";
import type {
  INewPic,
  AlbumSchemaType,
  IAlbum,
  ISettings
} from "../../services/types";

const state = (inject('state') as AppState);

const route = useRoute();

let defaultAlbumCollection: IAlbum = {
  albumCoverImage: "",
  name: "Select Album",
  uuid: "",
  type: "",
  estimatedPicCount: 0
};

let albumCollection: IAlbum[] = [defaultAlbumCollection, ...Object.values(state.stateVariables.albums)]

let albumsNamesArray = albumCollection.map((a) => a.name);

const picPreview = ref<string>("/icons/image.svg");
const picHTMLElement = ref<HTMLDivElement | undefined>(undefined);
const newAlbumInput = ref<HTMLDivElement | undefined>(undefined);
const createAlbumToggle = ref(false);
const modelTypesArray = ref(["Select type"]);

const defaultSelectedAlbumName = ref("");
const defaultSelectedAlbumType = ref("");

const localStorageSettings = localStorage.getItem("settings") //to see if exists

let settingsForm = reactive<ISettings>(
  localStorageSettings ? JSON.parse(localStorageSettings) : 
  {
    backend_url: "",
    database_url: "",
    search_diff_sites: false,
    pixiv_download_first_image_only: false,
    saucenao_api_key: undefined,
});


const picForm = reactive<INewPic>({
  url: "",
  thumbnail_file: "",
  type: undefined,
  album: "",
  useSauceNao: (settingsForm.search_diff_sites),
});
let albumUUID: string | undefined = undefined;
//make it autoselect album when you're in an album page
if (route.name == "album") {
  const albumObj = albumCollection.find(
    (a) => a.uuid == route.params.albumUUID
  );
  if (albumObj) {
    defaultSelectedAlbumName.value = albumObj.name;
    picForm.album = albumObj.name;

    defaultSelectedAlbumType.value = albumObj.type;
    picForm.type = albumObj.type as INewPic["type"];
    albumUUID = albumObj.uuid;
  }
}


function toggleUseSaucenao() {
  picForm.useSauceNao = !picForm.useSauceNao;
}

const picFormError = reactive({
  picNameError: false,
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

/* let newAlbumCover: File | "" = ""; //on the event that i wanna give the option to upload images as input this'll be handy maybe

const OnAlbumCoverChange = (event: any) => {
    newAlbumCover = event.target.files[0];
    picPreview.value = URL.createObjectURL(newAlbumCover);
}
 */
function typeSelect(a: AlbumSchemaType) {
  if ((a as string) == "Select type") picForm.type = undefined;
  else picForm.type = a;
}

function albumSelect(a: string) {
  if ((a as string) == "Select Album") picForm.album = "";
  else picForm.album = a;
}

function toggleCreateNewAblum() {
  createAlbumToggle.value = !createAlbumToggle.value;
  setTimeout(() => {
    newAlbumInput.value?.focus();
  }, 200);
}

//garbage checks for incorrect entries

async function submit() {
  //url errors brrrrrr
  if (!picForm.url) urlEmpty();

  //pic type errors brrrrrrrrrrrrrrrrrr
  if (!picForm.type) noTypeSelected();

  if (!picForm.album && !createAlbumToggle.value) noAlbumelected();

  if (
    (picForm.album == undefined || picForm.album == "") &&
    createAlbumToggle.value
  )
    albumNameEmpty();
  if (picForm.album && createAlbumToggle.value) {
    if ((picForm.album as string)[0].match(/[0-9]/))
      albumNameStartsWithNumOrSpecial();
  }
  if (picForm.album?.match(/[^A-Za-z0-9_\s]/g))
    albumNameContainsSpecialChar();

  if (
    picFormError.picAlbumError ||
    picFormError.picNameError ||
    picFormError.picTypeError
  )
    return;

  if (createAlbumToggle.value) {
    await api.createNewAlbum({
      name: picForm.album,
      type: picForm.type,
      album_thumbnail_file: "",
      isHidden: false,
    });

    const tablesContentRes = await api.getTableOfContents();
    localStorage.setItem("albums", JSON.stringify(tablesContentRes));
  }

  //the actual submit function
  api.addPicture({
    url: picForm.url,
    type: picForm.type,
    album: picForm.album,
    useSauceNao: picForm.useSauceNao,
    isHidden: false
  }).then(result => {
    if (albumUUID) state.stateVariables.albums[albumUUID].addPictures(result)
  })
  state.stateVariables.popup = ''; //disables the popup aka exits
  
}

function urlEmpty() {
  picFormError.picNameError = true;
  picUrlErrorMessage.value = "Please provide a url to picture";
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

.popup_container {
  @apply absolute top-0 left-0 right-0 bottom-0 m-auto;
  @apply p-10 pb-[10rem] h-[fit-content];
  @apply border-[3px] border-[#254EE0] gap-[14px] text-white-400;
  @apply flex-row gap-[4px] align-middle;

  z-index: 3;

  display: flex;
  gap: 32px;

  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background-color: rgba(42, 45, 52, 1);

  width: var(--popup_width);

}
.album_thumbnail_preview {
  @apply h-[12.4vh] w-[12.4vh];
  object-fit: cover;
  border-radius: 4px;
}

.inputField[type="text"] {
  @apply outline-none w-[16rem] h-[2rem] box-content transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 placeholder-white-400;
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
</style>
