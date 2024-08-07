<template>
    <div>
        <div
            class="absolute top-2 right-24 bg-[#3c3c3c] h-200 w-130 rounded-[6px] nice_scroll p-[16px] flex flex-col-reverse gap-3">
            <QueueItem v-for="(request, id) in state.stateVariables.queue.requests" :query-item="request"
                :download-progress="state.stateVariables.queue.downloadProgressBars[id]" :id="id" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { AppState } from "../../../state";
import QueueItem from "../Misc/QueueItem.vue";

const state = inject("state") as AppState;

/* defineProps<{}>();
defineEmits([]);
 */
</script>

<style scoped lang="postcss"></style>