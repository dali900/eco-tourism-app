<template>
    <div class="place">
        <!-- Header imag -->
        <!-- <div class="header-img">
            <img alt="header-img" src="/images/place-page-header.jpg">
            <div class="msg" v-if="place">{{ place.name }}</div>
        </div> -->

        <div class="page-body" v-if="place">
            <div class="title">
                <div>
                    {{ place.t.name }}
                </div>
            </div>
            <div class="resource-content" v-html="placeContent"></div>           
            <div class="galleria">
                <div class="flex-centered-item">
                    <Galleria
                        :value="place.images"
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
            <div class="attractions" v-if="place.attractions">
                <div class="section-subtitle">
                    {{ t('places.attractions') }}:
                </div>
                <div class="grid">
                    <div class="col-12 md:col-6 lg:col-4 flex-justify-center" v-for="attraction in place.attractions">
                        <div class="item">
                            <AttractionCard :attraction="attraction" />
                        </div>
                    </div>
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
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { usePlaceStore } from "@/stores/place";
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { useI18n } from "vue-i18n";
import AttractionCard from '../ecoCategories/AttractionCard.vue'
import { responsiveOptions } from '@/constants/gallerySettings'

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { locale, t } = useI18n();

const placeStore = usePlaceStore();
const { place, loading } =
    storeToRefs(placeStore);

//onBeforeMount
watch(locale, (newVal) => {
    placeStore.get(route.params.id);
}, {immediate: true})

const placeContent = computed( () => {
    if (!place.value || !place.value.t || !place.value.t.description) return null;
    return place.value.t.description.replace(/\n/g, "<br />");
})
</script>

<style scoped >
.place {
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
    .page-body {
        padding: 16px 16px;
        .title {
            padding-top: 32px;
            display: flex;
            justify-content: center;
            font-size: 40px;
            font-weight: 600;
            div {
                border-bottom: 1px solid var(--text-secondary-color);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .resource-content {
            margin-bottom: 64px;
        }
    }
    @media screen and (min-width: 992px) {
        .page-body {
            padding: 0 64px;
        }
    }
    .galleria {
        margin-bottom: 64px;
    }
    .attractions {
        .section-subtitle {
            font-weight: 600;
            margin-bottom: 16px;
        }
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
