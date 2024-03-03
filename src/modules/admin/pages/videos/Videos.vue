<script setup>

</script>

<template>
    <div class="admin-videos">
        <Dialog header="Potvrda" v-model:visible="showConfirmation" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Da li želite da nastavite?</span>
            </div>
            <template #footer>
                <Button label="Ne" icon="pi pi-times" @click="showConfirmation = false" class="p-button-text"/>
                <Button label="Da" icon="pi pi-check" @click="deleteResource" class="p-button-text" autofocus />
            </template>
        </Dialog>
        <VideoForm v-model="showForm" :formData="formData" @saved="resourceSaved"></VideoForm>
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <span>Video</span> <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj nov video'"></Button>
            </template>
            <template #content>
                <DataTable :value="videos" responsiveLayout="stack" breakpoint="960px" editMode="cell" class="edit-table" dataKey="id"
                    :loading="loading" :lazy="true"
                    @sort="onSort($event)" 
                    :paginator="true" @page="onPage($event)" :rows="perPage" :totalRecords="videosTotal" :rowsPerPageOptions="[20, 50, 100]"
                    v-model:filters="filters" filterDisplay="row" @filter="onFilter($event)" :globalFilterFields="['video']"
                    :scrollable="windowWidth > 960 ? true : false"
                    :scrollHeight="windowWidth > 960 ? 'flex' : null"
                    :style="windowWidth > 960 ? 'height: calc(100vh - 200px)' : ''"
                >
                    <template #header v-if="windowWidth <= 960">
                        <div class="flex justify-content-end">
                            <span class="p-input-icon-left ">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" @keyup="onFilter" placeholder="Pretraga" />
                            </span>
                        </div>
                    </template>
                    <template #empty>
                        Nema rezultata.
                    </template>
                    <template #loading>
                        Učitava se. Molimo vas sačekajte.
                    </template>
                    <Column field="title" header="Naslov" :sortable="true" filterMatchMode="startsWith" ref="title" :style="mainColumnsWidth">
                        <template #body="{data}">
                            <span v-html="data.title"></span>
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretražite po video linku`"/>
                        </template>
                    </Column>
                    <Column field="publish_date" header="Datum objavljivanja" :sortable="true" filterMatchMode="startsWith" ref="publish_date" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.publish_date}}
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn" @click="openUpdateForm(slotProps.data, slotProps)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-warning action-table-btn delete-btn" @click="confirmDeleteResource(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable> 
            </template>
            <template #footer>
                <div class="flex justify-content-between">
                    <small>Total: {{videosTotal}}</small>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import VideoForm from './components/VideoForm.vue'
import { useVideoStore } from '@admin/stores/video'

const router = useRouter();
const route = useRoute();
const toast = useToast();

const videoStore = useVideoStore();
const { videos, videosTotal, loading } = storeToRefs(videoStore);

const timer = ref(null);
const videosFilterTimer = ref(null);
const showForm = ref(false);
const showUpdateForm = ref(false);
const showConfirmation = ref(false);
const deletingVideoId = ref(false);
const windowWidth = ref("");
const perPage = ref(20);
const sort = ref({
    sortField: "sortField" in route.query ? route.query.sortField : "created_at",
    sortOrder: "sortOrder" in route.query ? route.query.sortOrder : -1,
});
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'title': {value: null, matchMode: FilterMatchMode.CONTAINS}
});
const formData = ref(null);

videoStore.getVideos({sort: sort.value, pagination: pagination.value, filters: filters.value});
const mainColumnsWidth = computed(() => { return {'min-width': (80/3).toFixed(2)+'%'} });

watch( showForm, (newVal, oldVal) => {
    if(newVal === false){
        clearForm();
    }
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

const selectedRegulation = ref(null);
const form = reactive({
    title: ""
});
const formErrors = reactive({
    title: ""
});

const clearForm = () => {
    form.title = "";
    showUpdateForm.value = false;
};

const openForm = () => {
    formData.value = null;
    showForm.value = true;
}

const openUpdateForm = (data, row) => {
    formData.value = data;
    showForm.value = true;
}

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

const confirmDeleteResource = (data) => {
    deletingVideoId.value = data.id;
    showConfirmation.value = true;
}

const deleteResource = () => {
    videoStore.delete(deletingVideoId.value)
        .then(() => {
            toast.add({severity:'success', summary: 'Video obrisan.', life: 3000});
            showConfirmation.value = false;
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

</script>

<style scoped>
.add-card {
    width: fit-content !important;
}
.field {
    margin-right: 5px;
}
.resource-list {
    margin-top: 5px;
}
.checkbox-label {
    margin-left: 3px;
}
:deep(.edit-table .p-editable-column.p-cell-editing) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
:deep(.edit-table .p-datatable-tbody .action-table-btn) {
    visibility: hidden;
}
:deep(.edit-table .p-datatable-tbody tr:hover .action-table-btn) {
    visibility: visible;
}
:deep(.edit-table .p-datatable-tbody .delete-btn:hover) {
    background-color:red;
}
</style>