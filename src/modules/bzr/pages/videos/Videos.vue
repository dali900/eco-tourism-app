<template>
    <div class="videos p-1">
        <!-- list -->
        <div class="video-header mb-3 flex justify-content-between">
            <TitleBanner title="Video"></TitleBanner>
            <div>
                <InputText v-model="filters.global.value" @keyup="onFilter" class="mr-3 search-field" placeholder="Pretraži"/>
                <SplitButton label="" :model="sortItems" :icon="sortIcon" :loading="loading" @click="toggleSort" class="p-button-raised"></SplitButton>
            </div>
        </div>
        <div class="video-list grid" v-if="authStore.hasActivePlan()">
            <DataView :value="videos" layout='grid'>
                <template #grid="slotProps">
                    <div style="padding: 0.5em" class="card-wrap">
                        <Card class="card">
                            <template #header>
                                <div class="video-header" v-if="slotProps.data.video_link">
                                    <iframe :src="slotProps.data.video_link.replace('.com/watch?v=','-nocookie.com/embed/')" frameborder="0" allowfullscreen class="video-iframe"></iframe>
                                </div>
                            </template>
                            <template #title class="video-title">
                                <p :title="slotProps.data.title">{{ slotProps.data.title }}</p>
                            </template>
                            <template #content>
                                <p :title="slotProps.data.description">
                                    {{slotProps.data.description}}
                                </p>
                            </template>
                            <template #footer>
                                <template v-if="slotProps.data.files.length > 0">
                                    Preuzmite prezentacije: <br/>
                                    <template v-for="file of slotProps.data.files">
                                        <a href="#" @click="downloadFile(file.id)">{{file.file_name}}</a><br/>
                                    </template>
                                </template>
                                {{ slotProps.data.publish_date }}
                            </template>
                        </Card>
                    </div>
                </template>
            </DataView>
            <div class="col-12" v-if="videos && videosTotal > 20">
                <Paginator :rows="20" :totalRecords="videosTotal" @page="onPage($event)"></Paginator>
            </div>
        </div>
        <div class="grid" v-else>
            <div class="field col-12 md:col-6 lg:col-6">
                <NoAccessContent/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { FilterMatchMode } from 'primevue/api';
import { useVideoStore } from '@bzr/stores/video'
import { useAuthStore } from '@/stores/auth'
import TitleBanner from '@bzr/components/TitleBanner.vue'
import { useAppTracking } from '@/util/appTracking'
import NoAccessContent from '../noAccess/NoAccessContent.vue';

const appTracking = useAppTracking();
const videoStore = useVideoStore();
const authStore = useAuthStore();
const { videos, videosTotal, loading } = storeToRefs(videoStore)
const { user } = storeToRefs(authStore)

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
    'video_link': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
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
        label: "Video link",
        command: () => {
            sort.value.sortField = "video_link";
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

videoStore.getVideos({sort: sort.value, pagination: pagination.value, filters: filters.value});

//dom ready
onMounted(() => {
    windowWidth.value = window.innerWidth
    window.onresize = () => {
        windowWidth.value = window.innerWidth
    }
    appTracking.mixpanelTrack('Videos visited');
})

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    videoStore.getVideos({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    videoStore.getVideos({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        videoStore.getVideos({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
        videoStore.getVideos({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const downloadFile = (video_file_id) => {
    videoStore.downloadFile(video_file_id);
}


</script>

<style lang="scss">
.videos {
    min-height: calc(100vh - 300px);
    .search-field {
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    .video-card {
        height: 150px;
        background-color: var(--color-bzr-card-background-primary);
        color: var(--color-bzr-card-text-primary);
    }
    .video-card:hover {
        cursor: pointer;
        background-color: var(--color-bzr-card-hover-background-primary);
    }
    .banner {
        height: 60px;
    }
    .video-iframe {
        height: 200px;
        width: 350px;
    }
    .card-wrap {
        width: 366px;
        .card {
            width: auto;
            height: auto;
        }
    }
    :deep(.p-card .p-card-title) {
        margin-bottom: 0;
    }
    .p-card {
        width: 350px;
        height: auto;
        .p-card-title p {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            font-size: 1.2rem;
            height: 46px;
        }
        .p-card-content p {
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            font-size: 0.9rem;
            height: 100px;
        }
        .p-card-footer {
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            font-size: 0.9rem;
            height: 118px;
        }
        .p-card-content {
            padding: 0 !important;
        }
    }
}
</style>