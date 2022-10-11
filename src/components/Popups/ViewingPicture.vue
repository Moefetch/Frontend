<template>
    <div class="pictureContainer flex items-center flex-col gap-4">
      <img :src="backendUrl + item.imagesDataArray[indexer].file" class='pictureView' ref='target'/>
      <div class="flex flex-row gap-4 h-[24vh] items-center" ref='target2'>
        <div v-for="pic, index in item.imagesDataArray ">
          <img  :src="backendUrl + pic.file" :class='`pictureViewCards ${(indexer == index) ? "pictureViewCardSelected" : ""} h-20`' @click="setIndexer(index)" />
        </div>
      </div>
    </div>
    
    <div class="bg-[#32303A] absolute right-0 w-[30vw] h-[93vh] overflow-auto pb-4" ref='target3'>
       <PictureViewData v-if="refreshBool" :item="item" :indexer='indexer'/>
    </div>
</template>

<script lang="ts" setup>
import { IPicture } from "../../services/types";
import PictureViewData from "../Misc/PictureViewData.vue";
import { onClickOutside } from '@vueuse/core'

import { ref, inject} from "vue";

import { AppState } from '../../../state'

const state = (inject('state') as AppState).stateVariables;



const target = ref(null)
const target2 = ref(null)
const target3 = ref(null)

const clickedOutsideOf = {
  first: false,
  second: false,
  third: false,
}
onClickOutside(target, (e) => {
  if ((e.target as HTMLElement).id !== 'editButton') clickOutsideFunc('first');
})

onClickOutside(target2, (e) => {
  if ((e.target as HTMLElement).id !== 'editButton') clickOutsideFunc('second');
})

onClickOutside(target3, (e) => {
  if ((e.target as HTMLElement).id !== 'editButton') clickOutsideFunc('third');

})

function clickOutsideFunc(ofWhich: 'first' | 'second' | 'third') {
  clickedOutsideOf[ofWhich] = true;

  setTimeout(() => {
    
    if (clickedOutsideOf.first && clickedOutsideOf.second && clickedOutsideOf.third) {
      state.popup = '';
    }
    else {
      clickedOutsideOf.first = false;
      clickedOutsideOf.second = false;
      clickedOutsideOf.third = false;

    }

  }, 10);
}


const props = defineProps<{
  item: IPicture;
  backendUrl: string;
}>()
const indexer = ref(props.item.indexer)
const refreshBool = ref(true)

function setIndexer(params: number) {
  indexer.value = params;
  refreshBool.value = false;
  setTimeout(() => {
    refreshBool.value = true;
  }, 1);
}
</script>

<style lang="postcss">
.pictureContainer {
  @apply absolute cursor-pointer w-[70vw] h-[93vh] left-0  z-1 max-h-[93vh];

  
}

.pictureView {

@apply h-full max-w-[56vw] mt-4 cursor-default;
object-fit: cover;

column-gap: 1rem;
}

.pictureViewCards {
  
  @apply max-h-[150px] max-w-[280px] ;
  z-index: -1;
  box-sizing: content-box;
  object-fit: cover;
  border-radius: 4px;
  column-gap: 1rem;
}
.pictureViewCardSelected {
 @apply border-blue-600 border-4;
}
</style>