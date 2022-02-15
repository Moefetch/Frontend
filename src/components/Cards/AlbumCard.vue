<template>
    <div class="container">
        <img :src="thumbnail"/>
        <div class="h-[20%] flex items-center w-full align-center">
            <div class="text_container">
                <h1>{{name}}</h1>
            </div>
        </div>
    </div>
</template>

<script  setup lang="ts">
defineProps<{
  name: string;
  thumbnail?: string;
}>();

</script>

<style>
.container {
@apply bg-[#3D3D3D] border-[3px] border-[#254EE0] w-[32vh] h-[40vh];
box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
border-radius: 4px;
display: flex;
flex-direction: column;
align-items: center;
}
.container img {
    @apply w-full h-[80%];
    object-fit: cover;
    border-radius: 4px;
    aspect-ratio: 1;
}

.text_container {
    @apply w-[80%] h-[64%] m-auto;
    background: radial-gradient(443.28% 9898.28% at 78.2% 165.52%, #D3082D 0%, rgba(115, 137, 252, 0.765625) 70.08%, rgba(252, 251, 255, 0) 100%);
    border-radius: 8px;
    align-content: center;

}
.text_container h1 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 175%;
    align-items: center;
    color: #FFFFFF;
    text-align: center;


}
</style>