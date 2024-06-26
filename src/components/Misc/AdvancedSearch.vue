<template>
  <div class="flex flex-col gap-2">
    <div class="animateSearchIn flex flex-row items-center h-[7vh] pl-4 gap-4">
      <div class="min-w-[10rem]">
        <FieldErrorSlot :showRedBorderOnlyBool="formErrors.noAlbumSelectedError">
          <BaseDropMenu :defaultSelected="defaultSelected == 'Home'
          ? 'Select album'
          : selectAlbum(defaultSelected)
          " :dropdownItemsArray="albums.map((album) => album.albumName)" bg-color-hex="#111112"
            @item-selected="(selected: string) => selectAlbum(selected)"
            @click="formErrors.noAlbumSelectedError = false" />
        </FieldErrorSlot>
      </div>
      <div class="min-w-[10rem]">
        <FieldErrorSlot :showRedBorderOnlyBool="formErrors.noSortingSelected">
          <BaseDropMenu defaultSelected="Sort by" :dropdownItemsArray="sortBy" bg-color-hex="#111112"
            @item-selected="(selected: string) => selectSorting(selected)"
            @click="formErrors.noSortingSelected = false" />
        </FieldErrorSlot>
      </div>
      <div class="min-w-[10rem]">
        <BaseDropMenu :dropdownItemsArray="modelTypesArray" @item-selected="typeSelect" :defaultSelected="defaultSelected == 'Home'
          ? 'Select album'
          : selectAlbumType()
          " bg-color-hex="#111112" :class="`box-content`" />
      </div>

      <div class="flex flex-row justify-center items-center">
        <input class="advancedSearchInput" type="text" placeholder="[Optional] name includes"
          v-model="searchForm.nameIncludes" />
      </div>

      <div class="flex flex-col h-8">
        <div class="flex flex-row justify-center items-center">
          <input class="advancedSearchInput" type="text" placeholder="[Optional] add tags" v-model="tagSearch"
            @keydown="invokeSearchTags(tagSearch)" />
          <Icon icon="plus" class="h-6 w-6 relative right-[26px]" />
        </div>
        <div class="tagsDropDown bg-black" v-if="tagSearch && tagsAutocomplete.length">
          <BaseDropMenuItem v-for="tagObj in tagsAutocomplete" :item="tagObj.tag"
            class="h-6 items-center cursor-pointer" @click="addTagToForm(tagObj.tag)" />
        </div>
      </div>

      <div class="checkbox_option w-[10rem]" @click="searchForm.showNSFW = !searchForm.showNSFW">
        <Icon :icon="searchForm.showNSFW ? 'checked_checkbox' : 'unchecked_checkbox'
          " />
        <h2>show NSFW</h2>
      </div>

      <Button text="search" color="#4d6d8d" class="rounded-[8px]" @click="submit()" />
    </div>
    <div class="lex flex-row items-center h-[7vh] pl-4 gap-4">
      <div class="searchTagsContainer" v-if="searchForm.tags">
        <div class="searchTagsContainer pictureViewDataText textRoundedBg" v-for="tag in searchForm.tags"
          @click="removeTag(tag)">
          <Icon icon="x" class="w-4 h-4 cursor-pointer" />
          <h2 class="h-[fit-content] whitespace-nowrap pb-1">
            {{ tag }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject, onMounted } from "vue";
import { api } from "../../services/api";
import BaseDropMenu from "./BaseDropMenu.vue";
import Button from "./Button.vue";
import Icon from "./Icon.vue";
import BaseDropMenuItem from "./BaseDropMenuItem.vue";
import router from "../../router";
import FieldErrorSlot from "./FieldErrorSlot.vue";
import { AppState } from "../../../state";
import { AlbumSchemaType, IAutoCompleteTags } from "../../services/types";

const defaultSelectedAlbumType = ref<string | undefined>("");

const modelTypesArray = ref(["All Categories"]);
const state = inject("state") as AppState;
const tagSearch = ref("");

const tagsAutocomplete = ref<IAutoCompleteTags[]>([]);

