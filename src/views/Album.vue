<template>
  <div class="pictures_container grid" v-if="picsInAlbum">
    <Picture v-for="item in picsInAlbum" :item="item" @click="picToView = item; state.popup = 'ViewingPicture'"/>
    
    <PopupSLot v-if="picToView && state.popup == 'ViewingPicture'">
      <ViewingPicture :item="picToView" :backendUrl='backendUrl'/>
    </PopupSLot>
  </div>
</template>

<script setup lang="ts">
import api from "../services/api";
import { useRoute } from "vue-router";
import { ref, onMounted, inject } from "vue";

import Picture from "../components/Cards/Picture.vue";
import type { IAnimePic } from "../services/types";

import ViewingPicture from '../components/Popups/ViewingPicture.vue'
import PopupSLot from "../components/Misc/PopupSLot.vue";

import AppState from '../../state'
const backendUrl = api.getBackendUrl()


const state = (inject('state') as AppState).state;

const route = useRoute();
const picsInAlbum = ref<IAnimePic[] | undefined>(undefined);
onMounted(async () => {
  getPicInAlbum();
});
const picToView = ref<IAnimePic | undefined>(undefined);

async function getPicInAlbum() {
  picsInAlbum.value = await api.getPicsInAlbum(
    route.params.albumName as string
  );
}
</script>

<style lang="postcss">
.pictures_container {
  @apply flex flex-wrap gap-2 p-3;
}
</style>
