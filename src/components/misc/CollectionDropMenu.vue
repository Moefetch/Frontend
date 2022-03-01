<template>
    <div class="h-[1.84rem] w-[14rem]" ref="target">
        <div :class="`flex mt-auto mb-auto flex-row bg-dark-500 w-[14rem] h-[1.84rem] pl-[0.25rem] pr-[0.25rem] rounded-[0.2rem] cursor-pointer items-center ${toggled? 'rounded-b-none' : '' }`" @click="shittyClick()">
            <CollectionDropMenuItem :collectionItem="getCurrentItemFromUUID(route.params.albumName)" :class="`h-[1.25] w-full` "  id="currentlyDisplayed" />
            <Icon :icon="toggled? 'up' : 'down'"  class="w-4 h-4"/>
        </div>
        <div v-if="toggled" :class="`flex flex-col bg-[#4B4B4B] w-[14rem] h-min pl-[0.25rem] pr-[0.25rem] rounded-[0.125rem] rounded-t-none relative`">
            <router-link v-for="item in collectionArray"  :to="`/album/${item.uuid}`">
            <CollectionDropMenuItem :collectionItem="item" class="h-[1.25] w-[14rem] mt-[0.25rem] mb-[0.25rem] cursor-pointer" @click=""/></router-link>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { onClickOutside } from '@vueuse/core'
import { ref } from "vue";
import type { ICollection } from "../../services/types";
import Icon from "./Icon.vue";
import CollectionDropMenuItem  from "./CollectionDropMenuItem.vue";

import { useRoute } from "vue-router";

const route = useRoute();


let toggled = ref(false);

const target = ref(null)

onClickOutside(target, () => {
    if(toggled.value) toggled.value = !toggled.value;
})

const props = defineProps<{collectionArray: ICollection[]}>();

function getCurrentItemFromUUID(parm: string | string[]) {
    return props.collectionArray.filter(a => a.uuid == parm)[0]
}

let currentlyDisplayedPos = ref({top:0, left:0})

    const shittyClick = ref (async () => {
        //const response = await api.shit("cock"); 
        toggled.value = !toggled.value;
    })

</script>

<style>

</style>