<template>
  <div>
    <h2 class="seperatorh2">
      <img v-if="seperatorIcon" :src="seperatorIcon" alt="" />
      {{ seperatorText }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  seperatorText: string;
  seperatorIcon?: string;
}>();
</script>

<style scoped lang="postcss">
.seperatorh2 {
  @apply flex flex-row;
}

.seperatorh2::after,
.seperatorh2::before {
  content: "";
  flex: 1 1;
  border-bottom: 2px solid #666;
  margin: auto;
}
</style>
