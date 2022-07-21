<template>
  <div class="search" :class="{ focused: searchString.length != 0 && !searchPaused }">
    <div class="bar">
      <input
        v-model="searchString"
        class="inputField"
        :class="{ active: searchString.length != 0 }"
        type="text"
        placeholder="Search "
        
        @keydown="typingTimeOut()"
        
        
      />
      <Icon :icon="searchString.length != 0 ? 'x' : 'search'" />
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDebounceFn } from '@vueuse/core'
import Icon from "./icon.vue";
let searchRes = ref();
let focused = ref(false);
let searchString = ref('');
let searchPaused = ref(true);
//let timer = ref((func: Function, timeoutNumber: number)=>{return useDebounceFn(func, timeoutNumber)});




const typingTimeOut = useDebounceFn( ()=>{
  console.log('trigged a search', searchString.value )
  searchPaused.value = false
}, 700 )



</script>

<style lang="postcss" scoped>
@media only screen and (max-width: 360px) {
  .search {
    width: 84vw;
    margin-right: 8px;
    max-width: 80%;
  }
}

.search {
  @apply z-10 self-start flex w-72 flex-col gap-2 max-h-600px p-2 duration-200 ease;
}

.search:focus-within,
.search.focused {
  @apply w-400px;
}
.bar img{
  color: rgb(218, 218, 218, 1);
}
.inputField.active {
  width: 500px !important;
}

h1.noResult {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 100%;
  display: flex;
  align-items: center;
}

.bar {
  @apply flex w-full h-full items-center justify-center gap-2 relative rounded-4px;
}

.inputField {
  @apply outline-none w-full h-[2rem] box-border transition duration-100 ease rounded-4px font-medium text-12px border-none px-6px py-2 bg-dark-700 placeholder-white-400;
  font-family: "Work Sans", sans-serif;
  color: white;
}

img {
  @apply w-4 h-4 absolute right-4px top-1/2 filter transform -translate-y-1/2;
  color: rgb(218, 218, 218, 1);
}

img.activeImg {
  cursor: pointer;
}

.inputField::placeholder {
  @apply text-opacity-100;
}
</style>