<template>
    <div class="bg-[#252525] h-[fit-content] w-122 rounded-[4px] p-[12px] flex flex-col gap-4">

        <div class="flex flex-row">
            <h2 class="text-light-100 w-[100%]">ID: {{ id }}</h2>
            <h2 class="text-light-100"> {{ queryItem.currentIndex }}/{{ queryItem.numberOfEntries }}</h2>
        </div>
        <div>
            <h2 class="text-light-100"> Status: {{ queryItem.status }}</h2>
        </div>
        <div class="download-bar" v-if="downloadProgress">
            <div class="bg-[#697980] h-2 w-116 rounded-[10px] p-0.25">
                <div class="bg-[#1A9FD8] h-1.5 rounded-[10px]" :style="`width: ${462 * downloadProgress / 100}px`">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IRequestStatus } from '../../services/types';

/* defineEmits([]); */
const props = defineProps<{
    queryItem: IRequestStatus;
    id: string | number;
    downloadProgress?: number;
}>();


</script>

<style scoped lang="postcss"></style>