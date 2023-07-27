<template>
  <div v-for="value, key in helpContentRef" class="pl-8 p-4">
    <div class="flex flex-row gap-2" @click="value.clicked = (!value.clicked)">
      <Icon :icon="value.clicked ? 'down' : 'right'" class="w-6 h-6" />
      <h2 class="helpMain">{{key}}</h2>
    </div>
    <div v-if="value.clicked" class="p-6 flex flex-col gap-4">
      <HelpElement v-for="element in value.content" :image="element.image" :content="element.content"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { helpContent } from "../services/helpContent";
import HelpElement from "../components/Misc/HelpElement.vue";
import Icon from "../components/Misc/Icon.vue";

const helpContentRef = ref(helpContent)
/* defineProps<{}>();
defineEmits([]);
 */
</script>

<style scoped lang="postcss">
.helpMain{
  @apply text-size-[22px];
}
</style>