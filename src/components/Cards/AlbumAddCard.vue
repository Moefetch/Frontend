<template>
    <div class="container">
        <div class="flex flex-col items-center align-center m-auto">
            <Icon icon="plus" class="h-[70px] w-[70px]"/>
            <h1>Create</h1>
        </div>
    </div>
</template>

<script  setup lang="ts">
import Icon from "../misc/Icon.vue";
</script>

<style scoped>
.container {
@apply bg-[#3D3D3D] border-[3px] border-[#254EE0] gap-[14px] w-[32vh] h-[40vh];
@apply flex-col gap-[4px] align-center;
box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.12);
border-radius: 4px;
display: flex;
flex-direction: column;
align-items: center;
cursor: pointer;
margin: auto;
}
.container img {
    @apply h-[12.4vh] w-[12.4vh];
    object-fit: cover;
    border-radius: 4px;
}

.text_container {
    @apply w-[210px] h-[36px];
    background: radial-gradient(443.28% 9898.28% at 78.2% 165.52%, #D3082D 0%, rgba(115, 137, 252, 0.765625) 70.08%, rgba(252, 251, 255, 0) 100%);
    border-radius: 8px;
    align-content: center;

}
.container div h1 {
    @apply text-center flex items-center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 4vh;
    line-height: 175%;
    color: #FFFFFF;
    text-indent: -2px;
}
</style>