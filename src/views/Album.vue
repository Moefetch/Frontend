<template>
    <h1>{{$route.params.albumName}}</h1>
</template>

<script setup lang="ts">
import api from "../services/api";
import { useRoute } from "vue-router";
const route = useRoute();
api.getAnimePicsInAlbum(route.params.albumName as string)
</script>