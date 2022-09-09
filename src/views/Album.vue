<template>
  <div class="pictures_container grid" v-if="picsInAlbum">
    <Picture v-for="item in picsInAlbum" :item="item" />
  </div>
</template>

<script setup lang="ts">
import api from "../services/api";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import Picture from "../components/Cards/Picture.vue";
import type { IAnimePic } from "../services/types";

const route = useRoute();
const picsInAlbum = ref<IAnimePic[] | undefined>(undefined);
onMounted(async () => {
  getPicInAlbum();
});

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
