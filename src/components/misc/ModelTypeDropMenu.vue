<template>
    <div class="h-[1.84rem] w-[14rem]" ref="target">
        <div :class="`flex mt-auto mb-auto flex-row bg-dark-500 w-[14rem] h-[1.84rem] pl-[0.25rem] pr-[0.25rem] rounded-[0.2rem] cursor-pointer items-center ${toggled? 'rounded-b-none' : '' }`" @click="shittyClick()">
            <ModelTypeDropMenuItem :typeName="currentItem" :class="`h-[1.25] w-full` "  id="currentlyDisplayed" />
            <Icon :icon="toggled? 'up' : 'down'"  class="w-4 h-4"/>
        </div>
        <div v-if="toggled" :class="`flex flex-col bg-[#4B4B4B] w-[14rem] h-min pl-[0.25rem] pr-[0.25rem] rounded-[0.125rem] rounded-t-none relative`">

    <ModelTypeDropMenuItem v-for="item in modelTypesArray" :typeName="item" class="h-[1.25] w-[14rem] mt-[0.25rem] mb-[0.25rem] cursor-pointer" @click="clickedType(item)"/>
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
import ModelTypeDropMenuItem  from "./ModelTypeDropMenuItem.vue";

let toggled = ref(false);

const target = ref(null)

onClickOutside(target, () => {
    if(toggled.value) toggled.value = !toggled.value})

    
    
    const currentlyDisplayedPos = ref({top:0, left:0});
    
    const props = defineProps<{modelTypesArray: string[], selectedType: string}>();
   
    const currentItem = ref(props.modelTypesArray[0]);
   
    const emit = defineEmits(['type-selected']);
    
    import api from "../../services/api";
    const shittyClick = ref (async () => {
        //const response = await api.shit("cock"); 
        toggled.value = !toggled.value;
    })


function clickedType(type: string) {
    currentItem.value = type; 
    toggled.value = !toggled.value
    emit('type-selected', type);
}

</script>

<style>

</style>