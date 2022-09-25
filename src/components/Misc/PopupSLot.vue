<template>
    <div class="popupContainer">
        <div class="slottedElement" ref="target">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

import AppState from '../../../state'
import { ref, inject} from "vue";
import { onClickOutside } from '@vueuse/core'


const target = ref(null)

onClickOutside(target, () => {
    state.popup = '';

})
const state = (inject('state') as AppState).state;

function disableAllPopups() {
    state.popup = '';
}

</script>

<style lang='postcss'>
.popupContainer {
  @apply absolute cursor-pointer w-[100%] h-[93vh] left-0 top-[7vh] z-1 max-h-[93vh] items-center flex justify-center;
  background-color:rgb(53, 53, 53, 0.4);
  
}
.slottedElement {
  @apply z-3 cursor-default flex items-center justify-center;
}
</style>