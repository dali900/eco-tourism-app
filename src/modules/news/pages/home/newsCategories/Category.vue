<template>
    <div class="category">
        <!-- Header imag -->
        <div class="header">
            <div class="msg" v-if="category">{{ category.name }}</div>
        </div>

        <div class="page-body">
            <div class="items grid" v-if="news">
                <div class="col-12 md:col-6 lg:col-4 flex-justify-center" v-for="(item, key) in news">
                    <div class="item">
                        <CategoryItem :item="item" />
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="news && newsTotal > perPage">
                <Paginator :first="(pagination.page*perPage)-1" :rows="perPage" :totalRecords="newsTotal" @page="onPage($event)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useNewsStore } from '@/stores/news';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import AppCard from '@/components/appCard/AppCard.vue';
import CategoryItem from './CategoryItem.vue'

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const newsStore = useNewsStore();
const { news, category, loading, newsTotal } = storeToRefs(newsStore);

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
});

onBeforeMount(() => {
    if (route.params.id) {
        newsStore.getCategoryNews({
            sort: sort.value,
            pagination: pagination.value,
            filters: filters.value,
        }, route.params.id);
    }
});

watch(
    () => route.params.id,
    async newId => {
        newsStore.getCategoryNews({
            sort: sort.value,
            pagination: pagination.value,
            filters: filters.value,
        }, route.params.id);
    }
)

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if (perPage.value != event.rows) {
        pagination.value.perPage = event.rows;
    }
    router.replace({ query: { page: pagination.value.page } })
    newsStore.getCategoryNews({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    }, route.params.id);
};
</script>

<style scoped>
.category {
    .header {
        position: relative;
        max-width: var(--container-width);
        overflow: hidden;
        display: flex;
        justify-content: center;
        .msg {
            z-index: 1;
            align-self: center;
            font-size: 40px;
            border-bottom: 1px solid var(--text-secondary-color);
            padding: 16px;
        }
        padding-top: 16px;
        margin-bottom: 64px;
    }
    .title {
        display: flex;
        justify-content: center;
        div {
            border-bottom: 1px solid var(--text-secondary-color);
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
        margin-bottom: 64px;
    }
    .items {
        .item {
            display: flex;
            a {
                text-decoration: none;
                color: inherit;
            }
            .img-wrapper {
                height: 200px;
                overflow: hidden;
                margin-bottom: 16px;
                img {
                    max-width: 360px;
                    height: auto;
                }
            }
            .news-title {
                font-size: var(--font-size-content);
                font-weight: 600;
                margin-top: 4px;
                margin-bottom: 8px;
                text-align: left;
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
