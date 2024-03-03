<template>
    <div class="title-banner ml-3 flex align-content-center align-items-center">
        <svg height="50" width="20" style="margin-left: -10px; background-color: var(--color-zzs-body-background)">
            <polygon points="15 0, 0 25, 15 50, 20 50, 20 0" style="fill: white"/>
        </svg>
        <img class="ml-1 mr-3 align-self-center" src="/images/zzs_green_logo.svg"> 
        <div class="title">{{title}}</div>
        <div class="chevron align-self-center">
            <svg height="50" width="20">
                <polygon points="0 0, 15 25, 0 50, 5 50, 20 25, 5 0" style="fill: var(--color-exportinfo-navbar-hover-background)"/>
            </svg>
            <svg height="50" width="20" style="margin-left: -10px;">
                <polygon points="0 0, 15 25, 0 50, 5 50, 20 25, 5 0" style="fill: var(--color-exportinfo-navbar-hover-background)"/>
            </svg>
            <svg height="50" width="20" style="margin-left: -10px;">
                <polygon points="0 0, 15 25, 0 50, 5 50, 20 25, 5 0" style="fill: var(--color-exportinfo-navbar-hover-background)"/>
            </svg>
            <svg height="50" width="20" style="margin-left: -10px; ">
                <polygon points="0 0, 15 25, 0 50, 20 50, 20 0" style="fill: var(--color-zzs-body-background)"/>
            </svg>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        default: false
    },
});
</script>

<style scoped>
.title-banner {
    background-color: white;
    width: fit-content;
}
.title-banner img{
    height: 30px;
}
.title-banner .title{
    font-size: 30px;
    align-self: center;
    font-weight: bold;
    font-family: Inter;
    text-transform: uppercase;
}
.chevron {
    background-color: white;
    height: 50px;
    width: 50px;
}
</style>