<template>
    <div class="pictures_container grid" v-if="picsInAlbum">
        <Picture v-for="item in picsInAlbum" :pictureURL="item.thumbnail_file" />
    </div>
</template>

<script setup lang="ts">
import api from "../services/api";
import { useRoute } from "vue-router";
import { ref,onMounted } from "vue-demi";
const route = useRoute();

import Picture from "../components/Cards/Picture.vue"
import type { IAnimePic } from "../services/types";

const picsInAlbum = ref<IAnimePic[] | undefined>(undefined);
    onMounted(async () => {
        picsInAlbum.value = await api.getPicsInAlbum(route.params.albumName as string)
    })
</script>

<style>
    
.pictures_container {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    row-gap: 2rem;
    column-gap: 1rem;
    padding: 2rem;
    height: 100%;
    min-width: fit-content;
    max-width: 100%;
    width: 100%;
    justify-content: center;
    align-content: center;

}
</style>