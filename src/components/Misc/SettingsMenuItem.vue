<template>
  <router-link :to="`/settings/${routeDictionary[name]}`" draggable="false">
    <div
      :class="`SettingsMenuItem border-light-200 border-b ${route.name == routeDictionary[name] ? 'bg-[#31343A]' : ''}`">
      <h2 class="text-light-100 pt-2 pb-2 pl-2">
        {{ name }}
      </h2>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const routeDictionary: any = {
  "Export/Import Settings": "export_or_import_settings",
  "Connections": "connections",
  "Appearance": "appearance",
  "Behaviour": "behaviour",
  "Parameters": "parameters",
  "Keys": "keys"
}

defineProps<{
  name: string
}>();

const route = useRoute();

/* defineEmits([]); */
</script>

<style scoped lang="postcss">
@media screen and (max-width: 481px) {

  .SettingsMenuItem {
    width: 100%;
  }
}

@media screen and (min-width: 481px) {
  .SettingsMenuItem {
    width: 20rem;
  }
}
</style>