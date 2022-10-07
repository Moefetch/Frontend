<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center h-[7vh] pl-4 gap-4">

      <FieldErrorSlot :showRedBorderOnlyBool="formErrors.noAlbumSelectedError" >
        <BaseDropMenu :defaultSelected="defaultSelected == 'Home' ? 'Select album' : defaultSelected"
         :dropdownItemsArray="albums.map(album => album.albumName)" bg-color-hex="#111112" 
          @item-selected=" (selected: string) => selectSomething(selected, 'album')" 
          @click="formErrors.noAlbumSelectedError = false"/>
      </FieldErrorSlot>

      <FieldErrorSlot :showRedBorderOnlyBool="formErrors.noSortingSelected">
        <BaseDropMenu defaultSelected="Sort by" :dropdownItemsArray="sortBy" bg-color-hex="#111112" 
          @item-selected=" (selected: string) => selectSomething(selected, 'sortBy')"
          @click="formErrors.noSortingSelected = false"/>
      </FieldErrorSlot>

      <div class="flex flex-row justify-center items-center">
        <input class="advancedSearchInput" type="text"
          placeholder="[Optional] name includes" 
          v-model="searchForm.nameIncludes"
          />
      </div>

      <div class="flex flex-col h-8">
        <div class="flex flex-row justify-center items-center">
          <input class="advancedSearchInput" type="text"
            placeholder="[Optional] add tags"
            v-model="tagSearch"
            @keydown="invokeSearchTags(tagSearch)"
            />
          <Icon icon="plus"  class="h-6 w-6 relative right-[26px]"/>
        </div>
          <div class="tagsDropDown bg-black" v-if="tagSearch && tagsAutocomplete.length">
            <BaseDropMenuItem v-for="tag in tagsAutocomplete" :item="tag" class="h-6 items-center cursor-pointer" @click="addTagToForm(tag)" />
          </div>
      </div>

      
      <div class="checkbox_option w-[10rem]"  @click="searchForm.showNSFW = (!searchForm.showNSFW)">   
        <Icon :icon="searchForm.showNSFW ? 'checked_checkbox' : 'unchecked_checkbox'" />
        <h2>show NSFW</h2>
      </div>
  
      <Button text="confirm" color="#4d6d8d" class="rounded-[8px]" @click="submit()"/>
        
    </div>
    <div class="lex flex-row items-center h-[7vh] pl-4 gap-4">
      <div class="searchTagsContainer" v-if="searchForm.tags">
            <div class="searchTagsContainer pictureViewDataText textRoundedBg " v-for="tag in searchForm.tags" @click="removeTag(tag)">
              <Icon icon="x" class="w-4 h-4 cursor-pointer" />
                <h2 class="h-[fit-content] whitespace-nowrap pb-1" >
                    {{tag}}
                </h2>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue';
import { api } from '../../services/api';
import BaseDropMenu from './BaseDropMenu.vue';
import Button from "./Button.vue"
import Icon from './Icon.vue';
import BaseDropMenuItem from './BaseDropMenuItem.vue';
import router from '../../router';
import FieldErrorSlot from './FieldErrorSlot.vue';
import { AppState } from '../../../state';

const state = (inject('state') as AppState)
const tagSearch = ref('');
const tagsAutocomplete = ref<string[]>([]);

const searchForm = reactive<{
  album: string;
  sortBy?: string;
  nameIncludes?: string;
  showNSFW: boolean;
  tags?: Set<string>;
}>({
  album: '',
  showNSFW: true,
  tags: new Set([])
})

const formErrors = reactive({
  noAlbumSelectedError: false,
  noSortingSelected: false,
})

const props = defineProps<{
    albums: {albumName: string, albumUUID: string}[];
    defaultSelected: string;
}>();
if (props.defaultSelected !== 'Home') searchForm.album = props.defaultSelected;

const sortBy = [
    'Name',
    'Date Added',
    'Date Created'
]

function removeTag(value: string) {
  searchForm.tags?.delete(value)
}
function addTagToForm(tag: string) {
  searchForm.tags?.add(tag)
  tagSearch.value = '';
  tagsAutocomplete.value = []
}

function selectSomething(selected: string, formIndexer: "album" | "sortBy") {
  searchForm[formIndexer] = selected;
  
}

let tagLookupTimeout: number;

async function invokeSearchTags(tagSearch: string) {
  clearTimeout(tagLookupTimeout)
  tagLookupTimeout = setTimeout(async () => {
    if (tagSearch) {
      tagsAutocomplete.value = (await api.getTagsForSearchAutocomplete(tagSearch)).tags
    } else tagsAutocomplete.value = []
  }, 900);
}

function submit() {
  if (!searchForm.album) formErrors.noAlbumSelectedError = true;
  if (!searchForm.sortBy) formErrors.noSortingSelected = true;
  
  if (searchForm.album && searchForm.sortBy ) {
    searchForm.album = props.albums.find(album => album.albumName = searchForm.album)?.albumUUID ?? searchForm.album;
    if (searchForm.tags) {
      state.stateVariables.advancedSearchOptions.tags = Array.from(searchForm.tags) ?? undefined;
    }

    state.stateVariables.advancedSearchOptions.nameIncludes = searchForm.nameIncludes;
    state.stateVariables.advancedSearchOptions.sortBy = searchForm.sortBy.replace(' ', "_").toLocaleLowerCase();

    router.push({name: 'search', params: {albumUUID: searchForm.album}})

  }
  
}

</script>

<style scoped lang="postcss">

.advancedSearchInput[type="text"] {
    @apply outline-none w-[16rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2;
    @apply bg-[#111112];
    
    color: rgb(202, 202, 202);
}

.searchTagsContainer{ 
    @apply gap-y-[8px] gap-x-[4px] items-center flex flex-wrap;
}
.pictureViewDataText{
    @apply text-white-400 w-[fit-content];
}
.textRoundedBg{
    @apply bg-[#4F4F4F] rounded-[12px] p-1 pl-2 pr-2;
}
.tagsDropDown{
  @apply relative w-[16rem] h-[fit-content] top-[1px] rounded-b-[0.25rem];
  z-index: 2;
}
</style>