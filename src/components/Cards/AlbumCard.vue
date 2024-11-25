<template>
  <SelectSlot :selected="album.isSelected" :checkboxStyle="''"
    :slotStyle="'bottom: ' + (state.isEditing ? '28px' : '0px')">
    <div class="w-[32vh] h-[40vh] cursor-pointer">
      <div class="container" @click="clickAlbum()">
        <img :src="backendUrl + album.albumCoverImage" />
        <div class="h-[20%] flex items-start w-full relative p-2.5 items-center">
          <div class="text_container">
            <h1>{{ album.name }}</h1>
            <h2>{{ album.estimatedPicCount }}</h2>
          </div>
          <Button icon="kebab_menu" style="height: 44px; aspect-ratio: 1" @click="EditAlbum" />
        </div>
      </div>
    </div>
  </SelectSlot>
</template>

<script setup lang="ts">
import { api } from "../../services/api";
import Button from "../Misc/Button.vue";
import SelectSlot from "../Misc/SelectSlot.vue";
import { inject, watch } from "vue";
import { AppState } from "../../../state";
import router from "../../router";
import { Album } from "../../services/album";
const state = (inject("state") as AppState).stateVariables;

const backendUrl = api.getBackendUrl();

const props = defineProps<{
  album: Album;
}>();

function EditAlbum(e: Event) {
  e.stopPropagation();
  state.editedAlbumUUID = props.album.uuid;
  state.popup = 'EditAlbum';
};
function clickAlbum() {
  if (!state.isEditing)
    router.push({ name: "album", params: { albumUUID: props.album.uuid } });
  else {
    props.album.isSelected = !props.album.isSelected;
  }
}

watch(
  () => state.isEditing,
  () => {
    if (!state.isEditing) {
      Object.values(state.albums).forEach(
        (album) => (album.isSelected = false)
      );
    }
  }
);
</script>

<style lang="postcss">
.container {
  @apply bg-[#3D3D3D] w-[32vh] h-[40vh] relative;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container img {
  @apply w-[fit-content] h-[80%];
  object-fit: cover;
  border-radius: 4px 4px 0px 0px;
  aspect-ratio: 1;
}

.text_container {
  @apply w-[80%] h-[75%];
  /* background: radial-gradient(443.28% 9898.28% at 78.2% 165.52%, #D3082D 0%, rgba(115, 137, 252, 0.765625) 70.08%, rgba(252, 251, 255, 0) 100%); */
  border-radius: 8px;
  align-content: center;
  text-align: left;
  text-indent: 12px;
}

.text_container h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.8vh;
  line-height: 100%;
  align-items: center;
  color: #ffffff;
  text-align: left;
}

.text_container h2 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-style: normal;
  text-align: left;
  font-size: 2.4vh;
  color: #ffffff;
}
</style>
