<template>
  <router-link :to="`/settings/${name.toLowerCase()}`">
    <div class="SettingsMenuItem border-light-200 border-b" >
      <h2 class="text-light-100 pt-2 pb-2">
        {{ name }}
      </h2>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
    name: string
}>();

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