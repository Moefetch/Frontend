<template>
  <div
    :class="`pictureContainer flex items-center flex-row gap-4 ${
      api.settings.stock_settings.thumbnail_list_to_left.checkBoxValue
        ? 'flex-row'
        : 'flex-col-reverse'
    }  `"
  >
    <div
      :class="`pictureViewCardsContainerZero nice_scroll ${
        api.settings.stock_settings.thumbnail_list_to_left.checkBoxValue
          ? 'pictureViewCardsContainerLeft'
          : 'pictureViewCardsContainerBottom'
      }`"
      ref="target2"
    >
      <div v-for="(pic, index) in item.imagesDataArray">
        <img
          :src="backendUrl + pic.file"
          :class="`pictureViewCards ${
            indexer == index ? 'pictureViewCardSelected' : ''
          } h-20`"
          @click="setIndexer(index)"
        />
      </div>
    </div>
    <img
      :src="backendUrl + item.imagesDataArray[indexer].file"
      class="pictureView"
      ref="target"
    />
  </div>

  <div
    class="bg-[#32303A] absolute right-0 w-[30vw] h-[93vh] overflow-auto pb-4"
    ref="target3"
  >
    <PictureViewData
      v-if="refreshBool"
      :item="item"
      :indexer="indexer"
      :linksDictionary="item.isMultiSource ? (item.links as any)[indexer] : undefined"
    />
  </div>
</template>

<script lang="ts" setup>
import { IPicture } from "../../services/types";
import { api } from "../../services/api";
import PictureViewData from "../Misc/PictureViewData.vue";
import { onClickOutside } from "@vueuse/core";

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
});

onClickOutside(target2, (e) => {
  if ((e.target as HTMLElement).id !== "editButton") clickOutsideFunc("second");
});

onClickOutside(target3, (e) => {
  if ((e.target as HTMLElement).id !== "editButton") clickOutsideFunc("third");
});

function clickOutsideFunc(ofWhich: "first" | "second" | "third") {
  clickedOutsideOf[ofWhich] = true;

  setTimeout(() => {
    if (
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
  item: IPicture;
  backendUrl: string;
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
</script>

<style lang="postcss">
.pictureContainer {
  @apply absolute cursor-pointer w-[70vw] h-[93vh] left-0  z-1 max-h-[93vh];
}

.pictureView {
  @apply h-auto max-w-[50vw] mt-4 cursor-default m-auto max-h-[80vh];
  object-fit: scale-down;

  column-gap: 1rem;
}
.pictureViewCardsContainerZero {
  @apply flex gap-4 items-center;
}
.pictureViewCardsContainerLeft {
  @apply flex-wrap ml-8 h-[84vh] w-[220px];
  direction: rtl;
}

.pictureViewCardsContainerBottom {
  @apply h-[100px] w-[60vw];
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
