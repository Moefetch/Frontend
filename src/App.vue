<template>
  <Header
    class="h-[7vh]"
    @isEditing="toggledEditing"
    @submittedNewPic="toggledSubmittedPic"
  />
  <div class="h-[93vh]">
    <router-view :isEditing="isEditingRef" />
  </div>
</template>
<script setup lang="ts">
import { ref, provide } from "vue";
import Header from "./components/Global/Header.vue";
import AppState from "../state" 
import api from "./services/api";

const state = new AppState();
setResTable();
provide("state", state);

const isEditingRef = ref(false); // im doing a retarting way of sending events between nested components but whatever, i have to use vueX eventually for this
// const submittedPicRef = ref(false);

function toggledEditing() {
  isEditingRef.value = !isEditingRef.value;
}

function toggledSubmittedPic() {
  /*   submittedPicRef.value = !submittedPicRef.value;
  setTimeout(() => {
  submittedPicRef.value = !submittedPicRef.value;
  }, 100); */
}

//localStorage.setItem("backendUrl","http://localhost:2234/") //bruh

//localStorage.setItem("setupBool","false"); //bruh


async function setResTable() {
    const tablesContentRes = await api.getTableOfContents();
    localStorage.setItem("albums", JSON.stringify(tablesContentRes));
    state.state.collectionArray = tablesContentRes;
    
}

</script>

<style lang="postcss">
body {
  @apply bg-[rgba(29,32,38,1)];
}
</style>
