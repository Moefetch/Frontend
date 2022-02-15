<template>
  <div class="page-container flex align-center">
        <div class="flex align-center flex-row gap-[84px] m-auto inline-block">
            <div v-if="dataReady" class="flex flex-row gap-[84px] m-auto">
                <AlbumCard v-for="item in resTable" :name="item.name" :thumbnail="item.thumbnail_file" /> 
            </div>
            <AlbumAddCard/>
        </div>
    </div>
</template>

<script setup lang="ts">
import api from "../services/api" ;
import { onMounted, ref } from "vue";
import AlbumCard from "../components/Cards/AlbumCard.vue";
import type { ITableOfContents } from "../services/types";
import AlbumAddCard from "../components/Cards/AlbumAddCard.vue"

let dataReady = ref(false);
let resTable = ref<[ITableOfContents]>();

onMounted(async () => {resTable.value = (await api.getTableOfContents()).table; dataReady.value = true;})
</script>

<style>

</style>