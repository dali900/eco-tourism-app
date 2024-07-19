<template>
    <div class="ad-container">
        <!-- <div class="full-screen-gallery">

        </div> -->
        <div v-if="ad" class="ad">
            <div class="header">
                <div class="title">
                    {{ ad.t.title }}
                </div>
                <div class="price">
                    {{ ad.price_formated }} <span>{{ ad.currency }}</span>
                </div>
            </div>
            <div class="ad-data">
                <div class="grid">
                    <div class="field col-12 md:col-6 lg:col-6">
                        <!-- <div class="images">
                            <Splide v-if="ad.images" ref="mainSplideRef" :options="mainOptions" aria-label="My Favorite Images">
                                <SplideSlide v-for="img in ad.images">
                                    <img class="splide-img" :src="apiBaseUrl+img.file_url" :alt="ad.title">
                                </SplideSlide>
                            </Splide>
                        </div>
                        <div class="images">
                            <Splide v-if="ad.images" ref="thumbnailSplideRef" :options="thumbsOptions" aria-label="My Favorite Images">
                                <SplideSlide v-for="img in ad.images">
                                    <img class="splide-img" :src="apiBaseUrl+img.file_url" :alt="ad.title">
                                </SplideSlide>
                            </Splide>
                        </div> -->
                        <!-- <div class="imagess">
                            <lightgallery
                                :items="ad.images"
                                :settings="{ 
                                    speed: 500, 
                                    plugins: plugins,
                                }"
                            >
                                <a v-for="img in ad.images" :key="img.id" :href="apiBaseUrl+img.file_url">
                                    <img :alt="img.original_name" :src="apiBaseUrl+img.file_url" />
                                </a>
                            </lightgallery>
                        </div> -->
                        <div class="images">
                            <Galleria
                                :value="ad.images"
                                :responsiveOptions="responsiveOptions"
                                :numVisible="5"
                            >
                                <template #item="slotProps">
                                    <div class="gallery-image-wrapper">
                                        <Image
                                            :src="apiBaseUrl + slotProps.item.file_url"
                                            :alt="slotProps.item.original_name"
                                            imageClass="gallery-image"
                                            preview
                                        />
                                    </div>
                                </template>
                                <template #thumbnail="slotProps">
                                    <div class="gallery-thumbnail-wrapper">
                                        <img
                                            :src="apiBaseUrl + slotProps.item.file_url"
                                            :alt="slotProps.item.original_name"
                                            class="thumbnail-image"
                                        />
                                    </div>
                                </template>
                            </Galleria>
                        </div>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-6">
                        <div class="ad-data-list">
                            <div class="data-item">
                                <div class="data">{{ ad.category.t.name }}</div>
                                <div class="label">{{ t('ads.category') }}</div>
                            </div>
                            <div class="data-item">
                                <div class="data">{{ ad.place.t.name }}</div>
                                <div class="label">{{ t('ads.place') }}</div>
                            </div>
                            <div class="data-item" v-if="ad.phone_number">
                                <div class="contact">
                                    <div>{{ ad.t.first_name }}</div>
                                    <div>
                                        <i class="pi pi-phone mr-2"></i> {{ ad.phone_number }}
                                    </div>
                                </div>
                            </div>
                            <div class="data-item" v-if="ad.email" :title="ad.email">
                                <div class="contact">
                                    <i class="pi pi-fmail mr-2"></i> <span class="email">{{ ad.email }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="description">
                    <div class="description-title">
                        {{ t('ads.description') }}
                    </div>
                    <div class="description-content">
                        {{ ad.t.description }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="loading">
            {{ t('common.loading') }}...
        </div>
        <div v-else>
            {{ t('common.cantFindPage') }}...
        </div>
    </div>
</template>
<script setup>
import '@splidejs/vue-splide/css';
import { ref, reactive, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { usePlaceStore } from '@/stores/place';
import { useAdStore } from '@/stores/ad';
import { useI18n } from 'vue-i18n';
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { responsiveOptions } from '@/constants/gallerySettings'

import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

// If you are using scss you can skip the css imports below and use scss instead
import 'lightgallery/scss/lightgallery.scss';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const placeStore = usePlaceStore();
const adStore = useAdStore();
const { ad, loading } = storeToRefs(adStore);
const mainSplideRef = ref(null);
const thumbnailSplideRef = ref(null);
const timeout = ref(null);
const plugins = ref([lgThumbnail, lgZoom]);

const mainOptions = {
      type      : 'loop',
      perPage   : 1,
      perMove   : 1,
      gap       : '1rem',
      pagination: false,
      width     : '100vw',
      height    : '100vh',
    };

const thumbsOptions = {
      type        : 'slide',
      rewind      : true,
      gap         : '1rem',
      pagination  : false,
      fixedWidth  : 110,
      fixedHeight : 70,
      cover       : true,
      focus       : 'center',
      isNavigation: true,
      updateOnMove: true,
    };

onBeforeMount(() => {
    if (route.params.id) {
        adStore.getAd(route.params.id);
    }
});

onMounted( () => {
    /* setTimeout(()=>{
        const thumbsSplide = thumbnailSplideRef.value?.splide;
        mainSplideRef.value?.sync( thumbsSplide );
        
    },1000) */
    const interval = setInterval(() => {
      if (mainSplideRef.value) {
        const thumbsSplide = thumbnailSplideRef.value?.splide;
        mainSplideRef.value?.sync( thumbsSplide );
        clearInterval(interval)
      }
    }, 50)
});

onBeforeUnmount(() => {
    clearTimeout(timeout.value);
});

watch(locale, (newVal) => {
    adStore.getAd(route.params.id);
})

const images = computed(() => {
    if (ad) {
        return ad.images.map( img => apiBaseUrl.img.file_url);
    }
    return [];
})

</script>
<style scoped lang="scss">
/* @import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css'; */
.ad-container {
    padding: 16px 16px;
    display: flex;
    justify-content: center;
    @media screen and (min-width: 992px) {
        padding: 16px 64px;
    }
    .ad {
        flex: 1 1 auto;
        max-width: 1000px;
        .header {
            font-size: 25px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            .title {
                margin-bottom: 16px;
                max-width: 750px;
            }
            .price {
                max-height: 55px;
                font-size: 20px;
                padding: 16px;
                background-color: #6CDF8C;
                border-radius: 15px;
                border: 1px solid var(--color-black-soft);
                @media screen and (max-width: 992px) {
                    max-height: 75px;
                }
            }
        }
        .images {
            width: 440px;
            height: 100%;
            border: 1px solid var(--color-black-mute);
            :deep(.splide-img) {
                max-height: 330px;
                width: auto;
            }
            :deep(li.splide__slide) {
                text-align: center;
            }
        }
        .ad-data-list {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: end;
        }
        .data-item {
            margin-bottom: 16px;
            text-align: right;
            .data {
                margin-bottom: 4px;
            }
            .label {
                font-size: 10px;
                color: var(--text-secondary-color);
                text-transform: uppercase;
            }
        }
        .contact {
            font-size: 20px;
            background-color: var(--color-blue);
            color: var(--color-white);
            padding: 24px;
            text-align: center;
            height: 50px;
            width: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            i {
                color: var(--color-white) !important;
            }
            .email {
                font-size: 16px;
                text-wrap: wrap;
            }
        }
        .description-title {
            font-size: 18px;
            border-bottom: 1px solid var(--text-secondary-color);
            padding-bottom: 8px;
            margin-bottom: 24px;
        }
    }
    .full-screen-gallery {
        z-index: 99999999;
        position: absolute;
        height: 100vh;
        width: 100vw;
        top: -60px;
        overflow: hidden;
        background-color: grey;
    }
}
</style>
