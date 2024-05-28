<template>
    <div class="attraction">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/attraction-page-header.jpeg">
            <div class="msg">{{ t('attraction.headerMsg') }}</div>
        </div>

        <div class="page-body" v-if="attraction">
            <div class="title">
                <div>
                    {{ attraction.name }}
                </div>
            </div>
            <div class="attraction-content" v-html="attractionContent"></div>
            
            <div class="place" v-if="attraction.place">
                {{ t('attraction.place') }}: 
                <RouterLink :to="{name: 'place', params: {id: attraction.place.id}}" class="app-link">
                    {{ attraction.place.name }}
                </RouterLink>
            </div>

            <div class="galleria">
                <Galleria
                    :value="attraction.images"
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
import { useAttractionStore } from "@/stores/attraction";
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { useI18n } from "vue-i18n";
import { responsiveOptions } from '@/constants/gallerySettings'

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { t } = useI18n();

const attractionStore = useAttractionStore();
const { attraction, loading } =
    storeToRefs(attractionStore);

onBeforeMount(() => {
    if (route.params.id) {
        attractionStore.getAttraction(route.params.id);
    }
});

const attractionContent = computed( () => {
    if (!attraction.value || !attraction.value.content) return null;
    return attraction.value.content.replace(/\n/g, "<br />");
})
</script>

<style scoped >
.attraction {
    .header-img {
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
        div {
            border-bottom: 2px solid var(--color-black);
            padding: 16px;
        }
        margin-bottom: 64px;
    }
    .separator {
        background-color: var(--color-white);
        height: 14px;
        width: 100%;
    }
    .page-body {
        padding: 0 16px;
    }
    @media screen and (min-width: 992px) {
        .page-body {
            padding: 0 64px;
        }
    }
    .title {
        font-size: 40px;
        font-weight: 600;
    }
    .attraction-content {
        margin-bottom: 32px;
    }
    .place {
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
