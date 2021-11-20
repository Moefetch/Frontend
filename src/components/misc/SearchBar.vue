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
      <img
        :src="searchString.length != 0 ? './icons/x.svg' : './icons/search.svg'"
        :class="{ activeImg: searchString.length != 0 }"
        
      />
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDebounceFn } from '@vueuse/core'

let searchRes = ref();
let focused = ref(false);
let searchString = ref('');
let searchPaused = ref(true);
//let timer = ref((func: Function, timeoutNumber: number)=>{return useDebounceFn(func, timeoutNumber)});




const typingTimeOut = useDebounceFn( ()=>{
  console.log('trigged a search', searchString.value )
  searchPaused.value = false
}, 700 )



/* 

let doneTyping = ref(async () => {
  if (searchString.value == "") return;
  //this.searchRes = await this.api.user.search(this.searchString.trim());
  console.log(searchRes);
})
let typingTimer = ref(() {
  if (timer.value != null) clearTimeout(timer);
  return (timer.value = timer.value(doneTyping.value, 500));
})
let clearTimer ref(() => {
  this.searchPaused = false;
  clearTimeout(this.timer);
})
let clearSearchDrop = ref(() => {
  this.searchRes = null;
  this.searchPaused = true;
  this.searchString = "";
})
let clearSearchClicked = ref(() => {
  this.searchRes = null;
  this.searchPaused = true;
})

let onClickSearchBar = ref((event: Event) => {
  this.$emit("clicked", "someValue");
})
let onBlurSearchBar = ref((event: Event) => {
  if (this.searchString.length == 0) this.$emit("unClicked", "someValue");
})
 */
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
  @apply z-10 self-start flex w-72 flex-col gap-2 max-h-600px p-2 transition-width duration-200 ease;
}

.search:focus-within,
.search.focused {
  @apply w-400px;
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
  color: var(--black);
}

.bar {
  @apply flex w-full h-full items-center justify-center gap-2 relative bg-dark-700 rounded-4px;
}

.inputField {
  @apply outline-none w-full h-full box-content transition transition-width duration-100 ease rounded-4px font-medium text-12px text-white border-none px-6px py-2;
  font-family: "Work Sans", sans-serif;
}

img {
  @apply w-4 h-4 absolute right-4px top-1/2 filter invert opacity-30 transform -translate-y-1/2;
}

img.activeImg {
  cursor: pointer;
}

.inputField::placeholder {
  @apply text-alpha-60;
}
</style>