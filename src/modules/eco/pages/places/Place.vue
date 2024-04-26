<template>
    <div class="place">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/place-page-header.jpg">
            <div class="msg" v-if="place">{{ place.name }}</div>
        </div>

        <div class="page-body" v-if="place">
            <div class="place-content" v-html="placeContent"></div>
            
            <!-- <div>
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
            </div> -->
        </div>

    </div>
</template>

<script setup>
import {
    ref,
    unref,
    reactive,
    computed,
    watch,
    onMounted,
    onUnmounted,
    onBeforeMount,
} from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { usePlaceStore } from "@/stores/place";
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { useI18n } from "vue-i18n";

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { t } = useI18n();

const placeStore = usePlaceStore();
const { place, loading } =
    storeToRefs(placeStore);

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
        placeStore.getPlace(route.params.id);
    }
});

const placeContent = computed( () => {
    console.log(place);
    if (!place.value || !place.value.description) return null;
    return place.value.description.replace(/\n/g, "<br />");
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
        padding: 0 64px;
    }
    .title {
        font-size: 40px;
        font-weight: 600;
    }
    .place-content {
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
    height: auto;
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
