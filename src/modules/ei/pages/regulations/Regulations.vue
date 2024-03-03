<template>
    <div class="regulations p-1">
        <!-- list -->
        <div v-if="regulations">
            <div class="regulation-header mb-3 flex justify-content-between">
                <TitleBanner title="Propisi"></TitleBanner>
                <div>
                    <InputText v-model="filters.global.value" @keyup="onFilter" class="mr-3 search-field" placeholder="Pretraži"/>
                    <SplitButton label="" :model="sortItems" :icon="sortIcon" :loading="loading" @click="toggleSort" class="p-button-raised"></SplitButton>
                </div>
            </div>
            <div class="regulation-list grid">
                <div class="col-12" v-for="regulation in regulations">
                    <router-link :to="{ name: 'Regulation', params: { regulationId: regulation.id }}" class="btn-link">
                        <Card class="regulation-card" :class="regulation.approved === 0 ? 'not-approved' : 'approved'">
                            <template #title>
                                <span v-html="regulation.name"></span>
                            </template>
                            <template #subtitle>
                                <span v-if="regulation.type">{{regulation.type.name}}</span>
                            </template>
                            <template #content>
                                {{regulation.messenger}}
                            </template>
                        </Card>
                    </router-link>
                </div>
                <div class="col-12" v-if="regulations && regulationsTotal > 20">
                    <Paginator :rows="20" :totalRecords="regulationsTotal" @page="onPage($event)"></Paginator>
                </div>
            </div>
        </div>
        <div v-else>
            Nema podataka.
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { FilterMatchMode } from 'primevue/api';
import { useRegulationStore } from '../../stores/regulation'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import TitleBanner from '@ei/components/TitleBanner.vue'
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const regulationStore = useRegulationStore();
const authStore = useAuthStore();
const { regulations, regulationsTotal, loading } = storeToRefs(regulationStore)
const { user } = storeToRefs(authStore)
const route = useRoute();
const router = useRouter();

const timer = ref(null);
const windowWidth = ref("");
const perPage = ref(20);
const sort = ref({
    sortField: "created_at",
    sortOrder: -1,
});
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    'messenger': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    'regulation_type_id': {value: route.params.regulationTypeId ? route.params.regulationTypeId : null, matchMode: FilterMatchMode.EQUALS},
});
const sortItems = [
    {
        label: "Naziv",
        command: () => {
            sort.value.sortField = "name";
            onSort(sort.value);
        }
    },
    {
        label: "Datum postavljanja",
        command: () => {
            sort.value.sortField = "created_at";
            onSort(sort.value);
        }
    },
];

const mainColumnsWidth = computed(() => { return {'min-width': (80/3).toFixed(2)+'%'} });
const sortIcon = computed(() => { 
    if(sort.value.sortOrder == -1) return "pi pi-sort-amount-down";
    if(sort.value.sortOrder == 1) return "pi pi-sort-amount-up-alt";
    return "pi pi-sort-alt";
 });

 
//fetch filtered data
watch(() => route.params.regulationTypeId, (newVal, oldVal) => {
    filters.value.regulation_type_id.value = newVal;
    regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
})
watch(() => route.params.regulationRootType, (newVal, oldVal) => {
    regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
})

onBeforeMount( () => {
    const {search: globalSearch} = route.query;
    if (globalSearch) {
        filters.value.global.value = globalSearch;
    }
    regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
    appTracking.mixpanelTrack('Regulations visited');
});

//dom ready
onMounted(() => {
    windowWidth.value = window.innerWidth
    window.onresize = () => {
        windowWidth.value = window.innerWidth
    }
})

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    router.replace({query: {search: filters.value.global.value}});
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
        regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}


</script>

<style lang="scss">
.regulations {
    min-height: calc(100vh - 300px);
    max-width: 1200px;
    margin: 0 auto;
    .search-field {
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    .regulation-card {
        background-color: var(--color-exportinfo-card-background-primary);
        color: var(--color-exportinfo-card-text-primary);
    }
    .regulation-card:hover {
        cursor: pointer;
        background-color: var(--color-exportinfo-card-hover-background-primary);
        color: var(--color-exportinfo-card-hover-color-primary);
        .p-card-subtitle {
            color: var(--color-exportinfo-card-hover-color-primary);
        }
    }
    .banner {
        height: 60px;
        background-position: center;
        background-repeat: no-repeat;
        background-color: rgba(230,230,230,255);
        position: relative;
    }
    .p-card {
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