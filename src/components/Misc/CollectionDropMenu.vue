<template>
  <div class="h-[1.84rem] w-[14rem]" ref="target">
    <div :class="`flex mt-auto mb-auto flex-row bg-dark-500 w-[14rem] h-[1.84rem] pl-[0.25rem] pr-2 rounded-[0.2rem] cursor-pointer items-center ${toggled ? 'rounded-b-none' : ''
      }`" @click="toggleDropDown()">
      <CollectionDropMenuItem :collectionItem="currentAlbum" :class="`h-[1.25] w-full`" id="currentlyDisplayed" />
      <Icon :icon="toggled ? 'up' : 'down'" class="w-3 h-3" />
    </div>
    <div v-if="toggled"
      :class="`flex flex-col bg-[#4B4B4B] w-[14rem] pl-[0.25rem] pr-[0.25rem] rounded-[0.125rem] rounded-t-none relative`">
      <router-link v-for="item in albums" :to="`/album/${item.uuid}`">
        <CollectionDropMenuItem :collectionItem="item"
          class="h-[1.25] w-[14rem] mt-[0.25rem] mb-[0.25rem] cursor-pointer" @click="" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import type { IAlbum } from "../../services/types";
import Icon from "./Icon.vue";
import CollectionDropMenuItem from "./CollectionDropMenuItem.vue";

import { useRoute } from "vue-router";
const props = defineProps<{
  albums: IAlbum[];
  currentAlbum: IAlbum;
}>();

const route = useRoute();

let toggled = ref(false);

const target = ref(null);

onClickOutside(target, () => {
  if (toggled.value) toggled.value = !toggled.value;
});

const toggleDropDown = ref(async () => {
  //const response = await api.shit("cock");
  toggled.value = !toggled.value;
});
</script>

<style lang="postcss"></style>
