<template>
    <div v-if="banners.length" class="card-banners flex flex-wrap align-items-center justify-content-center">
        <div v-if="banners[0]" class="card-banner banner-1 app-box-shadow flex flex-column justify-content-between">
            <div v-if="banners[0].title" class="banner-title align-self-center">
                {{ banners[0].title }}
            </div>
            <div class="banner-body align-self-center">
                <div class="" v-if="banners[0]" v-html="banners[0].content"></div>
            </div>
            <div class="banner-footer align-self-center">
                <router-link :to="{ name: 'Banner1', params: {bannerSlug: banners[0].slug} }">
                    {{ banners[0].button_title }}
                </router-link>
            </div>
        </div>
        <div v-if="banners[1]" class="card-banner banner-2 app-box-shadow flex flex-column justify-content-between">
            <div v-if="banners[1].title" class="banner-title align-self-center">
                {{ banners[1].title }}
            </div>
            <div class="banner-body align-self-center" v-if="banners[1]" v-html="banners[1].content"></div>
            <div class="banner-footer align-self-center">
                <router-link :to="{ name: 'Contact' }">
                    {{ banners[1].button_title }}
                </router-link>
            </div>
        </div>
        <div v-if="banners[2]" class="card-banner banner-3 app-box-shadow flex flex-column justify-content-between">
            <div v-if="banners[2].title" class="banner-title align-self-center">
                {{ banners[2].title }}
            </div>
            <div class="banner-body align-self-center" v-if="banners[2]" v-html="banners[2].content"></div>
            <div class="banner-footer align-self-center">
                <router-link :to="{ name: 'Contact' }">
                    {{ banners[2].button_title }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>

import { computed, ref, watch } from 'vue'
const props = defineProps({
    user: {
        default: null
    },
    banners: {
        default: null
    }
});
const banners = ref(false);
//modelValue
watch( () => props.banners, (newVal, oldVal) => {
    banners.value = newVal.results;
});

const isFreeTrialUser = computed(() => props.user && props.user.role == "free_trial");
const pdfTooltipMsg = computed(() => !props.user || isFreeTrialUser.value ? "Niste prijavljeni za ovaj sadržaj." : "");

</script>

<style>
.card-banners {
    margin-top: -315px;
}
.card-banners a{
    text-decoration: none;
    color: var(--color-exportinfo-navbar-text-primary);
}
.card-banner {
    padding: 1.5rem;
    margin: 0.5rem;
    width: 250px;
    height: 250px;
    background-image: url(/images/banners/card_banner_bg.png);
    background-size: cover;
}
.banner-3 img {
    max-height: 144px;
    width: auto;
}
.banner-title {
    color: var(--color-exportinfo-navbar-text-primary);
    font-weight: 800;
    text-align: center;
}
.banner-body, .banner-body * {
    color: var(--color-exportinfo-navbar-text-primary);
}
.banner-body, .banner-footer {
    padding-top: 0.5rem;
}
.banner-footer a {
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    text-decoration: underline;
}
</style>