<template>
    <div class="news-home">
        <!-- Header -->
        <div class="header">
            <div class="msg">{{ t('ecoNews.headerMsg') }}</div>
        </div>

        <div class="page-body">
            <div class="items" v-if="rootCategories">
                <div v-for="(category, key) in rootCategories" class="item-row">
                    <div class="category" v-if="category.news.length">
                        <router-link :to="{ name: 'news-category', params: {id: category.id} }" class="text-link">
                            <div class="">
                                <Divider align="left" type="solid">
                                    <b class="category-title">{{ category.t.name }}</b>
                                </Divider> 
                            </div>
                        </router-link>
                        <div class="grid">
                            <!-- Naprviti posebno 3 kolone, staviti sadrzaj kolone u flex, 1. flex poravnjati u levo, 2. centar i 3. desno -->
                            <div class="col-12 md:col-6 lg:col-4" v-if="category.news[0]">
                                <div class="item">
                                    <CategoryItem :item="category.news[0]" />
                                </div>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4" v-if="category.news[1]">
                                <div class="item">
                                    <CategoryItem :item="category.news[1]" />
                                </div>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4" v-if="category.news[2]">
                                <div class="item">
                                    <CategoryItem :item="category.news[2]" />
                                </div>
                            </div>
                        </div>
                        <div class="btn-see-more" v-if="category.news.length >= 3">
                            <router-link :to="{ name: 'news-category', params: {id: category.id} }">
                                <Button class="btn-d">{{ t('common.more') }}</Button>
                            </router-link>
                        </div>
                    </div>
                </div>
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
import CategoryItem from './newsCategories/CategoryItem.vue'
import Divider from 'primevue/divider';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const newsStore = useNewsStore();
const { loading, rootCategories, news} = storeToRefs(newsStore);

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
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    subtitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    summary: { value: null, matchMode: FilterMatchMode.CONTAINS },
    text: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

watch(locale, (newVal) => {
    newsStore.getRootCategories({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
}, {immediate: true})

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if (perPage.value != event.rows) {
        pagination.value.perPage = event.rows;
    }
    router.replace({ query: { page: pagination.value.page } })
    newsStore.getNews({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
};
</script>

<style scoped>
.news-home {
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
            height: auto;
        }
        padding-top: 32px;
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
    .category-title {
        font-size: 26px;
        font-weight: 500;
        margin-bottom: 16px;
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
        .item-row {
            margin-bottom: 32px;
        }
        @media screen and (min-width: 992px) {
            .grid {
                > div:nth-child(2) {
                    display: flex;
                    justify-content: center;
                }
                > div:nth-child(3) {
                    display: flex;
                    justify-content: flex-end;
                }
            }
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
        .btn-see-more {
            display: flex;
            justify-content: right;
        }
        @media screen and (max-width: 768px) {
            .category-title {
                text-align: center;
            }
            .btn-see-more {
                display: flex;
                justify-content: center;
            }
            .grid {
                div {
                    display: flex;
                    justify-content: center;
                }
            }
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
