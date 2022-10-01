<template>
  <div class="cursor-pointer">
    <div class="pictureCard">
      <div class="overflow-hidden rounded-[0.25rem]">
        <div class="muliImageNum" v-if="vIfVar > 1" :style="numPopStyles">
          <Icon icon="multi_image"/>
          <h2>{{vIfVar}}</h2>
        </div>
        <img :src="backendUrl + pictureURL" :class="'pictureCard ' + `${vIfVar > 1 ? 'hasMulti' : ''} ${doBlurBool  ? 'blurPicture' : ''}`"/>
      </div>
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
const settings = api.getSettings()
const numPopStyles = `
`
const doBlurBool = (props.item.isNSFW && settings?.blur_nsfw)
</script>

<style lang="postcss">
.pictureCard {

  @apply max-h-[150px] max-w-[280px];
  z-index: -1;

  object-fit: cover;
  column-gap: 1rem;
}
.muliImageNum {
  @apply relative p-[2px] rounded-[6px];
  background-color: rgba(134, 134, 134, 0.575);
  margin-left: auto;
  width: fit-content;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.hasMulti {
  
  position: relative;
  bottom: 26px;
}
.blurPicture{
  filter: blur(10px);
}
</style>