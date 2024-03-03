<template>
    <div class="questions p-1">
        <!-- list -->
        <div class="question-header mb-3 flex justify-content-between">
            <TitleBanner title="Pitanja"></TitleBanner>
            <div>
                <InputText v-model="filters.global.value" @keyup="onFilter" class="mr-3 search-field" placeholder="Pretraži"/>
                <SplitButton label="" :model="sortItems" :icon="sortIcon" :loading="loading" @click="toggleSort" class="p-button-raised"></SplitButton>
            </div>
        </div>
        <div class="question-list grid">
            <div class="col-12" v-for="question in questions">
                <router-link :to="{ name: 'Question', params: { questionId: question.id }}" class="btn-link">
                    <Card class="question-card" :class="question.approved === 0 ? 'not-approved' : 'approved'">
                        <template #title>
                            <span v-html="question.title"></span>
                        </template>
                        <template #subtitle>
                            {{question.author}}
                        </template>
                        <template #content>
                            {{question.publish_date}}
                        </template>
                    </Card>
                </router-link>
            </div>
            <div class="col-12" v-if="questions && questionsTotal > 20">
                <Paginator :rows="20" :totalRecords="questionsTotal" @page="onPage($event)"></Paginator>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { FilterMatchMode } from 'primevue/api';
import { useQuestionStore } from '@bzr/stores/question'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import TitleBanner from '@bzr/components/TitleBanner.vue'
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const questionStore = useQuestionStore();
const authStore = useAuthStore();
const { questions, questionsTotal, loading } = storeToRefs(questionStore)
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
    'question': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
const sortItems = [
    {
        label: "Naslov",
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
    appTracking.mixpanelTrack('Questions visited');
})

onBeforeMount( () => {
    const {search: globalSearch} = route.query;
    if (globalSearch) {
        filters.value.global.value = globalSearch;
    }
    questionStore.getQuestions({sort: sort.value, pagination: pagination.value, filters: filters.value});
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    questionStore.getQuestions({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    questionStore.getQuestions({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    router.replace({query: {search: filters.value.global.value}});
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        questionStore.getQuestions({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
        questionStore.getQuestions({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}


</script>

<style lang="scss">
.questions {
    min-height: calc(100vh - 300px);
    .search-field {
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    .question-card {
        height: 150px;
        background-color: var(--color-bzr-card-background-primary);
        color: var(--color-bzr-card-text-primary);
    }
    .question-card:hover {
        cursor: pointer;
        background-color: var(--color-bzr-card-hover-background-primary);
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