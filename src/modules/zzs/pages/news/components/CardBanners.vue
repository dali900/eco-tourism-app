<template>
    <div class="card-banners flex flex-wrap align-items-center justify-content-center">
        <div v-if="banners[0]" class="card-banner_01 app-box-shadow flex flex-column justify-content-between">
            <div v-if="banners[0].title" class="banner-title align-self-center">
                {{ banners[0].title }}
            </div>
            <div class="banner-body align-self-center">
                <div v-if="banners[0]" v-html="banners[0].content"></div>
            </div>
            <div class="banner-footer align-self-center">
                <router-link :to="{ name: 'Banner1', params: {bannerSlug: banners[0].slug} }">
                    <CtaBtn :title="banners[0]['button_title']"/>
                </router-link>
            </div>
        </div>
        <div v-if="banners[1]" class="card-banner_02 app-box-shadow flex flex-column justify-content-between">
            <div v-if="banners[1].title" class="banner-title align-self-center">
                {{ banners[1].title }}
            </div>
            <div class="banner-body align-self-center">
                <div v-if="banners[1]" v-html="banners[1].content"></div>
            </div>
            <div class="banner-footer align-self-center">
                <router-link :to="{ name: 'Contact' }">
                    <CtaBtn :title="banners[1]['button_title']"/>
                </router-link>
            </div>
        </div>
        <div v-if="banners[2]" class="card-banner_01 app-box-shadow flex flex-column justify-content-between">
            <div v-if="banners[2].title" class="banner-title align-self-center">
                {{ banners[2].title }}
            </div>
            <div class="banner-body align-self-center">
                <div v-if="banners[2]" v-html="banners[2].content"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import CtaBtn from './CtaBtn.vue'

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

<style lang="scss">
.card-banners {
    overflow: hidden;
    width: 100%;
    top: 0;
}
.card-banners a{
    text-decoration: none;
}
.card-banner_01 {
    padding: 1.5rem;
    margin: 0.5rem;
    width: 380px;
    height: 257px;
    background-image: url(/images/banners/zzs_banner_01.png);
    background-size: cover;
    color: var(--color-zzs-navbar-text-primary) !important;
    text-align: center;
}
.card-banner_02 {
    padding: 1.5rem;
    margin: 0.5rem;
    width: 380px;
    height: 257px;
    background-image: url(/images/banners/zzs_banner_02.png);
    background-size: cover;
    color: var(--color-zzs-navbar-text-primary) !important;
    text-align: center;
}
.banner-title {
    display: flex;
    height: 39px;
    flex-direction: column;
    justify-content: flex-end;
    flex-shrink: 0;
    text-align: center;
    font-family: Inter;
    font-size: 28px;
    font-style: normal;
    font-weight: 800;
    line-height: 120%; /* 38.4px */
}
.banner-body {
    display: flex;
    height: 157px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    text-align: center;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
}
.banner-content {
    margin-bottom: 175px;
}
.banner-body, .banner-footer {
    // padding-top: 0.5rem;
}
.banner-footer {
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    // .see-more-btn {
    //     height: 31px;
    //     text-decoration: none;
    //     border-radius: 10px;
    //     border: 3px solid var(--color-zzs-navbar-background-primary);
    //     background: #ffffff !important;
    //     color: var(--color-zzs-navbar-background-primary) !important;
    // }
    // .see-more-btn:hover {
    //     border: 3px solid var(--color-zzs-navbar-background-primary);
    //     background-color: var(--color-zzs-card-hover-background-primary) !important;
    //     color: var(--color-zzs-navbar-background-primary) !important;
    // }
}
</style>