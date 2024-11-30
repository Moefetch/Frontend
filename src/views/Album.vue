<template>
  <div class="pictures_container grid" v-if="album && album.pictures" @mouseup="mouseRelease()"
    @mousedown="mouseClickBackground">
    <PictureItem v-for="(picture, index) in album.pictures" :entry="picture" :key="picture.id"
      @click="(e: Event) => handleMouseClick(e, picture, index)" @mousedown="holdDownMouseStart"
      :selected="picture.isSelected && state.stateVariables.isEditing" @mouseup="mouseDownBool = false"
      @mouseover="hoverOverPics(picture)" @mouseleave="handleMouseLeave(picture)" />

    <PopupSlot v-if="state.stateVariables.popup == 'ViewingPicture'">
      <ViewingPicture :entry="album.pictures[picIndexer.value.value]" :backendUrl="backendUrl" :indexer="picIndexer"
        :maxIndex="album.pictures.length - 1" />
    </PopupSlot>

    <EditControls :deleteSelection="() => album.deleteSelectedPics()" :hideSelection="() => album.handleHiding(true)"
      :unhideSelection="() => album.handleHiding(false)" v-if="state.stateVariables.isEditing" />
  </div>
</template>

<script setup lang="ts">
import { api } from "../services/api";
import { useRoute } from "vue-router";
import { ref, onMounted, inject, watch, computed } from "vue";

import PictureItem from "../components/Cards/PictureItem.vue";
import EditControls from "../components/Misc/EditControls.vue";

import ViewingPicture from "../components/Popups/ViewingPicture.vue";
import PopupSlot from "../components/Misc/PopupSlot.vue";

import { AppState } from "../../state";
import { Entry } from "../services/entry";
import { onKeyStroke } from "@vueuse/core";

const backendUrl = api.getBackendUrl();
const route = useRoute();
const state = inject("state") as AppState;

const album = computed(() => {
  if (state.stateVariables.albums[route.params.albumUUID as string]) state.stateVariables.albums[route.params.albumUUID as string].getPictures(state.stateVariables.advancedSearchOptions)
  return state.stateVariables.albums[route.params.albumUUID as string];
});
class PicIndexer {
  public value = ref(0);
  /**
   * set
   */
  public set(value: number) {
    this.value.value = value
  }
  constructor() {

  }
}
const picIndexer = new PicIndexer()
const mouseDownBool = ref(false);
const mouseDownOnPic = ref(false);

function mouseClickBackground(e: Event) {
  if ((e as any).buttons == 1) {
    if (state.stateVariables.popup) turnOffMouseDown();
    else mouseDownBool.value = true;
  }
}
/* 
onKeyStroke("ArrowLeft", (e) => {
  if (state.stateVariables.popup != "AddNewPicturePopup") {
    if (picIndexer.value.value != 0) {
      picIndexer.set(picIndexer.value.value - 1);
    }
    e.preventDefault();
  }
});

onKeyStroke("ArrowRight", (e) => {
  if (state.stateVariables.popup != "AddNewPicturePopup") {
    if (picIndexer.value.value != album.value.pictures.length - 1) {
      picIndexer.set(picIndexer.value.value + 1);
    }
    e.preventDefault();
  }
});
 */
onMounted(async () => {
  if (album.value) album.value.getPictures(state.stateVariables.advancedSearchOptions);
  state.clearAdvancedSearchOptions();
});

function toggleSelection(picture: Entry) {
  if (picture.isSelected) picture.deselect();
  else picture.select();
}

function turnOffMouseDown() {
  mouseDownBool.value = false;
  mouseDownOnPic.value = false;
}
function handleMouseClick(e: Event, picture: Entry, index: number) {
  e.stopPropagation()
  if (!state.stateVariables.isEditing) {
    turnOffMouseDown();
    picIndexer.set(index);
    state.stateVariables.popup = "ViewingPicture";
  } else {
    toggleSelection(picture);
  }
}

function holdDownMouseStart(e: Event) {
  /*  if (state.stateVariables.isEditing) {
    picture.select()
    
  }   */
  if ((e as any).buttons == 1) {
    mouseDownOnPic.value = true;
    mouseDownBool.value = true;
  }
}

function hoverOverPics(picture: Entry) {
  if (mouseDownBool.value && state.stateVariables.isEditing) {
    toggleSelection(picture);
  }
}
//selects first image when not editing then enables editing
function handleMouseLeave(picture: Entry) {
  if (!state.stateVariables.isEditing && mouseDownBool.value) {
    state.stateVariables.isEditing = true;
    //toggleSelection(picture)
  }
  if (state.stateVariables.isEditing && mouseDownOnPic.value) {
    mouseDownOnPic.value = false;
    toggleSelection(picture);
  }
}

function mouseRelease() {
  turnOffMouseDown();
}
watch(
  () => state.stateVariables.isEditing,
  () => {
    if (!state.stateVariables.isEditing) {
      album.value.pictures.forEach((pic) => pic.deselect());
      turnOffMouseDown();
    }
  }
);
</script>

<style lang="postcss">
.pictures_container {
  @apply flex flex-wrap gap-2 p-3;
}
</style>
../services/entry