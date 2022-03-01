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
                <h2 class="text-red-500 indent-2px text-14px" :style="`${picFormError.picNameError? '' : 'display: none;'}`">{{picUrlErrorMessage}}</h2>
                <div :class="`${picFormError.picNameError? 'error': ''}`" style="width: fit-content;">
                    <input
                    v-model="picForm.url"
                    class="inputField"
                    type="text"
                    placeholder="Image URL or post URL" 
                    @click="picFormError.picNameError = false"/>
                </div>
                    <BaseDropMenu :dropdownItemsArray="modelTypesArray" @item-selected="typeSelect" :class="`${picFormError.picTypeError? 'error': ''} box-content`" @click="picFormError.picTypeError = false"/>
                    <BaseDropMenu v-if="!createAlbumToggle" :dropdownItemsArray="albumsArray" :specialItem="'Create New Album'" @item-selected="albumSelect" @special-item-selected="toggleCreateNewAblum" :class="`${picFormError.picAlbumError? 'error': ''} box-content`" @click="picFormError.picAlbumError = false"/>
                    <div :class="`${AlbumNameErrorMessage? 'error': ''}`" style="width: fit-content;">

                    <input 
                    v-if="createAlbumToggle"
                    type="text"
                    v-model="picForm.album"
                    ref="newAlbumInput"
                    id="newAlbumInput"
                    name="newAlbumInput"
                    class="inputField"
                    placeholder="Enter new Album name" 
                    min="1" max="64"
                    />
                    </div>

                    <h2 class="text-red-500 indent-2px text-14px" :style="`${AlbumNameErrorMessage? '' : 'display: none;'}`">{{AlbumNameErrorMessage}}</h2>

                    <Button text="Submit" color="#4d6d8d" class="absolute bottom-8 right-8 w-[fit-content] rounded-[8px]" @click="submit()"/>
            </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import BaseDropMenu from "../misc/BaseDropMenu.vue";
import Button from "../misc/Button.vue";

import api from "../../services/api";
import type { INewPic, AlbumSchemaType, ICollection } from "../../services/types";

const emit = defineEmits(['newPicSubmitted']);

let defaultAlbumCollection: ICollection = {
  albumCoverImage: "",
  name: "Select Album",
  uuid: "",
};


let albumCollection: ICollection[] = (JSON.parse(localStorage.getItem('albums') as string))
albumCollection.unshift(defaultAlbumCollection)
let albumsArray = albumCollection.map(a => a.name);

const picPreview = ref<string>('/icons/image.svg');
const picHTMLElement = ref<HTMLDivElement | undefined>(undefined);
const newAlbumInput = ref<HTMLDivElement | undefined>(undefined);
const createAlbumToggle = ref(false);
const modelTypesArray = ref(["Select type"]);

const picForm = ref<INewPic>({
    url: "",
    thumbnail_file: '',
    type: undefined,
    album: '',
});

const picFormError = ref({
    picNameError: false,
    picTypeError: false,
    picAlbumError: false

})

const picUrlErrorMessage = ref<string>("");
const AlbumNameErrorMessage = ref<string>("");


onMounted(async () => {
    modelTypesArray.value = modelTypesArray.value.concat(await api.getModelTypes())
})

/* let newAlbumCover: File | "" = ""; //on the event that i wanna give the option to upload images as input this'll be handy maybe

const OnAlbumCoverChange = (event: any) => {
    newAlbumCover = event.target.files[0];
    picPreview.value = URL.createObjectURL(newAlbumCover);
}
 */
function typeSelect(a: AlbumSchemaType) {
    if (a as string == "Select type") picForm.value.type = undefined;
    else picForm.value.type = a;
}

function albumSelect(a: string) {
    if (a as string == "Select Album") picForm.value.album = "";
    else picForm.value.album = a;
}

function toggleCreateNewAblum() {
    createAlbumToggle.value = !createAlbumToggle.value;
    setTimeout(() => {
        newAlbumInput.value?.focus()
    }, 200);
}

//garbage checks for incorrect entries

async function submit() {
    //url errors brrrrrr
    if (!picForm.value.url) urlEmpty();
 
    //pic type errors brrrrrrrrrrrrrrrrrr
    if (!picForm.value.type) noTypeSelected();

    if (!picForm.value.album && !createAlbumToggle.value) noAlbumelected();

    if (!picForm.value.album && createAlbumToggle.value) albumNameEmpty();
    else if ((picForm.value.album as string)[0].match(/[0-9]/)) albumNameStartsWithNumOrSpecial();
    else if (picForm.value.album?.match(/[^A-Za-z0-9_\s]/g)) albumNameContainsSpecialChar();


    if (picFormError.value.picAlbumError || picFormError.value.picNameError || picFormError.value.picTypeError) return;

    
    if (createAlbumToggle.value) 
    await api.createNewAlbum({
        name: picForm.value.album,
        type: picForm.value.type,
        thumbnail_file: "",
    })


    //the actual submit function
    await api.addPicture({
        url: picForm.value.url,
        type: picForm.value.type,
        album: picForm.value.album,
    }) 

    emit('newPicSubmitted');
}

function urlEmpty() {
    picFormError.value.picNameError = true;
    picUrlErrorMessage.value = "Please provide a url to picture";
}


function noTypeSelected() {
    picFormError.value.picTypeError = true;

}

function noAlbumelected() {
    picFormError.value.picAlbumError = true;

}

//when the new album inputed bla bla
function albumNameEmpty() {
    picFormError.value.picAlbumError = true;
    AlbumNameErrorMessage.value = "Please give a name to your new album";
}

function albumNameStartsWithNumOrSpecial() {
    picFormError.value.picAlbumError = true;
    AlbumNameErrorMessage.value = "album name must start with a leter";

}

function albumNameContainsSpecialChar() {
    picFormError.value.picAlbumError = true;
    AlbumNameErrorMessage.value = "album name cannot include special characters";

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


.inputField[type="text"] {
    @apply outline-none w-[16rem] h-[1rem] box-content transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 placeholder-white-400;
    background-color: rgba(28, 27, 34, var(--tw-bg-opacity));
    font-family: "Work Sans", sans-serif;
    color: white;
}
.error {
    @apply border-rose-600 border-width-[2px] !important;
}

</style>