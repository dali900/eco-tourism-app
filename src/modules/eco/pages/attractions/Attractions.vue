<template>
    <div class="attractions">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/attraction-page-header.jpeg" />
            <div class="msg">{{ t('attractions.headerMsg') }}</div>
        </div>

        <div class="page-body">
            <div class="items grid" v-if="attractions">
                <div class="col-12 md:col-6 lg:col-4" v-for="(item, key) in attractions">
                    <div class="item">
                        <router-link :to="{ name: 'attraction', params: { id: item.id } }" class="text-link">
                            <div class="img-wrapper" :key="key">
                                <img
                                    v-if="item.default_image"
                                    alt="content-img"
                                    :src="apiBaseUrl + item.default_image.file_url"
                                />
                                <img v-else alt="content-img" src="/images/thumbnails/t1.png" />
                            </div>
                            <div class="summary">{{ item.summary }}</div>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="attractions && attractionsTotal > 20">
                <Paginator :first="(pagination.page*perPage)-1" :rows="perPage" :totalRecords="attractionsTotal" @page="onPage($event)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useAttractionStore } from '@/stores/attraction';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const attractionStore = useAttractionStore();
const { attractions, loading, attractionsTotal } = storeToRefs(attractionStore);

const perPage = ref(20);
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
    category_id: {value: null, matchMode: FilterMatchMode.EQUALS},
});

onBeforeMount(() => {
    attractionStore.getAttractions({
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
        .item {
            display: flex;
            justify-content: center;
            a {
                text-decoration: none;
                color: inherit;
            }
            .img-wrapper {
                height: 200px;
                overflow: hidden;
                img {
                    max-width: 360px;
                    height: auto;
                }
            }
            .text {
                max-width: 360px;
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
