<template>
    <div class="comming-soon lex justify-content-center align-items-center">
        <div class="">
            <img alt="Logo" src="/images/app-logo.png" class="app-logo">
            <h1 class="title">BZR Portal stiže uskoro</h1>
        </div>
    </div>
</template>

<script setup>


</script>

<style scoped>
.comming-soon {
    background-image: url(/images/coming-soon/office-3.png);
    background-size: auto 100%;
    background-color: var(--color-bzr-body-background);;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    width: 100%;
    height: 100vh;
}
@media screen and (min-width: 992px){
    .comming-soon {
        background-image: url(/images/coming-soon/office-1.jpg);
        background-size: 100% auto;
    }
}
.app-logo {
    max-width: 100%;
}
.comming-soon-card{
    max-width: 290px;
    background-color: var(--gray-200) !important;
}

.title {
    color: white;
    text-align: center;
    margin-top: 20px;
    font-size: 50px;
    font-weight: bold;
    background-color:#2f2f2f;
}

</style>