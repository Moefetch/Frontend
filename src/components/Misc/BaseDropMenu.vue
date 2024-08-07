<template>
    <div class="h-[2rem]" ref="target">
        <div :class="`flex mt-auto mb-auto flex-row h-[2rem] pr-[0.25rem] rounded-[0.2rem] cursor-pointer items-center ${toggled ? 'rounded-b-none' : ''}`"
            @click="dropDownToggle()" :style="bgColorStyle">
            <BaseDropMenuItem :item="currentItem" :class="`h-[14px] w-full`" id="currentlyDisplayed" />
            <Icon :icon="toggled ? 'up' : 'down'" class="w-4 h-4" />
        </div>
        <div v-if="toggled" :class="`flex flex-col pr-[0.25rem] rounded-[0.125rem] rounded-t-none relative  z-4`"
            :style="bgColorStyle">
            <BaseDropMenuItem v-for="item in dropdownItemsArray" :item="item"
                class="h-[1.40rem] w-[14rem] cursor-pointer" @click="clickedType(item)" />
            <div v-if="specialItem" class="flex flex-row  w-[14rem] gap-4">
                <BaseDropMenuItem :item="specialItem"
                    class="h-[1.5rem] w-full rounded-[0.125rem] rounded-t-none cursor-pointer"
                    @click="emit('special-item-selected')" />
                <Icon icon="plus" class="h-[1.2rem] w-[1.2rem] m-auto mr-1" />
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { onClickOutside } from '@vueuse/core'
import { ref } from "vue";

import Icon from "./Icon.vue";
import BaseDropMenuItem from "./BaseDropMenuItem.vue";


let toggled = ref(false);

const props = defineProps<{
    dropdownItemsArray: string[];
    specialItem?: string;
    defaultSelected?: string
    bgColorHex?: string;
}>();

const bgColorStyle = props.bgColorHex ? `background-color: ${props.bgColorHex};` : 'background-color: #3d3d3d';
const target = ref(null)
onClickOutside(target, () => {
    if (toggled.value) toggled.value = !toggled.value;
})

const currentItem = ref(props.dropdownItemsArray[0]);

const emit = defineEmits(['item-selected', "special-item-selected"]);

const dropDownToggle = ref(async () => {
    //const response = await api.shit("cock"); 
    toggled.value = !toggled.value;
})


function clickedType(item: string) {
    currentItem.value = item;
    toggled.value = !toggled.value
    emit('item-selected', item);
}

if (props.defaultSelected) {
    currentItem.value = props.defaultSelected;
}

</script>

<style lang="postcss"></style>