<template>
    <div class="news-overview">
        <!-- Header -->
        <div class="news-header">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems">
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a :href="href" v-bind="props.action" @click="navigate">
                            <span :class="[item.icon, 'text-color']" />
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                        <span class="text-color">{{ item.label }}</span>
                    </a>
                </template>
            </Breadcrumb>
        </div>

        <div class="page-body" v-if="one_news">
            <div class="title">
                <div>
                    {{ one_news.title }}
                </div>
            </div>
            <div class="news-content" v-html="newsContent"></div>
            <div class="news-footer">               
                <small>
                    <i class="pi pi-clock"></i> 
                    {{ one_news.publish_date_formated }}
                </small>
            </div>
            <div class="galleria">
                <div class="flex-centered-item">
                    <Galleria
                        :value="one_news.images"
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
import { useNewsStore } from "@/stores/news";
import Breadcrumb from 'primevue/breadcrumb';
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { useI18n } from "vue-i18n";
import { responsiveOptions } from '@/constants/gallerySettings'

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { t } = useI18n();

const newsStore = useNewsStore();
const { one_news, newsCategories, loading } = storeToRefs(newsStore);

const breadcrumbHome = ref({
    icon: 'pi pi-home',
    route: '/news'
});
const breadcrumbItems = ref([]);

onBeforeMount(() => {
    if (route.params.id) {
        newsStore.getOneNews(route.params.id);
    }
});

watch( newsCategories, (newVal, oldVal) => {
    if(newVal && newVal.length)
    {
        console.log(newVal);
        const bradcrumbArray = newVal[0].map((c) => { return {label: c.name, route: '/news/news-category/'+c.id} });
        breadcrumbItems.value = bradcrumbArray.reverse();
    }
});

const newsContent = computed( () => {
    if (!one_news.value || !one_news.value.text) return null;
    return one_news.value.text.replace(/\n/g, "<br />");
})
</script>

<style scoped >
.news-overview {
    .news-header {
        position: relative;
        max-width: var(--container-width);
        .msg {
            z-index: 1;
            align-self: center;
            color: var(--color-white);
            font-size: 40px;
            height: auto;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        }
        /* margin-bottom: 64px; */
    }
    :deep(.p-breadcrumb){
        border: none;
    }
    .title {
        display: flex;
        justify-content: center;
        div {
            border-bottom: 2px solid var(--text-primary-color);
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
    .news-content {
        margin-bottom: 16px;
    }
    .news-footer {
        color: var(--text-light-color);
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
