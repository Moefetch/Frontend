<template>
    <div class="flex flex-row  bg-dark-400 items-center">
        <Button icon="home" />
        <CollectionDropMenu :collectionArray="shit1" />
        <div class="m-auto">
            <SearchBar/>
        </div>
        <Button icon="plus" @click=""/>
    </div>
</template>

<script setup lang="ts">
    import Button from "../misc/Button.vue";
    import CollectionDropMenu from "../misc/CollectionDropMenu.vue";
    import type { ICollection } from "../../services/types";
    import SearchBar from "../misc/SearchBar.vue";

    
    import api from "../../services/api" ;
    import { onMounted, ref } from "vue";
    import type { ITableOfContents } from "../../services/types";
    let dataReady = ref(false);
    let resTable = ref<[ITableOfContents]>();
    onMounted(async () => {resTable.value = (await api.getTableOfContents()).table; dataReady.value = true;})


    const shit1: ICollection[] = [
        {imageURL: "https://cdn.discordapp.com/attachments/881632596298170399/901766516058509332/7e30eb81cc06fbf442a63d8e8d72adedb2c3a0ed.jpg",
        name: "your mom",
        route: "nothing for now",
    }, {imageURL: "https://cdn.discordapp.com/emojis/872729193748774972.png",
        name: "second",
        route: "nothing for now",} 
    ]


</script>
