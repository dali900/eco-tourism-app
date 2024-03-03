<template>
    <div class="page-not-found flex justify-content-center">
        <Card>
            <template #header>
                <div class="img-wrapper">
                    <img alt="page not found" class="page-not-found-img" src="/images/404-labyrinth.jpg">
                </div>
            </template>
            <template #title>
                Oprostite, čini se da smo zalutali u digitalnom lavirintu
            </template>
            <template #content>
                Nažalost, tražena stranica nije dostupna. Ipak, nemojte odustati - na putu istraživanja uvek se mogu pronaći neka iznenađenja.
            </template>
            <template #footer>
                <a href="/" class="p-button">Vrati me na početnoj</a>
            </template>
        </Card>
    </div>
</template>

<script setup>

</script>

<style scoped>
.img-wrapper {
    height: 300px;
    overflow: hidden;
}
.page-not-found {
   /*  height: 100%; */
}
.page-not-found-img {
    width: 100%;
}
</style>