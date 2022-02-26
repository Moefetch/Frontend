<template>
  <div class="page-container flex align-center">
        <div class="albums_container grid align-center m-auto gap">
            
            <AlbumCard v-for="item in resTable" :name="item.name" :thumbnail="item.albumCoverImage" :router="item.uuid" /> 
            
            <AlbumAddCard @click="toggleCreateAlbumPopup()" @newAlbumSubmitted="toggleCreateAlbumPopup()"/>
            
            <div class="pop_out h-[93vh] top-[7vh] w-[100vw] absolute left-0" v-if="addAlbumToggled" @click="toggleCreateAlbumPopup()">
            </div>
                <CreateNewAlbumPopup v-if="addAlbumToggled"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import api from "../services/api" ;
import type { ICollection } from "../services/types";
import { onMounted, ref } from "vue";

import AlbumCard from "../components/Cards/AlbumCard.vue";
import AlbumAddCard from "../components/Cards/AlbumAddCard.vue"
import CreateNewAlbumPopup from "../components/Popups/CreateNewAlbumPopup.vue"

function toggleCreateAlbumPopup() {
    addAlbumToggled.value = !addAlbumToggled.value
}

let addAlbumToggled = ref(false);

let resTable = ref<[ICollection]>();

onMounted(async () => {resTable.value = (await api.getTableOfContents()); console.log(resTable.value)})

</script>

<style>
.albums_container {
    grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
    row-gap: 32px;
    padding: 2rem;
    height: 100%;
    min-width: fit-content;
    max-width: 100%;
    width: 100%;
    justify-content: center;
    align-content: center;

}
</style>