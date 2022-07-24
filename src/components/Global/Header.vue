<template>
  <div class="flex flex-row bg-dark-400 items-center">
    <router-link to="/">
      <Button icon="home" />
    </router-link>
    <div v-if="dataReady">
      <CollectionDropMenu :collectionArray="resTable" :currentCol="route.params.albumName" />
    </div>
    <div class="m-auto">
      <SearchBar class="h-[32]"/>
    </div> 
    <Button icon="plus" @click="toggleAddPicPopup()" />
    <Button :icon="`${editingToggleBool? 'cancel_editing' : 'edit' }`" :class="`${editingToggleBool? 'bg-[#B6222D] rounded-8px' : ''}`" @click="toggleEditing()" />
    <Button icon="menu" @click="toggleSetupPopup()" /> 
    <div
      class="pop_out h-[93vh] top-[7vh] w-[100vw] absolute left-0"
      v-if="addPicPopupToggleBool || setupPopupToggleBool"
      @click="togglePopupsOff()"
    ></div>
    <SetupPopup v-if="setupPopupToggleBool"/>
    <AddNewPicturePopup v-if="addPicPopupToggleBool" @newPicSubmitted="submittedPicSuccessfully"/>
  </div>
</template>

<script setup lang="ts">
import Button from "../misc/Button.vue";
import CollectionDropMenu from "../misc/CollectionDropMenu.vue";
import AddNewPicturePopup from "../Popups/AddNewPicturePopup.vue";
import SetupPopup from "../Popups/setupPopup.vue";
import type { ICollection } from "../../services/types";
import SearchBar from "../misc/SearchBar.vue";

import api from "../../services/api";
import { onMounted, ref} from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(['isEditing', "submittedNewPic"]);

const route = useRoute();

let defaultAlbumCollection: ICollection = {
  albumCoverImage: "",
  name: "Home",
  estimatedPicCount: 0, 
  uuid: undefined,
};

const dataReady = ref(false); //funny enough this prevents the drop down list from lowading scuffed
const resTable = ref<[ICollection]>([defaultAlbumCollection]); //bro i fucking love this, i have to use a ref, ref is gonna have any but the collection array things takes an array of fucking collections or whatever and so i give it the type in the type thing <> but then it's like that type or undefined and so i have to pass in the default value, when the scuff

const addPicPopupToggleBool = ref(false);
const setupPopupToggleBool = ref(false);
const editingToggleBool = ref(false);

let tablesContentRes: [ICollection];
//const AlbumCollection = JSON.parse(localStorage.getItem("albums") as string);


onMounted(async () => {
  tablesContentRes = await api.getTableOfContents();
  dataReady.value = true;
  localStorage.setItem("albums", JSON.stringify(tablesContentRes));
  resTable.value = tablesContentRes;
  resTable.value.unshift(defaultAlbumCollection);
});

function togglePopupsOff() {
  addPicPopupToggleBool.value = false;
  setupPopupToggleBool.value = false;
}

 //toggle that bool the opposite of what it is and cancel the other if it is true
function toggleAddPicPopup() {
  addPicPopupToggleBool.value = !addPicPopupToggleBool.value;
  setupPopupToggleBool.value = false;
}

function toggleSetupPopup() {
  setupPopupToggleBool.value = !setupPopupToggleBool.value;
  addPicPopupToggleBool.value = false;
}


function submittedPicSuccessfully() {
  toggleAddPicPopup()
  emit('submittedNewPic');
}

function toggleEditing() {
  editingToggleBool.value =! editingToggleBool.value;
  emit('isEditing')
}

/* 
    const resTable: ICollection[] = [
        {imageURL: "https://cdn.discordapp.com/attachments/881632596298170399/901766516058509332/7e30eb81cc06fbf442a63d8e8d72adedb2c3a0ed.jpg",
        name: "your mom",
        route: "nothing for now",
    }, {imageURL: "https://cdn.discordapp.com/emojis/872729193748774972.png",
        name: "second",
        route: "nothing for now",} 
    ]

 */


</script>
