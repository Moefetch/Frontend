<template>
  <div class="flex flex-row items-center gap-1" v-if="collectionItem">
    <img 
      :src="backendUrl + collectionItem.albumCoverImage"
      v-if="collectionItem.albumCoverImage"
      alt=""
      class="h-5 w-5 rounded-[0.25rem]"
    />
    <h2 class="text-size-[0.75rem] text-center text-white-500">
      {{ collectionItem.name }}
    </h2>
  </div>
</template>
<script setup lang="ts">
import type { IAlbum } from "../../services/types";
import { api } from '../../services/api'
const backendUrl = api.getBackendUrl()
const props = defineProps<{ collectionItem: IAlbum }>();
</script>
