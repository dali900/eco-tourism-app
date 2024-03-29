<template>
    <div class="auth-layout" :style="{ backgroundImage: `url(images/login/${selectedImage})` }">
        <div class="auth flex justify-content-center align-items-center">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
const randomNumber = Math.floor(Math.random() * 15) + 1;
const selectedImage = `login${randomNumber}.jpg`;
</script>

<style>
.auth-layout {
    background-position: center; 
    background-repeat: no-repeat;
    background-size: cover;
}
.auth {
    display: flex;
    width: 100%;
    height: 100vh;
}
</style>