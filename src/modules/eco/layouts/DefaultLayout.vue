<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="content">
            <RouterView />
        </div>
    </div>
    <Footer />
</template>

<style lang="scss">
@import "../../../assets/base.css";
@import "../assets/base.css";

.container {
    min-height: 100vh;
    position: relative;
    background-color: var(--color-bzr-body-background);
    padding-top: 60px;
    overflow: auto;
    /* color: rgb(209, 213, 219); */
}
.content {
    flex-grow: 1;
    width: 100%;
    position: relative;
    max-width: var(--container-width);
    margin: 0 auto;
    background-color: var(--color-grey);
    padding-bottom: 1px; /** fix da visina ide to futera */
}

</style>
