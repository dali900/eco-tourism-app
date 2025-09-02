<template>
    <div class="ad-container">
        <div v-if="ad" class="ad">
            <div class="full-screen-gallery">
                <Galleria v-if="ad.images && ad.images.length"
                    v-model:visible="displayBasic"
                    :value="ad.images"
                    :responsiveOptions="fullScreenOptions"
                    :circular="true"
                    :numVisible="5"
                    :fullScreen="true"
                    :showItemNavigators="true"
                >
                    <template #item="slotProps">
                        <div class="gallery-image-wrapper-full-screen">
                            <img
                                class="gallery-image-full-screen"
                                :src="apiBaseUrl + slotProps.item.file_url"
                                :alt="slotProps.item.original_name"
                                @click="openFullScreenGalleria"
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
                        <div class="images">
                            <Galleria v-if="ad.images && ad.images.length"
                                :value="ad.images"
                                :responsiveOptions="responsiveOptions"
                                :numVisible="5"
                                :circular="true"
                            >
                                <template #item="slotProps">
                                    <div class="gallery-image-wrapper">
                                        <img
                                            class="gallery-image"
                                            :src="apiBaseUrl + slotProps.item.file_url"
                                            :alt="slotProps.item.original_name"
                                            @click="openFullScreenGalleria"
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
                            <div v-else>
                                <img class="default-img" alt="content-img" src="/images/app-logo3-fade.png" />
                            </div>
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
                            <div class="data-item">
                                <div class="data">{{ ad.first_name }} {{ ad.last_name }}</div>
                                <div class="label">{{ t('ads.seller') }}</div>
                            </div>
                            <div class="data-item" v-if="ad.phone_number">
                                <div class="contact">
                                    <a :href="`tel:${ad.phone_number}`" style="color: inherit; text-decoration: none;">
                                        <div>
                                            <i class="pi pi-phone mr-2"></i> {{ ad.phone_number }}
                                        </div>
                                    </a>
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
                    <div class="description-content" v-html="ad.description"></div>
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
import { ref, reactive, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { usePlaceStore } from '@/stores/place';
import { useAdStore } from '@/stores/ad';
import { useI18n } from 'vue-i18n';
import Galleria from 'primevue/galleria';
import { responsiveOptions, fullScreenOptions } from '@/constants/gallerySettings'

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { t, locale } = useI18n();

const adStore = useAdStore();
const { ad, loading } = storeToRefs(adStore);
const mainSplideRef = ref(null);
const thumbnailSplideRef = ref(null);
const timeout = ref(null);
const fullScreenGalleria = ref(false);
const displayBasic = ref(false);

onBeforeMount(() => {
    if (route.params.id) {
        adStore.getAd(route.params.id);
    }
});

onMounted( () => {
    /* const interval = setInterval(() => {
      if (mainSplideRef.value) {
        const thumbsSplide = thumbnailSplideRef.value?.splide;
        mainSplideRef.value?.sync( thumbsSplide );
        clearInterval(interval)
      }
    }, 50) */
});

onBeforeUnmount(() => {
    clearTimeout(timeout.value);
});

watch(locale, (newVal) => {
    adStore.getAd(route.params.id);
})

const openFullScreenGalleria = () => {
    fullScreenGalleria.value = true;
    displayBasic.value = true;
};

</script>
<style scoped lang="scss">
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
            display: flex;
            justify-content: center;
            align-items: center;
            .default-img {
                height: 150px;
            }
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
        
    }
}
.gallery-image-wrapper {
    height: 480px;
    max-width: 640px;
    overflow: hidden;
    display: flex;
    align-items: center;
}
.gallery-image-wrapper-full-screen {
    height: auto;
    max-width: 1440px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}
:deep(.gallery-image) {
    width: 100%;
    max-height: 500px;
    /* height: auto; */
    display: block;
    cursor: pointer;
}
:deep(.gallery-image-full-screen) {
    width: auto;
    max-height: 768px;
    /* height: auto; */
    display: block;
}
.gallery-thumbnail-wrapper {
    max-width: 100px;
    overflow: hidden;
}
.thumbnail-image {
    max-height: 100px;
    width: auto;
}
@media screen and (max-width: 768px) {
    :deep(.gallery-image-full-screen) {
        width: 440px;
        height: auto;
        /* height: auto; */
        display: block;
    }
}
@media screen and (max-width: 1200px) {
    :deep(.gallery-image-full-screen) {
        max-width: 768px;
        height: auto;
        /* height: auto; */
        display: block;
    }
}
</style>
