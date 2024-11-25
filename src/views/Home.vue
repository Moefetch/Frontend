<template>
  <div class="page-container flex">
    <div class="albums_container m-auto gap-16">
      <AlbumAddCard @click="state.stateVariables.popup = 'CreateNewAlbumPopup'" />
      <AlbumCard v-for="item in state.stateVariables.albums" :album="item" />

      <PopupSlot
        v-if="state.stateVariables.popup == 'CreateNewAlbumPopup' || state.stateVariables.popup == 'EditAlbum'">
        <CreateNewAlbumPopup
          :editedAlbumUUID="state.stateVariables.popup == 'EditAlbum' ? state.stateVariables.editedAlbumUUID : ''" />
      </PopupSlot>

      <EditControls :deleteSelection="() => state.deleteSelectedAlbums()"
        :hideSelection="() => state.handleHidingAlbumsByUUIDS(true)"
        :unhideSelection="() => state.handleHidingAlbumsByUUIDS(false)" v-if="state.stateVariables.isEditing" />
    </div>
  </div>
</template>

<script setup lang="ts">

import PopupSlot from "../components/Misc/PopupSlot.vue";
import EditControls from "../components/Misc/EditControls.vue";

import { ref, inject } from "vue";

import { AppState } from '../../state'


import AlbumCard from "../components/Cards/AlbumCard.vue";
import AlbumAddCard from "../components/Cards/AlbumAddCard.vue";
import CreateNewAlbumPopup from "../components/Popups/CreateNewAlbumPopup.vue";

const state = (inject('state') as AppState)

</script>

<style lang="postcss">
.albums_container {
  @apply flex flex-row flex-wrap;
  row-gap: 32px;
  padding: 2rem;
  height: 100%;
  min-width: fit-content;
  max-width: 100%;
  width: 100%;
  justify-content: center;
}
</style>
