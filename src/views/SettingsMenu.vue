<template>
  <div class="p-4 flex flex-row">
    <div class="p-4">
      <SettingsMenuItem v-for="setting in settings" :name="setting"/>
    </div>
    <VerticalSeparator seperatorText="" class="h-[86vh]"></VerticalSeparator>
    <div class="settingView flex-col-reverse h-[85vh]">
      <router-view class="h-full"/>
      <SettingsbuttonPanel class="w-[60vw]"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SettingsMenuItem from "../components/Misc/SettingsMenuItem.vue";
import VerticalSeparator from "../components/Misc/VerticalSeparator.vue";
import SettingsbuttonPanel from "../components/Misc/SettingsbuttonPanel.vue";

const settings = ["Connections","Appearance","Behavior","Parameters","Keys"]
/* defineProps<{}>();
defineEmits([]);
 */

</script>

<style scoped lang="postcss">
.settingView{
  @apply p-4;
}
</style>