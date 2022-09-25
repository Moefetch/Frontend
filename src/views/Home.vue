<template>
  <div class="page-container flex">
    <div class="albums_container grid m-auto gap">
      <AlbumAddCard @click="state.popup = 'CreateNewAlbumPopup'" />
      <AlbumCard
        v-for="item in state.collectionArray"
        :name="item.name"
        :thumbnail="item.albumCoverImage"
        :estimatedPicCount="item.estimatedPicCount"
        :router="item.uuid"
      />
      <PopupSLot v-if="state.popup == 'CreateNewAlbumPopup'">
        <CreateNewAlbumPopup
          @newAlbumSubmitted="toggleAlbumPopupOff"
        />
      </PopupSLot>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { ICollection } from "../services/types";
import PopupSLot from "../components/Misc/PopupSLot.vue";

import { ref, inject} from "vue";

import AppState from '../../state'


import AlbumCard from "../components/Cards/AlbumCard.vue";
import AlbumAddCard from "../components/Cards/AlbumAddCard.vue";
import CreateNewAlbumPopup from "../components/Popups/CreateNewAlbumPopup.vue";

const state = (inject('state') as AppState).state;

function toggleAlbumPopupOff() {
  state.popup = '';
}

defineProps<{ isEditing: boolean }>();

</script>

<style lang="postcss">
.albums_container {
  grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
  row-gap: 32px;
  padding: 2rem;
  height: 100%;
  min-width: fit-content;
  max-width: 100%;
  width: 100%;
  justify-content: center;
}
</style>
