<template>
<img :src="backendUrl + pictureURL" class="picture_card"/>
</template>

<script setup lang="ts">
import api from "../../services/api";
defineProps<{
  pictureURL?: string;
}>();
const backendUrl = api.getBackendUrl()

</script>

<style lang="postcss">
.picture_card {

  @apply max-h-[150px] max-w-[280px];

  border-radius: 4px;
  object-fit: cover;
  border-radius: 4px;
  column-gap: 1rem;
}
</style>