const searchForm = reactive<{
  album: string;
  sortBy?: string;
  nameIncludes?: string;
  showNSFW: boolean;
  tags?: Set<string>;
}>({
  album: "",
  showNSFW: true,
  tags: new Set([]),
});

const formErrors = reactive({
  noAlbumSelectedError: false,
  noSortingSelected: false,
});

const props = defineProps<{
  albums: { albumName: string; albumUUID: string; type: string }[];
  defaultSelected: string;
}>();
if (props.defaultSelected !== "Home") {
  searchForm.album = props.defaultSelected
};

function typeSelect(a: AlbumSchemaType) {
  albumType.value = a
}
const sortBy = ["Name", "Date Added", "Date Created"];

function removeTag(value: string) {
  searchForm.tags?.delete(value);
}
function addTagToForm(tag: string) {
  searchForm.tags?.add(tag);
  tagSearch.value = "";
  tagsAutocomplete.value = [];
}
const albumType = ref("")
let albumUUID: string | undefined;

const filteredAlbum = props.albums.find(
  (album) => album.albumName == props.defaultSelected
);
function selectAlbum(selected: string) {
  searchForm["album"] = selected;

  albumType.value = filteredAlbum?.type as AlbumSchemaType;
  albumUUID = filteredAlbum?.albumUUID;
  return props.defaultSelected;
}
function selectAlbumType() {
  return filteredAlbum?.type
}
function selectSorting(selected: string) {
  searchForm["sortBy"] = selected;
}

let tagLookupTimeout: any;

async function invokeSearchTags(tagSearch: string) {
  clearTimeout(tagLookupTimeout);

  tagLookupTimeout = setTimeout(async () => {
    if (tagSearch && albumType) {
      tagsAutocomplete.value = (
        await api.getTagsForSearchAutocomplete(tagSearch, albumType.value)
      ).tags;
      console.log(tagsAutocomplete.value);
    } else tagsAutocomplete.value = [];
  }, 900);
}

function submit() {
  if (!searchForm.album) formErrors.noAlbumSelectedError = true;
  if (!searchForm.sortBy) formErrors.noSortingSelected = true;

  if (searchForm.album && searchForm.sortBy) {
    searchForm.album =
      props.albums.find((album) => (album.albumName = searchForm.album))
        ?.albumUUID ?? searchForm.album;
    if (searchForm.tags) {
      state.stateVariables.advancedSearchOptions.tags =
        Array.from(searchForm.tags) ?? undefined;
    }

    state.stateVariables.advancedSearchOptions.nameIncludes =
      searchForm.nameIncludes;
    state.stateVariables.advancedSearchOptions.sortBy = searchForm.sortBy
      .replace(" ", "_")
      .toLocaleLowerCase();

    state.stateVariables.albums[searchForm.album].getPictures(
      state.stateVariables.advancedSearchOptions
    );
    router.push({ name: "search", params: { albumUUID: searchForm.album } });
  }
}

onMounted(async () => {
  modelTypesArray.value = modelTypesArray.value.concat(
    await api.getModelTypes()
  );
});

</script>

<style scoped lang="postcss">
@keyframes dropDownAnimation {
  from {
    bottom: 50px;
  }

  to {
    bottom: 0px;
  }
}

.animateSearchIn {
  position: relative;
  animation-name: dropDownAnimation;
  animation-duration: 0.5s;
}

.advancedSearchInput[type="text"] {
  @apply outline-none w-[16rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
  @apply bg-[#111112];

  color: rgb(202, 202, 202);
}

.searchTagsContainer {
  @apply gap-y-[8px] gap-x-[4px] items-center flex flex-wrap;
}

.pictureViewDataText {
  @apply text-light-400 w-[fit-content];
}

.textRoundedBg {
  @apply bg-[#4F4F4F] rounded-[12px] p-1 pl-2 pr-2;
}

.tagsDropDown {
  @apply relative w-[16rem] h-[fit-content] top-[1px] rounded-b-[0.25rem];
  z-index: 2;
}
</style>
