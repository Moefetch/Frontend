<template>
<div class="flex flex-col gap-4 pl-4 pt-4">
    <div class="pictureViewDataTextDiv">
        <h2 class="pictureViewDataText textRoundedBg">
            {{ picName.substring(picName.lastIndexOf('/') + 1) }}
        </h2>
        <!--  copy -->
    </div>

    <div class="pictureViewDataTextDiv " v-if="item.artists">
        <h2 class="pictureViewDataText">Artist{{item.artists.length > 1 ? 's' : ''}}</h2>
        <h2 class="pictureViewDataText textRoundedBg fixedPos" v-for="artist in item.artists">
            {{artist}}
        </h2>
    </div>

    <div class="pictureViewDataTextDiv" v-if="item.ids && item.storedResult">
        <h2 class="pictureViewDataText">PostID</h2>
        <h2 class="pictureViewDataText textRoundedBg fixedPos">
            {{item.ids[item.storedResult]}}
        </h2>
    </div>

    <div class="pictureViewDataTextDiv" v-if="item.links">
        <h2 class="pictureViewDataText">External links</h2>
        <a class="contents" v-for="link in linksReformated"  :href="linksAsAny[link]">
        <Icon class="pictureViewDataText textRoundedBg fixedPos max-h-8 max-w-8" :icon="link" >
            {{item.links}}
        </Icon>
        </a>    
    </div>

  
    <div class="pictureViewTagDiv flex-col gap-col-12" v-if="item.tags">
        <h2 class="pictureViewDataText text-size-[30px] relative top-6">Tags:</h2>
        <div class="tagsContainer">
            <div v-if="item.tags" class="tagsContainer">
                <h2 class="pictureViewDataText textRoundedBg h-[fit-content] whitespace-nowrap" v-for="tag in item.tags">
                    {{tag}}
                </h2>
                <div class="addNewTag">
                    <Icon icon="plus" />
                </div>
            </div>
        </div>
    </div>


</div>
</template>

<script lang="ts" setup>
import { IAnimePic } from "../../services/types";
import Icon from './Icon.vue'
const props = defineProps<{
  item: IAnimePic;
  indexer: number;
}>()
const picName = props.item.imagesDataArray[props.indexer].file;

const linksAsAny = props.item.links as any;
if (linksAsAny.other) linksAsAny.other = linksAsAny.other[0]
const linksReformated = Object.getOwnPropertyNames(linksAsAny)

</script>

<style lang="postcss">
.fixedPos{
    @apply absolute left-42;
}
.tagsContainer{ 
    @apply gap-y-[8px] gap-x-[12px] items-center flex flex-wrap;
}
.pictureViewDataText{
    @apply text-white-400 w-[fit-content];
}
.textRoundedBg{
    @apply bg-[#4F4F4F] rounded-[12px] p-1 pl-2 pr-2;
}
.pictureViewDataTextDiv{
    @apply w-full flex flex-row gap-24 items-center;
}
.pictureViewTagDiv{
    @apply w-full flex flex-col;

}
.addNewTag{
    @apply bg-[#4F4F4F] rounded-[12px] p-1 pl-2 pr-2;
    @apply h-8 w-8;
}
</style>