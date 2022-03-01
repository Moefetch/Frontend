<template>
    <div class="h-[1.84rem] w-[14rem]" ref="target">
        <div :class="`flex mt-auto mb-auto flex-row bg-dark-500 w-[14rem] h-[1.84rem] pr-[0.25rem] rounded-[0.2rem] cursor-pointer items-center ${toggled? 'rounded-b-none' : '' }`" @click="shittyClick()">
            <BaseDropMenuItem :item="currentItem" :class="`h-[14px] w-full` "  id="currentlyDisplayed" />
            <Icon :icon="toggled? 'up' : 'down'"  class="w-4 h-4"/>
        </div>
        <div v-if="toggled" :class="`flex flex-col bg-[#4B4B4B] w-[14rem] h-min pr-[0.25rem] rounded-[0.125rem] rounded-t-none relative`">
            <BaseDropMenuItem v-for="item in dropdownItemsArray" :item="item" class="h-[1.25rem] w-[14rem] cursor-pointer" @click="clickedType(item)"/>
            <div  v-if="specialItem" class="flex flex-row  w-[14rem] gap-4">
                <BaseDropMenuItem :item="specialItem" class="h-[1.5rem] w-full rounded-[0.125rem] rounded-t-none cursor-pointer" @click="emit('special-item-selected')"/>
                <Icon icon="plus" class="h-[1.2rem] w-[1.2rem] m-auto mr-1"/>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed } from "@vue/reactivity";
import { onClickOutside } from '@vueuse/core'
import { ref } from "vue";
import type { Ref } from "vue";

import type { ICollection } from "../../services/types";
import Icon from "./Icon.vue";
import baseDropMenuItem  from "./BaseDropMenuItem.vue";

let toggled = ref(false);

const props = defineProps<{dropdownItemsArray: string[], specialItem?: string}>();

const target = ref(null)
onClickOutside(target, () => {
    if(toggled.value) toggled.value = !toggled.value;
})

const currentlyDisplayedPos = ref({top:0, left:0});


const currentItem = ref(props.dropdownItemsArray[0]);

const emit = defineEmits(['item-selected', "special-item-selected"]);

import BaseDropMenuItem from "./BaseDropMenuItem.vue";
const shittyClick = ref (async () => {
    //const response = await api.shit("cock"); 
    toggled.value = !toggled.value;
})


function clickedType(item: string) {
    currentItem.value = item; 
    toggled.value = !toggled.value
    emit('item-selected', item);
}

</script>

<style>

</style>