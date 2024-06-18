<template>
  <router-link :to="`/settings/${lowerCaseName}`" draggable="false">
    <div :class="`SettingsMenuItem border-light-200 border-b ${route.name == lowerCaseName ? 'bg-[#31343A]' : ''}`">
      <h2 class="text-light-100 pt-2 pb-2 pl-2">
        {{ name }} 
      </h2>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const props = defineProps<{
    name: string
}>();

const lowerCaseName = props.name.toLowerCase();
const route = useRoute();

/* defineEmits([]); */
</script>

<style scoped lang="postcss">
@media screen and (max-width: 481px){

  .SettingsMenuItem {
    width: 100%;
  }
}
@media screen and (min-width: 481px){
  .SettingsMenuItem {
    width: 20rem;
  }
}


</style>