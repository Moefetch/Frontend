<template>
  <div>
    <h2 v-if="!image" class="text-white-400 text-size-[16px]">{{content}}</h2>
    <img v-if="image" :src="content" alt="" class="max-w-[34rem] ml-auto mr-auto shadow shadow-black shadow-md">
  </div>
</template>

<script setup lang="ts">
defineProps<{
    image: boolean;
    content: string;
}>();

/* defineEmits([]);
 */
</script>

<style scoped lang="postcss">

</style>