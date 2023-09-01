<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row bg-dark-400 items-center z-3">
      <router-link to="/">
        <Button icon="home" @click="state.clearAdvancedSearchOptions()" />
      </router-link>
      <CollectionDropMenu v-if="state.stateVariables.albums" :albums="[
        defaultAlbumCollection,
        ...Object.values(state.stateVariables.albums),
      ]" :currentAlbum="getCurrentItemFromUUID(route.params.albumUUID)" />
      <div class="m-auto flex-row flex items-center justify-center">
        
      </div>
      <Button icon="plus" @click="togglePopup('AddNewPicturePopup')" buttonID="addNewPictureButton" />
      <Button icon="filter" @click="
          state.stateVariables.advancedSearch =
          !state.stateVariables.advancedSearch
          " />
      <Button :icon="`${state.stateVariables.isEditing ? 'cancel_editing' : 'edit'}`" :class="`${state.stateVariables.isEditing ? 'bg-[#B6222D] rounded-8px' : ''
        }`" @click="
    state.stateVariables.isEditing = !state.stateVariables.isEditing
    " buttonID="editButton" />
      <Button icon="menu" @click="togglePopup('SetupPopup')" buttonID="menuButton" />

      <PopupSlot v-if="state.stateVariables.popup == 'AddNewPicturePopup'">
        <AddNewPicturePopup />
      </PopupSlot>

      <PopupSlot v-if="state.stateVariables.popup == 'SetupPopup'">
        <SetupPopup />
      </PopupSlot>
    </div>
    <div v-if="!!state.stateVariables.advancedSearch">
      <AdvancedSearch :albums="mapAlbumsToNamesArray(Object.values(state.stateVariables.albums))" 
      :defaultSelected="getCurrentItemFromUUID(route.params.albumUUID).name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "../Misc/Button.vue";
import CollectionDropMenu from "../Misc/CollectionDropMenu.vue";
import AddNewPicturePopup from "../Popups/AddNewPicturePopup.vue";
import SetupPopup from "../Popups/SetupPopup.vue";
import type { IAlbum } from "../../services/types";
import SearchBar from "../Misc/SearchBar.vue";
import PopupSlot from "../Misc/PopupSlot.vue";

import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { AppState } from "../../../state";
import AdvancedSearch from "../Misc/AdvancedSearch.vue";
import { Album } from "../../services/album";

const state = inject("state") as AppState;

const defaultAlbumCollection: IAlbum = {
  albumCoverImage: "",
  name: "Home",
  estimatedPicCount: 0,
  type: "",
  uuid: "",
};

function mapAlbumsToNamesArray(albums: IAlbum[]) {
  return [
    ...albums.map((album) => ({
      albumName: album.name,
      albumUUID: album.uuid,
      type: album.type,
    })),
  ];
}

const route = useRoute();

function togglePopupsOff() {
  state.stateVariables.popup = "";
}

function togglePopup(popup: string) {
  if (state.stateVariables.popup == popup) {
    state.stateVariables.popup = "";
  } else state.stateVariables.popup = popup;
}

function getCurrentItemFromUUID(parm?: string | string[]) {
  if (parm && parm.length) {
    return Object.values(state.stateVariables.albums).filter(
      (a) => a.uuid == parm
    )[0];
  } else return defaultAlbumCollection;
}

/* 
    const resTable: IAlbum[] = [
        {imageURL: "https://cdn.discordapp.com/attachments/881632596298170399/901766516058509332/7e30eb81cc06fbf442a63d8e8d72adedb2c3a0ed.jpg",
        name: "your mom",
        route: "nothing for now",
    }, {imageURL: "https://cdn.discordapp.com/emojis/872729193748774972.png",
        name: "second",
        route: "nothing for now",} 
    ]

 */
</script>
