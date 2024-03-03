<template>
    <div class="documents p-1">
        <div v-if="documents">
            <!-- list -->
            <div class="document-header mb-3 flex justify-content-between">
                <TitleBanner title="Dokumentacija"></TitleBanner>
                <div>
                    <InputText v-model="filters.global.value" @keyup="onFilter" class="mr-3 search-field" placeholder="Pretraži"/>
                    <SplitButton label="" :model="sortItems" :icon="sortIcon" :loading="loading" @click="toggleSort" class="p-button-raised"></SplitButton>
                </div>
            </div>
            <div class="document-list grid">
                <div class="col-12" v-for="document in documents">
                    <router-link :to="{ name: 'Document', params: { documentId: document.id }}" class="btn-link">
                        <Card class="document-card" :class="document.approved === 0 ? 'not-approved' : 'approved'">
                            <template #title>
                                <span v-html="document.title"></span>
                            </template>
                            <template #subtitle>
                                <span v-if="document.document_type">{{document.document_type.name}}</span>
                            </template>
                            <template #content>
                                <!-- {{document.publish_date}} -->
                            </template>
                        </Card>
                    </router-link>
                </div>
                <div class="col-12" v-if="documents && documentsTotal > 20">
                    <Paginator :rows="20" :totalRecords="documentsTotal" @page="onPage($event)"></Paginator>
                </div>
            </div>
        </div>
        <div v-else>
            Nema podataka.
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { FilterMatchMode } from 'primevue/api';
import { useDocumentStore } from '@bzr/stores/document'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import TitleBanner from '@bzr/components/TitleBanner.vue'
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const documentStore = useDocumentStore();
const authStore = useAuthStore();
const { documents, documentsTotal, loading } = storeToRefs(documentStore)
const { user } = storeToRefs(authStore)
const route = useRoute();
const router = useRouter();

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
    'document_type_id': {value: route.params.documentTypeId ? route.params.documentTypeId : null, matchMode: FilterMatchMode.EQUALS}
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
        label: "Datum postavljanja",
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

//fetch filtered data
watch(() => route.params.documentTypeId, (newVal, oldVal) => {
    filters.value.document_type_id.value = newVal;
    documentStore.getDocuments({sort: sort.value, pagination: pagination.value, filters: filters.value});
})

//dom ready
onMounted(() => {
    windowWidth.value = window.innerWidth
    window.onresize = () => {
        windowWidth.value = window.innerWidth
    }
    appTracking.mixpanelTrack('Documents visited');
})

onBeforeMount( () => {
    const {search: globalSearch} = route.query;
    if (globalSearch) {
        filters.value.global.value = globalSearch;
    }
    documentStore.getDocuments({sort: sort.value, pagination: pagination.value, filters: filters.value});
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    documentStore.getDocuments({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    documentStore.getDocuments({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    router.replace({query: {search: filters.value.global.value}});
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        documentStore.getDocuments({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
        documentStore.getDocuments({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}


</script>

<style lang="scss">
.documents {
    min-height: calc(100vh - 300px);
    .search-field {
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    .document-card {
        background-color: var(--color-bzr-card-background-primary);
        color: var(--color-bzr-card-text-primary);
    }
    .document-card:hover {
        cursor: pointer;
        background-color: var(--color-bzr-card-hover-background-primary);
        color: var(--color-bzr-card-hover-color-primary);
    }
    .banner {
        height: 60px;
    }
    .p-card {
        .p-card-title {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;  
            overflow: hidden;
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