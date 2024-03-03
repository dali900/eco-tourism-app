<template>
    <div class="page-not-found flex justify-content-center">
        <Card>
            <template #header>
                <img alt="page not found" class="page-not-found-img" src="/images/404.jpg">
            </template>
            <template #title>
                Page not found
            </template>
            <template #content>
                The link may be broken, or the page may have been removed.
            </template>
            <template #footer>
                <a href="/" class="p-button">Go to home</a>
            </template>
        </Card>
    </div>
</template>

<script setup>

</script>

<style>
.page-not-found {
   /*  height: 100%; */
}
.page-not-found-img {
    width: 300px;
}
</style>