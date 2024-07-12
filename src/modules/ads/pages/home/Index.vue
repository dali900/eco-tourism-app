<template>
    <div class="ads-home">
        <!-- Header -->
        <div class="header">
            <div class="msg">{{t('ads.title')}}</div>
        </div>

        <div class="page-body">
            <div class="filters">
                <div class="grid">
                    <div class="field col-12 md:col-6 lg:col-4">
                        <Dropdown v-model="categoryDropdowns.values.rootCategory" 
                            class="w-full"
                            optionLabel="t_name"
                            :placeholder="t('ads.category')"
                            :options="rootCategories"
                            @change="onRootCategoryChange"
                        />
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4" v-if="categoryDropdowns.options.subCategory1 && categoryDropdowns.options.subCategory1.length">
                        <Dropdown v-model="categoryDropdowns.values.subCategory1" 
                            class="w-full"
                            optionLabel="t_name"
                            :placeholder="t('ads.category')"
                            :options="categoryDropdowns.options.subCategory1"
                            @change="onSubCategory1IdChange"
                        />
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4" v-if="categoryDropdowns.options.subCategory2 && categoryDropdowns.options.subCategory2.length">
                        <Dropdown v-model="categoryDropdowns.values.subCategory2" 
                            class="w-full"
                            optionLabel="t_name"
                            :placeholder="t('ads.category')"
                            :options="categoryDropdowns.options.subCategory2"
                            @change="onSubCategory2IdChange"
                        />
                    </div>
                </div>
            </div>
            <div class="results">
                <div class="ad-card">
                    <!-- <AdCard>
                        <template #image>
                            <img
                                v-if="props.attraction.thumbnail"
                                alt="content-img"
                                :src="apiBaseUrl + props.attraction.thumbnail.file_url"
                            />
                            <img v-else alt="content-img" src="/images/thumbnails/attraction.jpg" />
                        </template>
                        <template #title>
                            {{ props.attraction.t.name }}
                        </template>
                        <template #content>
                            {{ props.attraction.t.summary }}
                        </template>
                    </AdCard> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useNewsStore } from '@/stores/news';
import { useAdStore } from '@/stores/ad';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import AdCard from './adCard/AdCard.vue'

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const newsStore = useNewsStore();
const adStore = useAdStore();
const { ads, rootCategories, loading: adsLoading } = storeToRefs(adStore);
const selectedCategory = ref(null);
const categoryDropdowns = reactive({
    values: {//ids
        rootCategory: null,
        subCategory1: null,
        subCategory2: null,
    },
    options: {
        subCategory1: null,
        subCategory2: null,
    }
});

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
    category_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onBeforeMount(() => {
    adStore.getRootCategories()
        .then(responseData => {
            if(responseData.ancestorsAndSelf) {
                let i = 0;
                for (const filedName in categoryDropdowns.values) {
                    if (categoryDropdowns.values.hasOwnProperty(filedName)) {
                        const dropdownValue = categoryDropdowns.values[filedName];
                        const parent = responseData.ancestorsAndSelf[i];
                        if (parent) {
                            categoryDropdowns.values[filedName] = parent.id
                        }
                        i++;
                    }
                
                }
            }
        })
    adStore.getAds({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    })
});

watch(locale, (newVal) => {
    adStore.getRootCategories();
    adStore.getAds({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    })
})

//load and filter dropdown options - subtypes based on root type id
watch( () => categoryDropdowns.values.rootCategory, (newVal, oldVal) => {
    if(newVal)
    {
        adStore.getCategories({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => {
                categoryDropdowns.options.subCategory1 = responseData.results
            })
    }
});

//load and filter dropdown options - subtypes 
watch( () => categoryDropdowns.values.subCategory1, (newVal, oldVal) => {
    if(newVal)
    {
        adStore.getCategories({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => { 
                categoryDropdowns.options.subCategory2 = responseData.results
            })
    }
});

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

// on change 2. dropdown gets new options, and 3. dropdown options will be empty
const onRootCategoryChange = (event) => {
    console.log(event);
    categoryDropdowns.values.subCategory1 = null;
    categoryDropdowns.options.subCategory1 = null;
    filters.value.category_id.value = event.value.id;
}

const onSubCategory1IdChange = (event) => {
    categoryDropdowns.values.subCategory2 = null;
    categoryDropdowns.options.subCategory2 = null;
    filters.value.category_id.value = event.value.id;
}

const onSubCategory2IdChange = (event) => {
    filters.value.category_id.value = event.value.id;
}

</script>

<style scoped>
.ads-home {
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
    .filters {

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
        text-align: center;
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
