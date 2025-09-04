<template>
    <div class="attraction">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/attraction-page-header.jpeg">
            <div class="msg" v-if="attraction">{{ attraction.category.t.name }}</div>
        </div>

        <div class="page-body" v-if="attraction">
            <div class="title">
                <div>
                    {{ attraction.t.name }}
                </div>
            </div>
            <div class="attraction-content" v-html="attractionContent"></div>
            
            <div class="place" v-if="attraction.place">
                {{ t('attraction.place') }}: 
                <RouterLink :to="{name: 'place', params: {id: attraction.place.id}}" class="app-link">
                    {{ attraction.place.t.name }}
                </RouterLink>
            </div>

            <div class="phone-number" v-if="attraction.phone_number">
                <a :href="`tel:${attraction.phone_number}`" style="color: inherit; text-decoration: none;">
                    <Button
                        type="button"
                        class="btn-d"
                        :label="attraction.phone_number_formated"
                        icon="pi pi-phone"
                    />
                </a>
            </div>
            
            <div class="galleria">
                <div class="flex-centered-item">
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

    </div>
</template>

<script setup>
import {
    ref,
    watch,
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
const { t, locale } = useI18n();

const attractionStore = useAttractionStore();
const { attraction, loading } =
    storeToRefs(attractionStore);

onBeforeMount(() => {
    if (route.params.id) {
        attractionStore.getAttraction(route.params.id);
    }
});

watch(locale, (newVal) => {
    attractionStore.getAttraction(route.params.id);
})

const attractionContent = computed( () => {
    if (!attraction.value || !attraction.value.t.content) return null;
    return attraction.value.t.content.replace(/\n/g, "<br />");
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
        margin-bottom: 32px;
    }
    .title {
        display: flex;
        justify-content: center;
        div {
            border-bottom: 1px solid var(--text-secondary-color);
            padding: 16px;
            font-size: 32px;
            word-break: break-word;
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
        .title {
            div {
                font-size: 40px;
            }
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
        margin-bottom: 16px;
    }
    .phone-number {
        margin-bottom: 32px;
    }
}
.gallery-image-wrapper {
    height: 480px;
    max-width: 640px;
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
