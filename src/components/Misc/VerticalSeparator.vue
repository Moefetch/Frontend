<template>
  <div class="seperatorv">
    <h2 >
      <img v-if="seperatorIcon" :src="seperatorIcon" alt="" />
      {{ seperatorText }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  seperatorText?: string;
  seperatorIcon?: string;
}>();
</script>

<style scoped lang="postcss">
.seperatorv {
  @apply flex flex-col;
}

.seperatorv::after,
.seperatorv::before {
  content: "";
  flex: 1 1;
  border-left: 2px solid #a5a5a5;
  height: auto;
  margin: auto;
}
</style>
