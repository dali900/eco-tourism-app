<template>
    <div class="admin-attractions">
        <!-- <RegulationForm v-model="showForm" :formData="formData" @saved="formSaved"></RegulationForm> -->
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <div class="flex justify-content-between">
                    <div>
                        <span>Znamenitosti</span>&nbsp;
                        <router-link :to="{ name: 'AdminAttraction'}" class="btn-link">
                            <Button icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novu atrakciju'"/>
                        </router-link>
                        <!-- <small>Forma:</small><Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novi propis'"></Button> -->
                    </div>
                    <!-- <div>Opcija</div> -->
                </div>
            </template>
            <template #content>
                <DataTable class="edit-table" 
                    v-model:filters="filters" 
                    filterDisplay="row" 
                    responsiveLayout="stack" 
                    breakpoint="960px" 
                    editMode="cell" 
                    dataKey="id"
                    :value="attractions" 
                    :loading="loading" 
                    :lazy="true"
                    :paginator="true" 
                    :rows="perPage" 
                    :totalRecords="attractionsTotal" 
                    :rowsPerPageOptions="[20, 50, 100]"
                    :globalFilterFields="['name']"
                    :scrollable="windowWidth > 960 ? true : false"
                    :scrollHeight="windowWidth > 960 ? 'flex' : null"
                    :style="windowWidth > 960 ? 'height: calc(100vh - 200px)' : ''"
                    @sort="onSort($event)" 
                    @page="onPage($event)" 
                    @filter="onFilter($event)" 
                >
                    <template #header v-if="windowWidth <= 960">
                        <div class="flex justify-content-end">
                            <span class="p-input-icon-left ">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" @keyup="onFilter" placeholder="Table Search" />
                            </span>
                        </div>
                    </template>
                    <template #empty>
                        <div v-if="loading">
                            Učitava se...
                        </div>
                        <div v-else>
                            Nema rezultata.
                        </div>
                    </template>
                    <template #globalLoading>
                        Učitava se. Molimo vas sačekajte.
                    </template>
                    <Column field="name" header="Naziv" :sortable="true" ref="name" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.name}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretrazi po nazivu`"/>
                        </template>
                    </Column>
                    <Column field="created_at_formated" header="Kreiran" :sortable="true" style="min-width:10%">
                        <template #body="{data, field}">
                            <div v-tooltip.top="data.created_at">
                                {{data[field]}}
                            </div>
                        </template>
                    </Column>
                    <!-- <Column field="updated_at_formated" header="Updated" :sortable="true"></Column> -->
                    <Column :exportable="false" style="min-width:10%">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'AdminAttraction', params: { attractionId: slotProps.data.id }}" class="btn-link">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn"/>
                            </router-link>
                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn" @click="openUpdateForm(slotProps.data, slotProps)" /> -->
                            <Button v-if="slotProps.data.user_id === user.id || authStore.hasEditorAccess()" icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-warning action-table-btn delete-btn" @click="confirmDeleteResource(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable> 
            </template>
            <template #footer>
                <div class="flex justify-content-between">
                    <small>Ukupno: {{attractionsTotal}}</small>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { useAuthStore } from '@/stores/auth'
import { useAttractionStore } from '@/stores/attraction'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const authStore = useAuthStore();
const attractionStore = useAttractionStore();
const { attractions, attractionsTotal, loading } = storeToRefs(attractionStore)
const { user } = storeToRefs(authStore)

const timer = ref(null);
const showForm = ref(false);
const windowWidth = ref("");
const perPage = ref(20);
const sort = ref({
    sortField: "sortField" in route.query ? route.query.sortField : "id",
    sortOrder: "sortOrder" in route.query ? route.query.sortOrder : -1,
});
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'content': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'summary': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'approved': {value: null, matchMode: FilterMatchMode.EQUALS},
    'category_id': {value: null, matchMode: FilterMatchMode.EQUALS},
});
const formData = ref(null);

attractionStore.getAttractions({sort: sort.value, pagination: pagination.value, filters: filters.value});
const mainColumnsWidth = computed(() => { return {'min-width': (80/3).toFixed(2)+'%'} });

//data and props ready, dom still not
onBeforeMount( () => {
    //unselect if resource was selected in form
    attractionStore.attraction = null;
});

//dom ready
onMounted(() => {
    windowWidth.value = window.innerWidth
    //TODO: unmount event
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
    attractionStore.getAttractions({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    attractionStore.getAttractions({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        attractionStore.getAttractions({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const confirmDeleteResource = (id) => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteResource(id);
        },
        //no
        reject: () => {},
        //dialog closed
        onHide: () => {}
    });
};

const deleteResource = (id) => {
    attractionStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Propis obrisan.', life: 3000});
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

</script>

<style scoped>
.admin-attractions {
    max-width: 1200px;
    margin: auto;
}
:deep(.edit-table .p-editable-column.p-cell-editing) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
:deep(.edit-table .p-datatable-tbody .action-table-btn) {
    visibility: hidden;
}
:deep(.edit-table .p-datatable-tbody tr:hover .action-table-btn){
    visibility: visible; 
}
:deep(.edit-table .p-datatable-tbody .delete-btn:hover) {
    background-color:red;
}
</style>../../stores/attraction