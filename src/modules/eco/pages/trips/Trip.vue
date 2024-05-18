<template>
    <div class="trip">
        <!-- Header -->
        <div class="header">
            <img alt="header-img" src="/images/attraction-page-header.jpeg">
            <div class="msg">{{ t('trip.headerMsg') }}</div>
        </div>

        <div class="page-body" v-if="trip">
            <div class="title">
                <div>
                    {{ trip.title }}
                </div>
            </div>
            <div class="content" v-html="trip.text"></div>
            
            <div class="section" v-if="trip.place">
                {{ t('trip.place') }}: 
                <RouterLink :to="{name: 'place', params: {id: trip.place.id}}" class="app-link">
                    {{ trip.place.name }}
                </RouterLink>
            </div>
            
            <div class="section attractions grid" v-if="trip.attractions && trip.attractions.length">
                <div class="col-12 subtitle">{{ t('trip.attractions') }}:</div>
                <div class="col-12 md:col-6 lg:col-4" v-for="attraction in trip.attractions">
                    <router-link :to="{ name: 'attraction', params: { id: attraction.id } }" class="text-link">
                        <AppCard>
                            <template #image>
                                <img
                                    v-if="attraction.thumbnail_image"
                                    alt="content-img"
                                    :src="apiBaseUrl + attraction.thumbnail_image.file_url"
                                />
                                <img v-else alt="content-img" src="/images/thumbnails/t1.png" />
                            </template>
                            <template #content>
                                {{ attraction.summary }}
                            </template>
                        </AppCard>
                    </router-link>
                </div>
            </div>

            <div class="galleria">
                <Galleria
                    :value="trip.images"
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

    </div>
</template>

<script setup>
import {
    ref,
    computed,
    onBeforeMount,
} from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useTripStore } from "@/stores/trip";
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { useI18n } from "vue-i18n";
import AppCard from '@/components/appCard/AppCard.vue';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { t } = useI18n();

const tripStore = useTripStore();
const { trip, loading } = storeToRefs(tripStore);

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

onBeforeMount(() => {
    if (route.params.id) {
        tripStore.get(route.params.id);
    }
});


</script>

<style scoped >
.trip {
    .header {
        position: relative;
        max-width: var(--container-width);
        height: 155px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        .msg {
            z-index: 1;
            align-self: center;
            color: var(--color-white);
            font-size: 40px;
            height: auto;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        }
        img {
            top: -190px;
            right: -100px;
            position: absolute;
        }
        margin-bottom: 64px;
    }
    .title {
        display: flex;
        justify-content: center;
        font-size: 40px;
        font-weight: 600;
        div {
            border-bottom: 2px solid var(--color-black);
            padding: 16px;
        }
        margin-bottom: 64px;
    }
    .subtitle {
        font-size: 18px;
        font-weight: 600;
    }
    .separator {
        background-color: var(--color-white);
        height: 14px;
        width: 100%;
    }
    .page-body {
        padding: 0 64px;
    }
    .content {
        margin-bottom: 32px;
    }
    .section {
        margin-bottom: 64px;
    }
}
.gallery-image-wrapper {
    height: 500px;
    overflow: hidden;
    display: flex;
    align-items: center;
}
:deep(.gallery-image) {
    width: 100%;
    max-height: 500px;
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
</style>
