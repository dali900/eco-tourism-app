<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
    <Navbar />
    <div class="container">
        <router-view></router-view>
    </div>
    <Footer></Footer>
</template>

<style lang="scss">
@import "../../../assets/base.css";
@import "../assets/base.css";

.container {
    height: auto;
    min-height: 100%;
    position: relative;
    background-color: var(--color-zzs-body-background);
    padding-top: 60px;
    // padding-bottom: 280px;
    /* color: rgb(209, 213, 219); */
}
.p-component-overlay {
    backdrop-filter: blur(6px) !important;
}
</style>
