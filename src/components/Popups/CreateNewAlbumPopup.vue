<template>
  <div class="popup_container">
    <div class="text-[12px] flex flex-col gap-[0.5rem]">
      <div :class="`${albumFormError.albumCoverError ? 'error' : ''
        } rounded-[4px] border-[#3D3D3D] border-[4px] cursor-pointer `" @click="
        albumFormError.albumCoverError = false;
      albumCover?.click();
      ">
        <img :src="newAlbumCoverPreview" alt=""
          class="album_thumbnail_preview h-[100px] w-[100px] max-h-[100px] max-w-[100px]" />
      </div>
      <input type="file" @change="OnAlbumCoverChange" style="display: none" id="albumcover" name="albumCover"
        ref="albumCover" accept="image/*" />

    </div>
    <div class="flex flex-col gap-2">
      <h2 class="text-red-500 indent-2px text-14px" :style="`${albumFormError.albumNameError ? '' : 'display: none;'}`">
        {{ nameErrorMessage }}
      </h2>
      <div :class="`${albumFormError.albumNameError ? 'error' : ''}`">
        <input v-model="albumForm.name" class="inputField" type="text" pattern="[A-Za-z0-9_\s]{1,64}"
          title="Starts with a letter and doesnt contain special characters" placeholder="Name" min="1" max="64" @click="
        albumFormError.albumNameError = false;
      albumFormError.albumAlreadyExistError = false;
      " />
      </div>
      <BaseDropMenu :dropdownItemsArray="modelTypesArray" :selectedType="albumForm.type" @item-selected="typeSelect"
        :default-selected="albumForm.type" :class="`${albumFormError.albumTypeError ? 'error' : ''} box-content`"
        @click="albumFormError.albumTypeError = false" />
      <h2 class="text-red-500 indent-2px text-14px" :style="`${albumFormError.albumAlreadyExistError ? '' : 'display: none;'
        }`">
        Album already exists, please enter a different name
      </h2>
      <div class="checkbox_option w-[16rem]" @click="toggleAlbumIsHidden">
        <Icon :icon="albumForm.isHidden ? 'checked_checkbox' : 'unchecked_checkbox'" />
        <h2>Hidden album</h2>
      </div>

      <Button :text="editedAlbumUUID ? 'Update' : 'Submit'" color="#4d6d8d"
        class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]" @click="submit()" />
    </div>
  </div>
</template>

<script setup lang="ts">
///////////////////////////////////// start of declarations afaik
import { onMounted, ref, inject, reactive } from "vue";
import { AppState } from "../../../state";
import BaseDropMenu from "../Misc/BaseDropMenu.vue";
import Button from "../Misc/Button.vue";
import Icon from "../Misc/Icon.vue";

import { api } from "../../services/api";
import type { INewAlbum, AlbumSchemaType, IAlbum } from "../../services/types";
import { Album } from "../../services/album";
let newAlbumCover: File | string = "";

const props = defineProps<{
  editedAlbumUUID?: string;
}>();

const state = (inject("state") as AppState).stateVariables;

const newAlbumCoverPreview = ref<string>("/icons/upload.svg");
const albumCover = ref<HTMLDivElement | undefined>(undefined);
const modelTypesArray = ref(["Select type"]);

const albumForm = reactive<INewAlbum>({
  name: "",
  album_thumbnail_file: "",
  type: undefined,
  isHidden: false,
});

if (props.editedAlbumUUID) {
  const album = state.albums[props.editedAlbumUUID];
  if (album) {
    albumForm.name = album.name;
    albumForm.type = album.type;
    albumForm.isHidden = album.isHidden;
    if (album.albumCoverImage != 'album_thumbnail_files/image.svg') { //aka the default blank icon
      newAlbumCoverPreview.value = api.backendUrl + '/' + album.albumCoverImage;
      newAlbumCover = album.albumCoverImage;
      albumForm.album_thumbnail_file = album.albumCoverImage;
    }
  }
}

function toggleAlbumIsHidden() {
  albumForm.isHidden = !albumForm.isHidden;
}

const albumFormError = reactive<{
  albumNameError: boolean;
  albumCoverError: boolean;
  albumTypeError: boolean;
  albumAlreadyExistError: boolean;
}>({
  albumNameError: false,
  albumCoverError: false,
  albumTypeError: false,
  albumAlreadyExistError: false,
});

const nameErrorMessage = ref<string>("");

onMounted(async () => {
  modelTypesArray.value = modelTypesArray.value.concat(
    await api.getModelTypes()
  );
});

const OnAlbumCoverChange = (event: any) => {
  newAlbumCover = event.target.files[0];

  if (typeof newAlbumCover != "string")
    newAlbumCoverPreview.value = URL.createObjectURL(newAlbumCover);
  else newAlbumCoverPreview.value = newAlbumCover;
};

function typeSelect(a: AlbumSchemaType) {
  if ((a as string) == "Select type") albumForm.type = undefined;
  else albumForm.type = a;
}
///////////////////////////////////// end of declarations afaik

//garbage checks for incorrect entries

async function submit() {
  //name errors brrrrrr

  if (!albumForm.name) nameEmpty();
  else if (albumForm.name[0].match(/[0-9]/)) startsWithNumOrSpecial();
  else if (albumForm.name.match(/[^A-Za-z0-9_\s]/g)) containsSpecialChar();

  //album type errors brrrrrrrrrrrrrrrrrr
  if (!albumForm.type) noTypeSelected();

  if (
    albumFormError.albumCoverError ||
    albumFormError.albumTypeError ||
    albumFormError.albumNameError
  )
    return;

  if (props.editedAlbumUUID) {
    const response = await api.editAlbum(
      props.editedAlbumUUID,
      {
        name: albumForm.name,
        type: albumForm.type,
        album_thumbnail_file: newAlbumCover,
        isHidden: albumForm.isHidden,
      }, state.albums[props.editedAlbumUUID].estimatedPicCount);
    state.albums[response.uuid] = new Album(response);
  } else {

    if (Object.values(state.albums).some((a) => a.name == albumForm.name)) {
      albumFormError.albumAlreadyExistError = true;
      return
    }

    //the actual submit function: create new album

    const response = await api.createNewAlbum({
      name: albumForm.name,
      type: albumForm.type,
      album_thumbnail_file: newAlbumCover,
      isHidden: albumForm.isHidden,
    });
    state.albums[response.uuid] = new Album(response);
  }
  state.popup = "";
  state.editedAlbumUUID = "";
}

function nameEmpty() {
  albumFormError.albumNameError = true;
  nameErrorMessage.value = "Please give a name to your new album";
}

function startsWithNumOrSpecial() {
  albumFormError.albumNameError = true;
  nameErrorMessage.value = "album name must start with a leter";
}

function containsSpecialChar() {
  albumFormError.albumNameError = true;
  nameErrorMessage.value = "album name cannot include special characters";
}

function noTypeSelected() {
  albumFormError.albumTypeError = true;
}
</script>

<style lang="postcss">
:root {
  --popup_height: 320px;
  --popup_width: 480px;
}

.popup_container {
  @apply absolute p-10 text-light-400;
  @apply border-[3px] border-[#254EE0] gap-[14px];
  @apply flex-row gap-[4px] m-auto;
  @apply h-[fit-content];

  z-index: 3;

  display: flex;
  gap: 32px;

  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background-color: rgba(42, 45, 52, 1);
}

.album_thumbnail_preview {
  @apply h-[12.4vh] w-[12.4vh];
  object-fit: cover;
  border-radius: 4px;
}

.inputField {
  @apply outline-none h-[2rem] w-[16rem] box-content transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 bg-dark-700 placeholder-light-400;
  font-family: "Work Sans", sans-serif;
  color: white;
}

.error {
  @apply border-rose-600 border-width-[2px] !important;
}
</style>
