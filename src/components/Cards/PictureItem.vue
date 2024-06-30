<template>
  <div class="cursor-pointer h-[fit-content]">
    <div class="pictureCard">
      <div class="overflow-hidden rounded-[0.25rem]">
        <div class="muliImageNum" v-if="vIfVar > 1">
          <Icon icon="multi_image" />
          <h2>{{ vIfVar }}</h2>
        </div>
        <SelectSlot
          :selected="selected"
          :checkboxStyle="vIfVar > 1 ? 'top: -26px;' : 'top: 0px'"
          :slotStyle="`bottom: ${
            (vIfVar > 1 ? 26 : 0) + (state.isEditing ? 28 : 0)
          }px; `"
        >
          <div
            :class="'w-[fit-content] h-[fit-content] overflow-hidden relative rounded-[0.2rem] '"
          >
            <img v-if="!(picture.media[picture.indexer].isVideo && !thumbnailFile)"
              :src="backendUrl + pictureURL"
              :class="
                'pictureCard overflow-hidden ' +
                `${doBlurBool ? 'blurPicture' : ''}`
              "
              :draggable="false"
            />
            <video 
            v-if="picture.media[picture.indexer].isVideo && !thumbnailFile"
            :src="backendUrl + pictureURL"
            :class="
                'pictureCard overflow-hidden ' +
                `${doBlurBool ? 'blurPicture' : ''}`
              "
              :draggable="false"
            />
    
          </div>
        </SelectSlot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { api } from "../../services/api";
import Icon from "../Misc/Icon.vue";
import SelectSlot from "../Misc/SelectSlot.vue";
import { AppState } from "../../../state";
import { Picture } from "../../services/picture";
const state = (inject("state") as AppState).stateVariables;

const props = defineProps<{
  picture: Picture;
  selected?: boolean;
}>();
const thumbnailFile = props.picture.thumbnailFile;
const pictureURL =
  thumbnailFile ||
  props.picture.media[props.picture.indexer].thumbnailFile;

const vIfVar = props.picture.media.length;
const backendUrl = api.getBackendUrl();
const settings = api.getSettings();

const doBlurBool =
  props.picture.hasNSFW && settings.stock_settings.blur_nsfw.checkBox?.checkBoxValue;
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
.selectedTopLeft {
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
.blurPicture {
  filter: blur(10px);
}
</style>
