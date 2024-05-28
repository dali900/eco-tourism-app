<template>
    <div class="places">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/place-page-header.jpg" />
            <div class="msg">{{ t('places.headerMsg') }}</div>
        </div>

        <div class="page-body " v-if="places">
            <div class="items">
                <div class="grid item"  v-for="(item, key) in places">
                    <div class="col-12 md:col-6 lg:col-6">
                        <router-link :to="{ name: 'place', params: { id: item.id } }" class="text-link">
                            <div class="img-wrapper" :key="key">
                                <img
                                    v-if="item.thumbnail"
                                    alt="content-img"
                                    :src="apiBaseUrl + item.thumbnail.file_url"
                                />
                                <img v-else alt="content-img" src="/images/thumbnails/place.jpg" />
                            </div>
                        </router-link>
                    </div>
                    <div class="col-12 md:col-6 lg:col-6">
                        <div class="">
                            <router-link :to="{ name: 'place', params: { id: item.id } }" class="text-link">
                                <div class="name">{{ item.name }}</div>
                                <div class="text">{{ item.description }}</div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="places && placesTotal > perPage">
                <Paginator :first="(pagination.page*perPage)-1" :rows="perPage" :totalRecords="placesTotal" @page="onPage($event)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { usePlaceStore } from '@/stores/place';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const placeStore = usePlaceStore();
const { places, loading, placesTotal } = storeToRefs(placeStore);

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
    placeStore.getAll({
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
    placeStore.getAll({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
};
</script>

<style scoped>
.places {
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
            top: -280px;
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
    .place-content {
        margin-bottom: 64px;
    }
    .items {
        .item {
            display: flex;
            justify-content: center;
            > div:nth-child(1) {
                display: flex;
                justify-content: right;
                padding-right: 16px;
            }
            > div:nth-child(2) {
                display: flex;
                justify-content: left;
                padding-left: 16px;
            }
            a {
                text-decoration: none;
                color: inherit;
            }
            .img-wrapper {
                max-height: 270px;
                overflow: hidden;
                img {
                    max-width: 360px;
                    height: auto;
                }
            }
            .name {
                font-size: 30px;
                margin-bottom: 16px;
            }
            .text {
                max-width: 500px;
            }
            margin-bottom: 16px;
        }
        @media screen and (max-width: 768px) {
            .item {
                > div:nth-child(1) {
                    justify-content: center;
                    padding-bottom: 0;
                }
                > div:nth-child(2) {
                    justify-content: center;
                    padding-top: 0;
                }
                .name {
                    text-align: center;
                    margin-bottom: 8px;
                }
                .text {
                    max-width: 390px;
                    margin-bottom: 64px;
                }
            }
            /* .category-title {
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
            } */
        }
        margin-bottom: 32px;
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
