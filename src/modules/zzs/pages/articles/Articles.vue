<template>
    <div class="articles p-1">
        <!-- list -->
        <div class="article-header mb-3 flex justify-content-between">
            <!-- <div>
                <img class="banner" src="/images/article_baner_2-1.png">
            </div> -->
            <TitleBanner title="Stručni tekstovi"></TitleBanner>
            <div>
                <InputText v-model="filters.global.value" @keyup="onFilter" class="mr-3 search-field" placeholder="Pretraži"/>
                <SplitButton label="" :model="sortItems" :icon="sortIcon" :loading="loading" @click="toggleSort" class="p-button-raised"></SplitButton>
            </div>
        </div>
        <div class="article-list grid">
            <div class="col-12" v-for="article in articles">
                <router-link :to="{ name: 'Article', params: { articleId: article.id }}" class="btn-link">
                    <Card class="article-card" :class="article.approved === 0 ? 'not-approved' : 'approved'">
                        <template #title>
                            <span v-html="article.title"></span>
                        </template>
                        <template #subtitle>
                            {{article.author}}
                        </template>
                        <template #content>
                            {{article.publish_date}}
                        </template>
                    </Card>
                </router-link>
            </div>
            <div class="col-12" v-if="articles && articlesTotal > 20">
                <Paginator :rows="20" :totalRecords="articlesTotal" @page="onPage($event)"></Paginator>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { FilterMatchMode } from 'primevue/api';
import { useArticleStore } from '@zzs/stores/article'
import { useAuthStore } from '@/stores/auth'
import TitleBanner from '@zzs/components/TitleBanner.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const articleStore = useArticleStore();
const authStore = useAuthStore();
const { articles, articlesTotal } = storeToRefs(articleStore)
const { user } = storeToRefs(authStore)
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const timer = ref(null);
const windowWidth = ref("");
const perPage = ref(20);
const sort = ref({
    sortField: "publish_date",
    sortOrder: -1,
});
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'title': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    'article_type_id': {value: route.params.articleTypeId ? route.params.articleTypeId : null, matchMode: FilterMatchMode.EQUALS}
});
const sortItems = [
    {
        label: "Naziv",
        command: () => {
            sort.value.sortField = "title";
            onSort(sort.value);
        }
    },
    {
        label: "Datum objavljivanja",
        command: () => {
            sort.value.sortField = "publish_date";
            onSort(sort.value);
        }
    },
];

const sortIcon = computed(() => { 
    if(sort.value.sortOrder == -1) return "pi pi-sort-amount-down";
    if(sort.value.sortOrder == 1) return "pi pi-sort-amount-up-alt";
    return "pi pi-sort-alt";
 });

//dom ready
onMounted(() => {
    windowWidth.value = window.innerWidth
    window.onresize = () => {
        windowWidth.value = window.innerWidth
    }
    appTracking.mixpanelTrack('Articles visited');
})

onBeforeMount( () => {
    const {search: globalSearch} = route.query;
    if (globalSearch) {
        filters.value.global.value = globalSearch;
    }
    articleStore.getArticles({sort: sort.value, pagination: pagination.value, filters: filters.value})
        .then((responseData) => { loading.value = false; });
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    articleStore.getArticles({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    articleStore.getArticles({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    router.replace({query: {search: filters.value.global.value}});
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        articleStore.getArticles({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const toggleSort = () => {
    if(sort.value.sortOrder == -1){
        sort.value.sortOrder = 1;
    } else {
        sort.value.sortOrder = -1;
    }
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        articleStore.getArticles({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

//fetch filtered data
watch(() => route.params.articleTypeId, (newVal, oldVal) => {
    filters.value.article_type_id.value = newVal;
    articleStore.getArticles({sort: sort.value, pagination: pagination.value, filters: filters.value});
})


</script>

<style lang="scss">
.articles {
    min-height: calc(100vh - 300px);
    max-width: 1200px;
    margin: 0 auto;
    .search-field {
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    .article-card {
        background-color: var(--color-zzs-card-background-primary);
        color: var(--color-zzs-card-text-primary);
    }
    .article-card:hover {
        cursor: pointer;
        background-color: var(--color-zzs-card-hover-background-primary);
        color: var(--color-zzs-card-hover-color-primary);
        .p-card-subtitle {
            color: var(--color-zzs-card-hover-color-primary);
        }
    }
    .banner {
        height: 60px;
    }
    .p-card {
        height: 100px;
        .p-card-title {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            font-size: 22px;
        }
        .p-card-content {
            padding: 0 !important;
        }
    }
    .not-approved {
        background-color: var(--color-not-approved);
    }
}
</style>