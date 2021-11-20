<template>
    <div class="h-[1.625rem] w-[14rem]">
        <div :class="`flex mt-auto mb-auto flex-row bg-dark-500 w-[14] h-[1.625rem] pl-[0.25rem] pr-[0.25rem] rounded-[0.125rem] cursor-pointer items-center ${toggled? 'rounded-b-none' : '' }`" @click="shittyClick()">
            <CollectionDropMenuItem :collectionItem="currentItem" :class="`h-[1.25] w-full` " id="currentlyDisplayed"/>
            <Icon :icon="toggled? 'up' : 'down'"  class="w-4 h-4"/>
        </div>
        <div v-if="toggled" :class="`flex flex-col bg-[#4B4B4B] w-[14rem] h-min pl-[0.25rem] pr-[0.25rem] rounded-[0.125rem] rounded-t-none relative`" ref="target">
            <CollectionDropMenuItem v-for="item in collectionArray" :collectionItem="item" class="h-[1.25] w-[14rem] mt-[0.25rem] mb-[0.25rem] cursor-pointer" @click=""/>
        </div>
    </div>

<!--     <select>
        <option> -- -- -- </option>
        <option v-for="collection in collectionArray" data-thumbnail="https://cdn.discordapp.com/emojis/868784919407644743.png?size=80"> {{collection.name}} </option>

    </select> -->
</template>
<script setup lang='ts'>
import { computed } from "@vue/reactivity";
import { onClickOutside } from '@vueuse/core'
import { ref } from "vue";
import { ICollection } from "../../services/types";
import Icon from "./Icon.vue";
import CollectionDropMenuItem  from "./CollectionDropMenuItem.vue";

let toggled = ref(false);

const target = ref(null)

onClickOutside(target, () => {const eventTarget = event?.target?.id; if(eventTarget !== 'currentlyDisplayed') toggled.value = !toggled.value})

const props = defineProps<{collectionArray: ICollection[]}>();


let currentItemIndex = 0;

let currentItem = ref(props.collectionArray[currentItemIndex]);
let currentlyDisplayedPos = ref({top:0, left:0})
/* const toggleFunc =  ref(()=>{
    toggled.value = !toggled.value;
}) */
    import api from "../../services/api";
    const shittyClick = ref (async () => {
        const response = await api.shit("cock");
    })

</script>

<style>

</style>