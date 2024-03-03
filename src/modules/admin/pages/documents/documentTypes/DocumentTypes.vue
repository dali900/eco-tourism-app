<template>
    <div class="admin-document">
        <Dialog header="Brisanje" v-model:visible="showConfirmation" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Da li želite da nastavite?</span>
            </div>
            <template #footer>
                <Button label="Ne" icon="pi pi-times" @click="showConfirmation = false" class="p-button-text"/>
                <Button label="Da" icon="pi pi-check" @click="deleteResource" class="p-button-text" autofocus />
            </template>
        </Dialog>
        <DocumentTypeForm v-model="showForm" :formData="formData" @saved="formSaved"></DocumentTypeForm>
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <div class="flex justify-content-between">
                    <div>
                        <span>Tipovi modela akata</span>&nbsp;
                        <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novi tip modela akta'"></Button>
                    </div>
                </div>
            </template>
            <template #content>
                <DataTable :value="documentTypes" responsiveLayout="stack" breakpoint="960px" editMode="cell" class="edit-table" dataKey="id"
                    :loading="loading" :lazy="true"
                    @sort="onSort($event)" 
                    :paginator="true" @page="onPage($event)" :rows="perPage" :totalRecords="documentTypesTotal" :rowsPerPageOptions="[20, 50, 100]"
                    v-model:filters="filters" filterDisplay="row" @filter="onFilter($event)" :globalFilterFields="['name']"
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
                    <Column field="name" header="Naziv" :sortable="true" filterMatchMode="startsWith" ref="name" :style="mainColumnsWidth">
                        <template #body="{data}">
                            <b v-if="!data.parent_id">{{data.name}}</b>
                            <span v-else>{{data.name}} <small class="text-color-secondary">({{ data.parent_name }})</small></span>
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretražite po nazivu`"/>
                        </template>
                    </Column>
                    <Column field="created_at_formated" header="Kreiran" :sortable="true" style="min-width:10%">
                        <template #body="{data, field}">
                            <div>
                                {{data[field]}}
                            </div>
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
                    <small>Total: {{documentTypesTotal}}</small>
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
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import { useDocumentStore } from '@admin/stores/document'
import DocumentTypeForm from './components/DocumentTypeForm.vue'


const router = useRouter();
const route = useRoute();
const toast = useToast();

const documentStore = useDocumentStore();
const { documentTypes, documentTypesTotal, loading } = storeToRefs(documentStore)

const timer = ref(null);
const showForm = ref(false);
const showConfirmation = ref(false);
const deletingResourceId = ref(false);
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
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    'messenger': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
});
const formData = ref(null);

documentStore.getDocumentTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
const mainColumnsWidth = computed(() => { return {'min-width': (80/3).toFixed(2)+'%'} });

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

const openForm = () => {
    formData.value = null;
    showForm.value = true;
}


const openUpdateForm = (data, row) => {
    //updatingIndex.value = row.index;
    formData.value = data;
    showForm.value = true;
}

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    documentStore.getDocumentTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    documentStore.getDocumentTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        documentStore.getDocumentTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const confirmDeleteResource = (data) => {
    deletingResourceId.value = data.id;
    showConfirmation.value = true;
}

const deleteResource = () => {
    documentStore.deleteType(deletingResourceId.value)
        .then(() => {
            toast.add({severity:'success', summary: 'Tip modela akta obrisan.', life: 3000});
            showConfirmation.value = false;
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

const formSaved = () => {

}

</script>

<style scoped>

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