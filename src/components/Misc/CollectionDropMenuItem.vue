<template>
  <div class="flex flex-row items-center gap-1">
    <img
      v-if="collectionItem.albumCoverImage"
      :src="backendUrl + collectionItem.albumCoverImage"
      alt=""
      class="h-5 w-5 rounded-[0.25rem]"
    />
    <h2 class="text-size-[0.75rem] text-center text-white-500">
      {{ collectionItem.name }}
    </h2>
  </div>
</template>
<script setup lang="ts">
import type { ICollection } from "../../services/types";
let backendUrl: string;
const localStorageSettingsJSONString = localStorage.getItem("settings") ;
if (localStorageSettingsJSONString) {
    backendUrl = JSON.parse(localStorageSettingsJSONString).backend_url;
    
} else backendUrl= 'http://127.0.0.1:2234/';

const props = defineProps<{ collectionItem: ICollection }>();
</script>
