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
@apply flex flex-wrap gap-2 p-3;

}
</style>