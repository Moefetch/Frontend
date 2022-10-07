<template>
  <div class="cursor-pointer h-[fit-content]" ref="pictureRef">
    <div class="pictureCard">
      <div class="overflow-hidden rounded-[0.25rem]">
        <div class="muliImageNum" v-if="vIfVar > 1">
          <Icon icon="multi_image"/>
          <h2>{{vIfVar}}</h2>
        </div>
        <div class="selectedTopLeft" :style="(vIfVar > 1) ? 'top: -26px;' : 'top: 0px'"  v-if="state.isEditing">
          <Icon :icon="selected ? 'checked_checkbox' : 'unchecked_checkbox'" class="w-[24px] h-[24px]"/>
        </div>
        <div :class="'w-[fit-content] h-[fit-content] overflow-hidden relative rounded-[0.2rem] ' + (selected ? ' border-[#254EE0] rounded-[0.5rem] border-width-[2px]': '') "
        :style="`bottom: ${((vIfVar > 1) ? 26 : 0) + (state.isEditing ? 28 : 0)}px; `">
          <img :src="backendUrl + pictureURL" 
          :class="'pictureCard overflow-hidden ' + `${doBlurBool  ? 'blurPicture' : ''}`" 
          
          :draggable="false"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { api } from "../../services/api";
import { IPicture } from "../../services/types";
import Icon from "../Misc/Icon.vue";
import { AppState } from '../../../state'
import { Picture } from "../../services/picture";
const state = (inject('state') as AppState).stateVariables;
const pictureRef = ref<HTMLElement>();
const props = defineProps<{
  picture: Picture;
  selected?: boolean
}>();


const pictureURL = props.picture.imagesDataArray[props.picture.indexer].thumbnail_file;
const vIfVar = props.picture.imagesDataArray.length
const backendUrl = api.getBackendUrl()
const settings = api.getSettings()

const doBlurBool = (props.picture.isNSFW && settings?.blur_nsfw)


</script>

<style lang="postcss">
.pictureCard {

  @apply max-h-[150px] max-w-[280px] select-none relative;
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
.selectedTopLeft{
  @apply relative p-[2px] rounded-[6px];
  background-color: rgba(134, 134, 134, 0.575);
  margin-right: auto;
  width: fit-content;
  
  left: 1px;
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