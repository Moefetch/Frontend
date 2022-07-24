<template>
    <router-link class="container" :to="`/album/${router}`">
        <img :src="(backendUrl + thumbnail)"/>
        <div class="h-[20%] flex items-start w-full relative top-[1vh]">
            <div class="text_container">
                <h1>{{name}}</h1>
                <h2>{{estimatedPicCount}}</h2>
            </div>
            <Button icon="info" style="max-height: 6.4vh; aspect-ratio: 1;" @click="" />
        </div>
    </router-link>
</template>

<script  setup lang="ts">
import Button from "../Misc/Button.vue";
const backendUrl = localStorage.getItem("backendUrl") as string;

defineProps<{
  name: string;
  thumbnail?: string;
  router: string | undefined;
  estimatedPicCount: number;
}>();

</script>

<style lang="postcss">
.container {
@apply bg-[#3D3D3D]  w-[32vh] h-[40vh];
border-radius: 4px;
display: flex;
flex-direction: column;
align-items: center;
margin: auto;
border: 3px solid #254EE0;
}
.container img {
    @apply w-full h-[80%];
    object-fit: cover;
    border-radius: 4px 4px 0px 0px;
    aspect-ratio: 1;
}

.text_container {
    @apply w-[80%] h-[64%] ;
    /* background: radial-gradient(443.28% 9898.28% at 78.2% 165.52%, #D3082D 0%, rgba(115, 137, 252, 0.765625) 70.08%, rgba(252, 251, 255, 0) 100%); */
    border-radius: 8px;
    align-content: center;
    text-align: left;
    text-indent: 12px;

}
.text_container h1 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 2.8vh;
    line-height: 100%;
    align-items: center;
    color: #FFFFFF;
    text-align: left;

}
.text_container h2 {
 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    text-align: left;
    font-size: 2.4vh;
    color: #FFFFFF;
}

</style>