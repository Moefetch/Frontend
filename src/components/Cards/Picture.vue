<template>
  <div >
    <div class='picture_card'>
      <div class="muliImageNum" v-if="vIfVar" :style="numPopStyles">
      <Icon icon="multi_image"/>{{vIfVar}}
    </div>
      <img :src="backendUrl + pictureURL" class="picture_card"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "../../services/api";
import { IAnimePic } from "../../services/types";
import Icon from "../Misc/Icon.vue";

const props = defineProps<{
  item: IAnimePic;
}>();
const pictureURL = props.item.imagesDataArray[props.item.indexer].thumbnail_file;
const vIfVar = props.item.imagesDataArray.length
const backendUrl = api.getBackendUrl()

const numPopStyles = `

`

</script>

<style lang="postcss">
.picture_card {

  @apply max-h-[150px] max-w-[280px];

  border-radius: 4px;
  object-fit: cover;
  border-radius: 4px;
  column-gap: 1rem;
}
.muliImageNum {
  @apply relative;
  margin-left: auto;
  width: fit-content;
  top: 30px;
  right: 10px;
}

.hasMulti {
  
  position: relative;
  bottom: 24px;
}
</style>