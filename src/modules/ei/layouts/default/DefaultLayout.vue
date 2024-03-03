<script setup>
    import  Navbar  from './components/Navbar.vue'
    import  Footer  from './components/Footer.vue'
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="content">
            <router-view></router-view>
        </div>
        <Footer></Footer>
    </div>
</template>

<style lang="scss">
    @import "../../../../assets/base.css";
    @import "../../assets/base.css";

    .container {
        height: auto;
        min-height: 100%;
        position: relative;
        background-color: var(--color-exportinfo-body-background);
        padding-top: 60px;
        /* color: rgb(209, 213, 219); */
    }
    .content {
        margin: 0 auto;
    }
    .content > div:not(.user-news) {
        margin: 0 auto;
        max-width: 1200px;
    }
</style>