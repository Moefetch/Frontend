<template>
  <div class="flex flex-col gap-4 pl-4 pt-4 h-full">
    <div class="pictureViewDataTextDiv">
      <h2 class="pictureViewDataText textRoundedBg">
        {{ picName.substring(picName.lastIndexOf("/") + 1) }}
      </h2>
      <!--  copy -->
    </div>

    <div class="pictureViewDataTextDiv" v-if="viewedMediaItem.item.artists">
      <h2 class="pictureViewDataText">
        Artist{{ viewedMediaItem.item.artists.length > 1 ? "s" : "" }}
      </h2>
      <h2 class="pictureViewDataText textRoundedBg fixedPos" v-for="artist in viewedMediaItem.item.artists">
        {{ artist }}
      </h2>
    </div>

    <div class="pictureViewDataTextDiv" v-if="viewedMediaItem.item.ids">
      <h2 class="pictureViewDataText">PostID</h2>
      <h2 class="pictureViewDataText textRoundedBg fixedPos" v-for="id in viewedMediaItem.item.ids">
        {{ id }}
      </h2>
    </div>

    <div class="pictureViewDataTextDiv" v-if="viewedMediaItem.item.links">
      <h2 class="pictureViewDataText">External links</h2>
      <a class="contents" v-for="link in linksReformated" :href="linksAsAny[link]">
        <Icon class="pictureViewDataText textRoundedBg fixedPos max-h-8 object-contain w-max" :icon="link">
          {{ viewedMediaItem.item.links }}
        </Icon>
      </a>
    </div>

    <div class="pictureViewTagDiv flex-col gap-col-12">
      <h2 class="pictureViewDataText text-size-[30px] relative top-6">Tags:</h2>
      <div class="flex flex-col gap-4">
        <div class="tagsContainer">
          <Button v-if="editingState.editing" text="" icon="bulk_edit" color="#4d6d8d" class="w-[32px] rounded-[8px]"
            @click="handleBulkEditingTags()" />
          <div v-if="!bulkEditTagsToggle" class="tagsContainer">
            <div class="tagsContainer" v-if="viewedMediaItem.item.tags">
              <div v-for="(tag, tagIndex) in viewedMediaItem.item.tags">
                <h2 v-if="currentlyEditingTagIndex != tagIndex" @click="handleClickingTag(tagIndex)"
                  class="pictureViewDataText textRoundedBg h-[fit-content] whitespace-nowrap flex flex-row items-center">
                  <Icon v-if="editingState.editing" icon="x" class="h-4 w-4"
                    @click="e => handleRemovingTags(e, tagIndex)" />
                  {{ tag }}
                </h2>
                <input v-if="currentlyEditingTagIndex != null && currentlyEditingTagIndex == tagIndex"
                  class="pictureViewDataText textRoundedBg h-[fit-content] whitespace-nowrap" type="text"
                  v-model="editedTag">
              </div>
            </div>
            <div v-if="addNewTagToggle" :class="`cursor-pointer ${addNewTagToggle ? '' : 'bg-[#4F4F4F]'}`">
              <input v-model="newTag" ref="newTagInput" name="newTagInput" id="newTagInput" type="text"
                class="h-[32px] bg-[#4f4f4f] rounded-[8px] text-light-100" autofocus>
            </div>
            <div v-if="!addNewTagToggle || newTag.length" class="addNewTag cursor-pointer bg-[#4F4F4F]"
              @click="handleAddingNewTag()">
              <Icon icon="plus" />
            </div>
          </div>
        </div>
        <textarea v-if="bulkEditTagsToggle" type="text"
          class="h-[fit-content] min-h-10 w-[96%] bg-[#4f4f4f] rounded-[8px] text-light-100 whitespace-normal"
          v-model="bulkEditTagsInput" :style="`height: ${calculateHeightForTextArea(
            bulkEditTagsInput.length * 1 + 20
          )}px`" placeholder="Tags seperated by ," />
      </div>
    </div>
    <div class="absolute bottom-6 pl-3 flex flex-row w-[calc(90%-12px)]">
      <div class="flex flex-col-reverse gap-2" ref="target">
        <Icon icon="image_add" class="h-10 w-10 rounded-1 p-1 bg-gray-600"
          @click="addThumbnailOrEntryToggle = !addThumbnailOrEntryToggle" />
        <div v-if="addThumbnailOrEntryToggle" class="relative right-0 z-5">
          <div class="absolute right-0 bottom-0 flex flex-col-reverse gap-2">
            <Button text="Add Image/Video to This Entry" color="#4d6d8d"
              class="rounded-[10px] text-light-400 whitespace-nowrap"
              @click="editingState.addingPicture = !editingState.addingPicture; addThumbnailOrEntryToggle = !addThumbnailOrEntryToggle;" />
            <Button
              :text="`${viewedMediaItem.item.thumbnailFile == 'album_thumbnail_files/video.svg' ? 'Add a Thumbnail to' : 'Change Thumbnail of'} This Item`"
              color="#4d6d8d" class="rounded-[10px] text-light-400 whitespace-nowrap"
              @click="newItemThumbnailInputEL?.click()" />
            <Button text="Change Thumbnail of Entire Post" color="#4d6d8d"
              class="rounded-[10px] text-light-400 whitespace-nowrap" @click="newEntryThumbnailInputEL?.click()" />

            <input type="file" @change="handleChangingItemThumbnail" style="display: none" id="newItemThumbnailInputEL"
              name="newItemThumbnailInputEL" ref="newItemThumbnailInputEL" accept="image/*" />

            <input type="file" @change="handleChangingEntryThumbnail" style="display: none"
              id="newEntryThumbnailInputEL" name="newEntryThumbnailInputEL" ref="newEntryThumbnailInputEL"
              accept="image/*" />
          </div>
        </div>
        <div class="fixed top-[50%] left-[34%] z-4" v-if="editingState.addingPicture" ref=target2>
          <AddNewPicturePopup :addingToPreExistingPost_UUID="editingState.editedPostID"
            :addingToExistingPicFormStockOverrides="addingToExistingPicFormStockOverrides"
            :albumName="editingState.albumName" :editingState="editingState" />
        </div>

      </div>

      <div class="ml-auto mt-auto flex gap-2">
        <Button :text="editingState.editing ? 'Cancel' : 'Edit'" :color="editingState.editing ? '#a41414' : '#4d6d8d'"
          class="rounded-[10px] text-light-400 h-8" @click="toggleEditing" />
        <Button v-if="editingState.editing" text="Apply" color="#4d6d8d" class="rounded-[10px] text-light-400 h-8"
          @click="applyChanges()" />

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { IMediaItem, IEntryEditingState, defaultPicFormStockOverrides, IMediaSubmitFormStockOverrides } from "../../services/types";
import { api } from "../../services/api"
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import AddNewPicturePopup from "../Popups/AddNewPicturePopup.vue";

import { onKeyStroke, onClickOutside } from "@vueuse/core";
const editedTag = ref('');
const editedTagInput = ref<[HTMLDivElement] | undefined>(undefined);
const currentlyEditingTagIndex = ref<number | null>(null);

const bulkEditTagsToggle = ref(false);
const bulkEditTagsInput = ref('');


const newTag = ref('');
const addNewTagToggle = ref(false);
const newTagInput = ref<HTMLDivElement | undefined>(undefined);

const addThumbnailOrEntryToggle = ref(false);
const newItemThumbnailInputEL = ref<HTMLDivElement | undefined>(undefined);
const newEntryThumbnailInputEL = ref<HTMLDivElement | undefined>(undefined);
const target = ref(null);
const target2 = ref(null);

onClickOutside(target, () => {
  addThumbnailOrEntryToggle.value = false;
})


let newEntryThumnailCoverFile: string | File = "";
let newItemThumnailCoverFile: string | File = "";

//for the item being viewed currently 
const handleChangingItemThumbnail = (event: any) => {
  addThumbnailOrEntryToggle.value = false;
  props.editingState.editing = true;
  newItemThumnailCoverFile = event.target.files[0];

  if (typeof newItemThumnailCoverFile != "string")
    props.editingState.newItemThumbnailURL = URL.createObjectURL(newItemThumnailCoverFile);
  else props.editingState.newItemThumbnailURL = newItemThumnailCoverFile;
};
//for the WHOLE ENTRY 
const handleChangingEntryThumbnail = (event: any) => {
  addThumbnailOrEntryToggle.value = false;
  props.editingState.editing = true;
  newEntryThumnailCoverFile = event.target.files[0];
};
const props = defineProps<{
  item: IMediaItem;
  indexer: number;
  editingState: IEntryEditingState;
  //linksDictionary: { [key: string]: string } | undefined;
}>();
onClickOutside(target2, () => {
  props.editingState.addingPicture = false;
})

const addingToExistingPicFormStockOverrides: IMediaSubmitFormStockOverrides = JSON.parse(JSON.stringify(defaultPicFormStockOverrides)) as IMediaSubmitFormStockOverrides;

//user will not be able to add a cover image because you are editing a pre existing post
addingToExistingPicFormStockOverrides.thumbnailFile.hide = true;
//every input will be added to the original post being edited
if (addingToExistingPicFormStockOverrides.compileAllLinksIntoOneEntry.checkBox) addingToExistingPicFormStockOverrides.compileAllLinksIntoOneEntry.checkBox.checkBoxValue = true;
addingToExistingPicFormStockOverrides.compileAllLinksIntoOneEntry.disabledForEditing = true;
//this is used to communicate to backend that we are infact editing an already existing post and adding to it
if (addingToExistingPicFormStockOverrides.addToExistingEntry.checkBox) addingToExistingPicFormStockOverrides.addToExistingEntry.checkBox.checkBoxValue = true;
if (addingToExistingPicFormStockOverrides.addToExistingEntry.textField) addingToExistingPicFormStockOverrides.addToExistingEntry.textField.value = props.editingState.editedPostID;
addingToExistingPicFormStockOverrides.addToExistingEntry.disabledForEditing = true;



//initialize editng state to start state incase changed item in Entry
props.editingState.editing = false;
props.editingState.addingPicture = false;
props.editingState.newItemThumbnailURL = "";

const viewedMediaItem = reactive<{ item: IMediaItem }>({ item: JSON.parse(JSON.stringify(props.item)) }); //clone

function applyChanges() {
  if (addNewTagToggle.value) {
    pushNewTag();
  };
  if (bulkEditTagsToggle.value) handleBulkEditingTags();
  addNewTagToggle.value = false;
  if (newEntryThumnailCoverFile && props.editingState.editedPostID && props.editingState.albumName) {
    api.changeEntryThumbnail(props.editingState.albumName, props.editingState.editedPostID, newEntryThumnailCoverFile).then(newEntry => {
      setTimeout(() => {
        newEntry && props.editingState.entry.updateEntry(newEntry);
      }, 100);
    })
  }
  api.editItem(viewedMediaItem.item, newItemThumnailCoverFile).then((newMediaItem => {
    props.editingState.editing = false;
    for (const key in props.item) {
      if (Object.prototype.hasOwnProperty.call(props.item, key)) {
        (props.item as any)[key] = (newMediaItem as any)[key];
      }
    }
  })
  ).catch(console.log);
}

function handleRemovingTags(e: Event, tagIndex: number) {
  e.stopPropagation();
  if (viewedMediaItem.item.tags) {
    viewedMediaItem.item.tags.splice(tagIndex, 1);
  }
}

function handleBulkEditingTags() {
  if (!bulkEditTagsToggle.value) {
    bulkEditTagsInput.value = viewedMediaItem.item.tags?.join(", ") ?? "";
    bulkEditTagsToggle.value = true;
  }
  else {
    const tagsSet = new Set(bulkEditTagsInput.value.split(",").map(tag => tag.trim()))
    viewedMediaItem.item.tags = Array.from(tagsSet);
    if (viewedMediaItem.item.tags && viewedMediaItem.item.tags.length == 1 && viewedMediaItem.item.tags[0] == "") viewedMediaItem.item.tags = [];
    bulkEditTagsToggle.value = false;
  }

}

function calculateHeightForTextArea(something: number, placeholder?: string) {
  if (placeholder && placeholder?.length > 45) {
    return 40;
  }
  if (something > 300) {
    return 300;
  } else return something;
}

function handleClickingTag(tagIndex: number) {
  if (!props.editingState.editing) return;
  if (viewedMediaItem.item.tags) {
    if (currentlyEditingTagIndex.value != null) {
      //save previous before going to next
      viewedMediaItem.item.tags[currentlyEditingTagIndex.value] = editedTag.value;
      currentlyEditingTagIndex.value = null;
    }
    editedTag.value = viewedMediaItem.item.tags[tagIndex];
    currentlyEditingTagIndex.value = tagIndex;
    setTimeout(() => {
      if (editedTagInput.value) editedTagInput.value[0].focus();
    }, 200);

  }
}

function toggleEditing() {
  if (!props.editingState.editing) {
    props.editingState.editing = true;
  }
  else {
    viewedMediaItem.item = JSON.parse(JSON.stringify(props.item)); //clone
    props.editingState.editing = false;
    addNewTagToggle.value = false;
    currentlyEditingTagIndex.value = null;
  }
}

function handleAddingNewTag() {
  if (!addNewTagToggle.value) {
    addNewTagToggle.value = true;
    newTagInput.value?.focus();
    props.editingState.editing = true;
  }
  else pushNewTag();
}


onKeyStroke("Enter", (e) => {
  if (addNewTagToggle.value) {
    pushNewTag()
  }
  e.preventDefault();
});

function pushNewTag() {
  if (viewedMediaItem.item.tags && !viewedMediaItem.item.tags?.find(tag => tag == newTag.value)) viewedMediaItem.item.tags.push(newTag.value);
  newTag.value = "";
  newTagInput.value?.focus();
}


const picName = viewedMediaItem.item.file;
let linksAsAny: any | undefined = undefined;
let linksReformated: string[] | undefined = undefined;
if (viewedMediaItem.item.links) {
  //if (props.linksDictionary) linksAsAny = props.linksDictionary as any;
  linksAsAny = viewedMediaItem.item.links;

  if (linksAsAny.other) linksAsAny.other = linksAsAny.other[0];
  linksReformated = Object.getOwnPropertyNames(linksAsAny);
}
</script>

<style lang="postcss">
.fixedPos {
  @apply absolute left-42;
}

.tagsContainer {
  @apply gap-y-[8px] gap-x-[12px] items-center flex flex-wrap;
}

.pictureViewDataText {
  @apply text-light-400;
}

.textRoundedBg {
  @apply bg-[#4F4F4F] rounded-[12px] p-1 pl-2 pr-2;
}

.pictureViewDataTextDiv {
  @apply w-full flex flex-row gap-24 items-center;
}

.pictureViewTagDiv {
  @apply w-full flex flex-col;
}

.addNewTag {
  @apply rounded-[12px] p-1 pl-2 pr-2;
  @apply h-8 w-8;
}
</style>
