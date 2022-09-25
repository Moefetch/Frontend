<template>
  <div class="flex flex-row bg-dark-400 items-center">
    <router-link to="/">
      <Button icon="home" />
    </router-link>
    <CollectionDropMenu v-if="state.collectionArray.length" :collectionArray="[defaultAlbumCollection, ...state.collectionArray]" :currentCol="route.params.albumName" />
    <div class="m-auto">
      <SearchBar class="h-[32]"/>
    </div> 
    <Button icon="plus" @click="state.popup = 'AddNewPicturePopup'" />
    <Button :icon="`${editingToggleBool? 'cancel_editing' : 'edit' }`" :class="`${editingToggleBool? 'bg-[#B6222D] rounded-8px' : ''}`" @click="toggleEditing()" />
    <Button icon="menu" @click="state.popup = 'SetupPopup'" /> 
    
    <PopupSLot v-if="state.popup == 'AddNewPicturePopup'">
      <AddNewPicturePopup @newPicSubmitted="togglePopupsOff"/>
    </PopupSLot>
    
    <PopupSLot v-if="state.popup == 'SetupPopup'">
      <SetupPopup @sumbittedSettings="togglePopupsOff"/>
    </PopupSLot>
  </div>
</template>

<script setup lang="ts">
import Button from "../Misc/Button.vue";
import CollectionDropMenu from "../Misc/CollectionDropMenu.vue";
import AddNewPicturePopup from "../Popups/AddNewPicturePopup.vue";
import SetupPopup from "../Popups/SetupPopup.vue";
import type { ICollection } from "../../services/types";
import SearchBar from "../Misc/SearchBar.vue";
import PopupSLot from "../Misc/PopupSLot.vue";

import { ref, inject} from "vue";
import { useRoute } from "vue-router";
import AppState from '../../../state'

const state = (inject('state') as AppState).state;


let defaultAlbumCollection: ICollection = {
    albumCoverImage: "",
    name: "Home",
    estimatedPicCount: 0,
    type: "",
    uuid: undefined,
  };


const route = useRoute();

const emit = defineEmits(['isEditing', "submittedNewPic"]);

const editingToggleBool = ref(false);


function togglePopupsOff() {
  state.popup = ''
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
