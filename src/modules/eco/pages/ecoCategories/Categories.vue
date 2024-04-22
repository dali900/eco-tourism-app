<template>
    <div class="attractions">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/attraction-page-header.jpeg" />
            <div class="msg">{{ t('ecoCategories.headerMsg') }}</div>
        </div>

        <div class="page-body">
            <div class="items" v-if="attractionRootCategories">
                <div v-for="(category, key) in attractionRootCategories" class="item-row">
                    <router-link :to="{ name: 'eco-category', params: {id: category.id} }" class="link-text">
                        <div class="category-title">
                            {{ category.name }}
                        </div>
                    </router-link>
                    <div class="grid">
                        <!-- Naprviti posebno 3 kolone, staviti sadrzaj kolone u flex, 1. flex poravnjati u levo, 2. centar i 3. desno -->
                        <div class="col-12 md:col-6 lg:col-4" v-for="(attraction) in category.attractions">
                            <div class="item">
                                <router-link :to="{ name: 'attraction', params: { id: attraction.id } }" class="link-text">
                                    <div class="img-wrapper" :key="attraction.id">
                                        <img
                                            v-if="attraction.default_image"
                                            alt="content-img"
                                            :src="apiBaseUrl + attraction.default_image.file_url"
                                        />
                                        <img v-else alt="content-img" src="/images/thumbnails/t1.png" />
                                    </div>
                                    <div class="text">{{ attraction.summary }}</div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="flex-justify-right">
                        <router-link :to="{ name: 'eco-category', params: {id: category.id} }">
                            <Button class="btn-d">Vise</Button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAttractionStore } from '@/stores/attraction';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const attractionStore = useAttractionStore();
const { loading, attractionRootCategories, attra } = storeToRefs(attractionStore);

const perPage = ref(10);
const sort = ref({
    sortField: 'sortField' in route.query ? route.query.sortField : 'id',
    sortOrder: 'sortOrder' in route.query ? route.query.sortOrder : -1,
});
const pagination = ref({
    page: 'page' in route.query ? parseInt(route.query.page): 1,
    perPage: perPage.value,
});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    content: { value: null, matchMode: FilterMatchMode.CONTAINS },
    summary: { value: null, matchMode: FilterMatchMode.CONTAINS },
    approved: { value: null, matchMode: FilterMatchMode.EQUALS },
});

onBeforeMount(() => {
    attractionStore.getAttractionRootCategories({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
});

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if (perPage.value != event.rows) {
        pagination.value.perPage = event.rows;
    }
    router.replace({ query: { page: pagination.value.page } })
    attractionStore.getAttractions({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
};
</script>

<style scoped>
.attractions {
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
    .category-title {
        font-size: 30px;
        margin-bottom: 16px;
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
    .attraction-content {
        margin-bottom: 64px;
    }
    .items {
        .item-row {
            margin-bottom: 32px;
        }
        .item {
            .img-wrapper {
                height: 200px;
                overflow: hidden;
                margin-bottom: 16px;
                img {
                    max-width: 360px;
                    height: auto;
                }
            }
            .text {
                max-width: 370px;
            }
            margin-bottom: 16px;
        }
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
