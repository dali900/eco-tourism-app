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
                        <FloatLabel class="mb-2">
                            <Dropdown v-model="categoryDropdowns.values.rootCategory" 
                                id="rootCategory"
                                class="w-full"
                                showClear
                                optionValue="id"
                                optionLabel="t_name"
                                :options="rootCategories"
                                @change="onRootCategoryChange"
                            />
                            <label for="rootCategory">{{ t('ads.category') }}</label>
                        </FloatLabel>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4">
                        <FloatLabel class="mb-2">
                            <Dropdown v-model="categoryDropdowns.values.subCategory1" 
                                id="subCategory1"
                                class="w-full"
                                showClear
                                optionValue="id"
                                optionLabel="t_name"
                                :disabled="!categoryDropdowns.options.subCategory1 || !categoryDropdowns.options.subCategory1.length"
                                :options="categoryDropdowns.options.subCategory1"
                                @change="onSubCategory1IdChange"
                            />
                            <label for="subCategory1">{{ t('ads.subCategory') }}</label>
                        </FloatLabel>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4" v-if="showDropdownSubcategory2">
                        <FloatLabel class="mb-2">
                            <Dropdown v-model="categoryDropdowns.values.subCategory2" 
                                id="subCategory2"
                                class="w-full"
                                showClear
                                optionValue="id"
                                optionLabel="t_name"
                                :disabled="!categoryDropdowns.options.subCategory2 || !categoryDropdowns.options.subCategory2.length"
                                :options="categoryDropdowns.options.subCategory2"
                                @change="onSubCategory2IdChange"
                            />
                            <label for="subCategory2">{{ t('ads.subCategory') }}</label>
                        </FloatLabel>
                    </div>
                </div>
                <div class="grid">
                    <div class="field col-12 md:col-6 lg:col-4">
                        <FloatLabel class="mb-2">
                            <InputNumber 
                                v-model="filters.min_price.value" 
                                :useGrouping="false"
                                inputId="min_price" 
                                class="w-full"
                                showButtons
                                :min="0"
                                @keyup.enter="search"
                            />
                            <label for="min_price">{{ t('ads.minPrice') }}</label>
                        </FloatLabel>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4">
                        <FloatLabel class="mb-2">
                            <InputNumber 
                                v-model="filters.max_price.value" 
                                :useGrouping="false"
                                inputId="max_price" 
                                class="w-full"
                                showButtons
                                :min="0"
                                @keyup.enter="search"
                            />
                            <label for="max_price">{{ t('ads.maxPrice') }}</label>
                        </FloatLabel>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4">
                        <FloatLabel class="mb-2">
                            <Dropdown v-model="filters.place_id.value" 
                                id="places"
                                class="w-full"
                                showClear
                                optionValue="id"
                                optionLabel="t_name"
                                :disabled="!places || !places.length"
                                :options="places"
                                @change="onSubCategory2IdChange"
                            />
                            <label for="places">{{ t('ads.place') }}</label>
                        </FloatLabel>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-4">
                        <div>
                            <Button 
                                class="btn-d w-full" 
                                icon="pi pi-search"
                                :loading="adsLoading"
                                @click="search"
                            >
                                {{ t('ads.search') }} <i class="pl-2 pi pi-search"></i>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
            <div class="results">
                <div v-if="ads && ads.length > 0">
                    <div class="ad-card mb-4" v-for="ad in ads">
                        <router-link :to="{ name: 'ad', params: { id: ad.id } }" class="text-link">
                            <AdCard :ad="ad"/>
                        </router-link>
                    </div>
                </div>
                <div v-else-if="adsLoading" class="mb-3">
                    {{ t('common.loading') }}...
                </div>
                <div v-else class="mb-3">
                    {{ t('ads.noResults') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { usePlaceStore } from '@/stores/place';
import { useAdStore } from '@/stores/ad';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import FloatLabel from 'primevue/floatlabel';
import AdCard from './adCard/AdCard.vue'

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const placeStore = usePlaceStore();
const adStore = useAdStore();
const { ads, rootCategories, adsLoading } = storeToRefs(adStore);
const places = ref(null);
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
    category_id: { value: Number(route.query['category-id']) || null, matchMode: FilterMatchMode.EQUALS },
    place_id: { value: Number(route.query['place-id']) || null, matchMode: FilterMatchMode.EQUALS },
    min_price: { value: Number(route.query['min-price']) || null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    max_price: { value: Number(route.query['max-price']) || null, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL_TO },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onBeforeMount(() => {
    if (route.query['category-id']) {
        adStore.getCatagory(route.query['category-id']).then(responseData => {
            setCategoryValues(responseData);
        });
    }
    adStore.getRootCategories()
        .then(responseData => {
            /* if(responseData.ancestorsAndSelf) {
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
            } */
        })
    adStore.getAds({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    })
    placeStore.getDropdownOptions().then(responseData => {
        places.value = responseData;
    })
});

//translation
watch(locale, (newVal) => {
    //get root category translations
    adStore.getRootCategories();
    //get ads translations
    adStore.getAds({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
    //get places translations
    placeStore.getDropdownOptions().then(responseData => {
        places.value = responseData;
    });
    //get subcategory1 translations
    if(categoryDropdowns.values.subCategory1)
    {
        adStore.getCategories({filters: {"parent_id": {value: categoryDropdowns.values.rootCategory, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => { 
                console.log(responseData);
                categoryDropdowns.options.subCategory1 = responseData.results
            })
    }
    //get subcategory2 translations
    if(categoryDropdowns.values.subCategory2)
    {
        adStore.getCategories({filters: {"parent_id": {value: categoryDropdowns.values.subCategory1, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => { 
                console.log(responseData);
                categoryDropdowns.options.subCategory2 = responseData.results
            })
    }
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

const showDropdownSubcategory2 = computed(() => {
    if (categoryDropdowns.options.subCategory1 && categoryDropdowns.options.subCategory1.length && categoryDropdowns.values.subCategory1) {
        return true;
    }
    return false;
});

const applyFilters = () => {
  router.push({
    path: '/ads/',
    query: {
      "category-id": filters.value.category_id.value || "",
      "place-id": filters.value.place_id.value || "",
      "min-price": filters.value.min_price.value || "",
      "max-price": filters.value.max_price.value || "",
    }
  });
};

const setCategoryValues = (data) => {
    if(data && data.ancestorsAndSelf) {
        let i = 0;
        for (const filedName in categoryDropdowns.values) {
            if (categoryDropdowns.values.hasOwnProperty(filedName)) {
                const dropdownValue = categoryDropdowns.values[filedName];
                const parent = data.ancestorsAndSelf[i];
                if (parent) {
                    categoryDropdowns.values[filedName] = parent.id;
                }
                i++;
            }
        
        }
    }
}

const search = () => {
    applyFilters();
    adStore.getAds({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if (perPage.value != event.rows) {
        pagination.value.perPage = event.rows;
    }
    router.replace({ query: { page: pagination.value.page } })
    adStore.getAds({
        sort: sort.value,
        pagination: pagination.value,
        filters: filters.value,
    });
};

// on change 2. dropdown gets new options, and 3. dropdown options will be empty
const onRootCategoryChange = (event) => {
    categoryDropdowns.values.subCategory1 = null;
    categoryDropdowns.options.subCategory1 = null;
    filters.value.category_id.value = event.value;
}

const onSubCategory1IdChange = (event) => {
    categoryDropdowns.values.subCategory2 = null;
    categoryDropdowns.options.subCategory2 = null;
    filters.value.category_id.value = event.value;
}

const onSubCategory2IdChange = (event) => {
    filters.value.category_id.value = event.value;
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
        border: 1px solid var(--text-light-color);
        padding: 32px 16px 16px 16px;
        margin-bottom: 32px;
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
    :deep(.p-inputnumber-button-group button){
        color: var(--color-black-soft);
        background: transparent;
        border: 1px solid transparent;
    }
    :deep(.p-inputnumber-button-group){
        position: absolute;
        right: 1px;
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
