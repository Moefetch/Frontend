<template>
  <div class="pictures_container grid" v-if="album.pictures"
    @mouseup="mouseRelease()"
    @mousedown="mouseClickBackground()">
    
    <PictureItem v-for="picture, index in album.pictures" :picture="picture" :key="picture.id"
      @click="handleMouseClick(picture, index)"
      @mousedown="holdDownMouseStart()" 
      :selected="picture.isSelected && state.stateVariables.isEditing"
      @mouseup="mouseDownBool = false"
      @mouseover="hoverOverPics(picture)"
      @mouseleave="handleMouseLeave(picture)" />
    
    <PopupSlot v-if="state.stateVariables.popup == 'ViewingPicture'">
      <ViewingPicture :item="album.pictures[picIndexer]" :backendUrl='backendUrl'/>
    </PopupSlot>
    
    <EditControls 
    :deleteSelection="() => album.deleteSelectedPics()" 
    :hideSelection="() => album.handleHiding(true)" 
    :unhideSelection="() => album.handleHiding(false)" 
    v-if="state.stateVariables.isEditing" />
  </div>
</template>

<script setup lang="ts">
import { api } from "../services/api";
import { useRoute } from "vue-router";
import { ref, onMounted, inject, watch, computed } from "vue";

import PictureItem from "../components/Cards/PictureItem.vue";
import EditControls from "../components/Misc/EditControls.vue";

import ViewingPicture from '../components/Popups/ViewingPicture.vue'
import PopupSlot from "../components/Misc/PopupSlot.vue";

import { AppState } from '../../state'
import { Picture } from "../services/picture";
import { onKeyStroke } from '@vueuse/core'

const backendUrl = api.getBackendUrl()
const route = useRoute();
const state = (inject('state') as AppState)

const album = computed(()=>{
  return state.stateVariables.albums[route.params.albumUUID as string]
})

const picIndexer = ref(0)
const mouseDownBool = ref(false);
const mouseDownOnPic = ref(false);

function mouseClickBackground() {
  if(state.stateVariables.popup) turnOffMouseDown()
  else mouseDownBool.value = true;
}

onKeyStroke('ArrowLeft', (e) => {
  if (picIndexer.value != 0) { 
    picIndexer.value = --picIndexer.value
  }
  e.preventDefault()
})

onKeyStroke('ArrowRight', (e) => {
  if (picIndexer.value != (album.value.pictures.length - 1)) {
    picIndexer.value = ++picIndexer.value;
  }
  e.preventDefault()
})

onMounted(async () => {
  album.value.getPictures(state.stateVariables.advancedSearchOptions);
  state.clearAdvancedSearchOptions()
});

function toggleSelection(picture: Picture) {
  if (picture.isSelected) picture.deselect()
  else picture.select()
}

function turnOffMouseDown() {
  mouseDownBool.value = false; 
  mouseDownOnPic.value = false;
}
function handleMouseClick(picture: Picture, index: number) {
  if (!state.stateVariables.isEditing) {
    turnOffMouseDown()
    picIndexer.value = index;
    state.stateVariables.popup = 'ViewingPicture';
  } else {
    toggleSelection(picture)
  }

}

function holdDownMouseStart() {
 /*  if (state.stateVariables.isEditing) {
    picture.select()
    
  }   */
  mouseDownOnPic.value = true
  mouseDownBool.value = true
}

function hoverOverPics(picture: Picture) {
  if (mouseDownBool.value && state.stateVariables.isEditing) {
    toggleSelection(picture)
  }
  
} 
//selects first image when not editing then enables editing
function handleMouseLeave(picture: Picture) {
  
  if (!state.stateVariables.isEditing && mouseDownBool.value) {

    state.stateVariables.isEditing = true;
    //toggleSelection(picture)
  } 
  if (state.stateVariables.isEditing && mouseDownOnPic.value) {
    mouseDownOnPic.value = false;
    toggleSelection(picture)
  }
}

function mouseRelease(){
  turnOffMouseDown()
}
watch(()=> state.stateVariables.isEditing, ()=> {
  if (!state.stateVariables.isEditing) {
    album.value.pictures.forEach(pic => pic.deselect())
    turnOffMouseDown();
  }
})
</script>

<style lang="postcss">
.pictures_container {
  @apply flex flex-wrap gap-2 p-3;
}
</style>
