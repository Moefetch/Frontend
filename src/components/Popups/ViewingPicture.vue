<template>
  <div :class="`pictureContainer flex items-center flex-row gap-4 ${api.settings.stock_settings.thumbnail_list_to_left.checkBox?.checkBoxValue
    ? 'flex-row'
    : 'flex-col-reverse'
    }  `">
    <div :class="`pictureViewCardsContainerZero nice_scroll ${api.settings.stock_settings.thumbnail_list_to_left.checkBox?.checkBoxValue
    ? 'pictureViewCardsContainerLeft'
    : 'pictureViewCardsContainerBottom'
    }`" ref="target2">
      <div v-for="(pic, index) in item.media">
        <img v-if="item && (pic.thumbnailFile || !pic.isVideo)" :src="backendUrl + pic.thumbnailFile" :class="`pictureViewCards ${indexer == index ? 'pictureViewCardSelected' : ''
    } h-20`" @click="setIndexer(index)" />

        <video v-if="item && (!pic.thumbnailFile && pic.isVideo)" :src="backendUrl + pic.thumbnailFile ?? pic.file"
          :class="`pictureViewCards ${indexer == index ? 'pictureViewCardSelected' : ''
    } h-20`" @click="setIndexer(index)">
        </video>
      </div>
    </div>
    <div v-if="item.media[indexer].isVideo" class="pictureView">
      <video :src="backendUrl + item.media[indexer].file" controls="true" class="pictureView" ref="target" />
    </div>
    <img v-else :src="backendUrl + item.media[indexer].file" class="pictureView" ref="target" />
  </div>

  <div class="bg-[#32303A] absolute right-0 w-[30vw] h-[96vh] overflow-auto pb-4" ref="target3">
    <PictureViewData v-if="refreshBool" :item="item.media[indexer]" :indexer="indexer" />
  </div>
</template>

<script lang="ts" setup>
import { IEntry } from "../../services/types";
import { api } from "../../services/api";
import PictureViewData from "../Misc/PictureViewData.vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";

import { ref, inject } from "vue";

import { AppState } from "../../../state";

const state = (inject("state") as AppState).stateVariables;

const target = ref(null);
const target2 = ref(null);
const target3 = ref(null);

const clickedOutsideOf = {
  first: false,
  second: false,
  third: false,
};
onClickOutside(target, (e) => {
  if ((e.target as HTMLElement).id !== "editButton") clickOutsideFunc("first");
}, { event: "click" });

onClickOutside(target2, (e) => {
  if ((e.target as HTMLElement).id !== "editButton") clickOutsideFunc("second");
}, { event: "click" });

onClickOutside(target3, (e) => {
  if ((e.target as HTMLElement).id !== "editButton") clickOutsideFunc("third");
}, { event: "click" });

function clickOutsideFunc(ofWhich: "first" | "second" | "third") {
  clickedOutsideOf[ofWhich] = true;

  setTimeout(() => {
    if (
      state.popup == "ViewingPicture" &&
      clickedOutsideOf.first &&
      clickedOutsideOf.second &&
      clickedOutsideOf.third
    ) {
      state.popup = "";
    } else {
      clickedOutsideOf.first = false;
      clickedOutsideOf.second = false;
      clickedOutsideOf.third = false;
    }
  }, 10);
}

const props = defineProps<{
  item: IEntry;
  backendUrl: string;
  indexer: PicIndexer;
  maxIndex: number;
}>();
const indexer = ref(props.item.indexer);
const refreshBool = ref(true);

function setIndexer(params: number) {
  indexer.value = params;
  refreshBool.value = false;
  setTimeout(() => {
    refreshBool.value = true;
  }, 1);
}

onKeyStroke("ArrowLeft", (e) => {
  if (indexer.value > 0) {
    setIndexer(indexer.value - 1)
    e.preventDefault();
  } else if (state.popup != "AddNewPicturePopup") {
    if (props.indexer.value.value != 0) {
      setIndexer(0);
      props.indexer.set(props.indexer.value.value - 1);
      setTimeout(() => {
        setIndexer(props.item.media.length - 1)
      }, 10);

    }
    e.preventDefault();
  }
});

onKeyStroke("ArrowRight", (e) => {
  if (indexer.value < (props.item.media.length - 1)) {
    setIndexer(indexer.value + 1)
    e.preventDefault();
  } else if (state.popup != "AddNewPicturePopup") {
    setIndexer(0);
    if (props.indexer.value.value != props.maxIndex) {
      props.indexer.set(props.indexer.value.value + 1);
    }
    e.preventDefault();
  }
});


class PicIndexer {
  public value = ref(0);
  /**
   * set
   */
  public set(value: number) {
    this.value.value = value
  }
  constructor() {

  }
}

</script>

<style lang="postcss">
.pictureContainer {
  @apply absolute cursor-pointer w-[70vw] h-[93vh] left-0 z-1 max-h-[93vh];
}

.pictureView {
  @apply h-auto max-w-[50vw] mt-4 cursor-default m-auto max-h-[80vh];
  object-fit: scale-down;

  column-gap: 1rem;
}

.pictureViewCardsContainerZero {
  @apply flex gap-4 items-center justify-center w-[fit-content];
}

.pictureViewCardsContainerLeft {
  @apply flex-wrap ml-8 h-[84vh];
  direction: rtl;
}

.pictureViewCardsContainerBottom {
  @apply h-[100px];
}

.pictureViewCards {
  @apply max-h-[150px] max-w-[280px];
  z-index: -1;
  box-sizing: border-box;
  object-fit: cover;
  border-radius: 4px;
  column-gap: 1rem;
}

.pictureViewCardSelected {
  @apply border-blue-600 border-4;
}
</style>
