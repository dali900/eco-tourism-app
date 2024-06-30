<template>
    <div class="trips">
        <!-- Header -->
        <div class="header">
            <div class="msg">{{ t('trips.headerMsg') }}</div>
        </div>

        <div class="page-body">
            <div class="items grid" v-if="trips">
                <div class="col-12 md:col-6 lg:col-4" v-for="(item, key) in trips">
                    <div class="item">
                        <router-link :to="{ name: 'trip', params: { id: item.id } }" class="text-link">
                            <AppCard>
                                <template #image>
                                    <img
                                        v-if="item.thumbnail"
                                        alt="content-img"
                                        :src="apiBaseUrl + item.thumbnail.file_url"
                                    />
                                    <img v-else alt="content-img" src="/images/thumbnails/tours.jpg" />
                                </template>
                                <template #title>
                                    {{ item.t.title }}
                                </template>
                                <template #content>
                                    <div>
                                        {{ item.t.summary }}
                                    </div>
                                </template>
                            </AppCard>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="trips && tripsTotal > 20">
                <Paginator :first="(pagination.page*perPage)-1" :rows="perPage" :totalRecords="tripsTotal" @page="onPage($event)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useTripStore } from '@/stores/trip';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import AppCard from '@/components/appCard/AppCard.vue';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const { locale, t } = useI18n();

const tripStore = useTripStore();
const { trips, loading, tripsTotal } = storeToRefs(tripStore);

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
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    text: { value: null, matchMode: FilterMatchMode.CONTAINS },
    summary: { value: null, matchMode: FilterMatchMode.CONTAINS },
    approved: { value: null, matchMode: FilterMatchMode.EQUALS },
    //attraction_id: {value: null, matchMode: FilterMatchMode.EQUALS},
});

watch(locale, (newVal) => {
    tripStore.getAll({
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
    tripStore.getAll({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
};
</script>

<style scoped>
.trips {
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
