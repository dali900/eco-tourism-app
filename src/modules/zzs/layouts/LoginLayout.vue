<script setup>
import  Navbar  from './components/Navbar.vue'
import  Footer  from './components/Footer.vue'
</script>

<template>
    <Navbar />
    <div class="container">
        <router-view></router-view>
    </div>
    <Footer /> 
</template>

<style>
@import "../../../assets/base.css";
@import "../assets/base.css";
.container {
    height: auto;
    min-height: 100%;
    position: relative;
    padding-top: 60px;
}
.auth {
    display: flex;
    width: 100%;
    height: 100vh;
}
</style>