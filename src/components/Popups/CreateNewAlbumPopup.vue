<template>
    <div class="popup_container">
        <div class="text-[12px] flex flex-col gap-[0.5rem]">
            <div :class="`${albumFormError.albumCoverError? 'error': ''} rounded-[4px] border-[#3D3D3D] border-[4px] cursor-pointer `" @click="albumFormError.albumCoverError = false; albumCover?.click()">
                <img :src="newAlbumCoverPreview" alt="" class="album_thumbnail_preview h-[100px] w-[100px] max-h-[100px] max-w-[100px]"/>
            </div>
            <form>
                <input type="file" @change="OnAlbumCoverChange" style="display: none" id="albumcover" name="albumCover" ref="albumCover" accept="image/*" />
                <!-- <h2 class="max-w-[100px] text-center">Upload album cover</h2> -->
            </form>
            </div>
            <div class="flex flex-col gap-2">
                <h2 class="text-red-500 indent-2px text-14px" :style="`${albumFormError.albumNameError? '' : 'display: none;'}`">{{nameErrorMessage}}</h2>
                <div :class="`${albumFormError.albumNameError? 'error': ''}`">
                    <input
                    v-model="albumForm.name"
                    class="inputField"
                    type="text"
                    pattern="[A-Za-z0-9_\s]{1,64}"
                    title="Starts with a letter and doesnt contain special characters"
                    placeholder="Name" 
                    min="1" max="64"
                    @click="albumFormError.albumNameError = false"/>
                </div>
                    <BaseDropMenu :dropdownItemsArray="modelTypesArray" :selectedType="albumForm.type" @item-selected="typeSelect" :class="`${albumFormError.albumTypeError? 'error': ''} box-content`" @click="albumFormError.albumTypeError = false"/>
                    <h2 class="text-red-500 indent-2px text-14px" :style="`${albumFormError.albumAlreadyExistError? '' : 'display: none;'}`">Album already exists, please enter a different name</h2>
                    <Button text="Submit" color="#4d6d8d" class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]" @click="submit()"/>
            </div>
    </div>
</template>

<script setup lang="ts">
///////////////////////////////////// start of declarations afaik
import { onMounted, ref } from "vue";
import BaseDropMenu from "../misc/BaseDropMenu.vue";
import Button from "../misc/Button.vue";

import api from "../../services/api";
import type { INewAlbum, AlbumSchemaType, ICollection } from "../../services/types";

const emit = defineEmits(['newAlbumSubmitted']);


const albumCollection = (JSON.parse(localStorage.getItem('albums') as string) as ICollection[]);


const newAlbumCoverPreview = ref<string>('/icons/upload.svg');
const albumCover = ref<HTMLDivElement | undefined>(undefined);
const modelTypesArray = ref(["Select type"]);

const albumForm = ref<INewAlbum>({
    name: "",
    thumbnail_file: '',
    type: undefined,
});

const albumFormError = ref<any>({
    albumNameError: false,
    albumCoverError: false,
    albumTypeError: false,
    albumAlreadyExistError: false
})

const nameErrorMessage = ref<string>("");

onMounted(async () => {
    modelTypesArray.value = modelTypesArray.value.concat(await api.getModelTypes())
})

let newAlbumCover: File | "" = "";

const OnAlbumCoverChange = (event: any) => {
    newAlbumCover = event.target.files[0];
    newAlbumCoverPreview.value = URL.createObjectURL(newAlbumCover);
}

function typeSelect(a: AlbumSchemaType) {
    if (a as string == "Select type") albumForm.value.type = undefined;
    else albumForm.value.type = a;
}
///////////////////////////////////// end of declarations afaik


//garbage checks for incorrect entries

async function submit() {
    //name errors brrrrrr
    if (!albumForm.value.name) nameEmpty();
    else if (albumForm.value.name[0].match(/[0-9]/)) startsWithNumOrSpecial();
    else if (albumForm.value.name.match(/[^A-Za-z0-9_\s]/g)) containsSpecialChar();

    //album type errors brrrrrrrrrrrrrrrrrr
    if (!albumForm.value.type) noTypeSelected();

    if (albumCollection.some(a => a.name == albumForm.value.name)) albumFormError.value.albumAlreadyExistError = true;

    if (albumFormError.value.albumAlreadyExistError || albumFormError.value.albumCoverError || albumFormError.value.albumTypeError || albumFormError.value.albumNameError) return;

    //the actual submit function
    await api.createNewAlbum({
        name: albumForm.value.name,
        type: albumForm.value.type,
        thumbnail_file: newAlbumCover,
    })

    emit('newAlbumSubmitted');

}

function nameEmpty() {
    albumFormError.value.albumNameError = true;
    nameErrorMessage.value = "Please give a name to your new album";
}

function startsWithNumOrSpecial() {
    albumFormError.value.albumNameError = true;
    nameErrorMessage.value = "album name must start with a leter";

}

function containsSpecialChar() {
    albumFormError.value.albumNameError = true;
    nameErrorMessage.value = "album name cannot include special characters";

}

function noTypeSelected() {
    albumFormError.value.albumTypeError = true;

}

</script>

<style>
:root {
    --popup_height: 320px;
    --popup_width: 480px;
}
      
.popup_container {
@apply absolute top-[50%] left-[50%] p-10 text-white-400;
@apply border-[3px] border-[#254EE0] gap-[14px];
@apply flex-row gap-[4px] align-center m-auto;


display: flex;
gap:32px;

box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
border-radius: 4px;
background-color: rgba(42, 45, 52, 1); 

width: var(--popup_width);
height: var(--popup_height);



left: calc((100vw - var(--popup_width))/2);
right: calc((100vw - var(--popup_width) )/2);
top: calc((100vh - var(--popup_height) + 7vh)/2)
}
.album_thumbnail_preview {
    @apply h-[12.4vh] w-[12.4vh];
    object-fit: cover;
    border-radius: 4px;}


.inputField {
    @apply outline-none w-[16rem] h-[1rem] box-content transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 bg-dark-700 placeholder-white-400;
    font-family: "Work Sans", sans-serif;
    color: white;
}
.error {
    @apply border-rose-600 border-width-[2px] !important;
}

</style>