<template>
    <div class="admin-regulations">
        <!-- <RegulationForm v-model="showForm" :formData="formData" @saved="formSaved"></RegulationForm> -->
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <div class="flex justify-content-between">
                    <div>
                        <span>Propisi</span>&nbsp;
                        <router-link :to="{ name: 'AdminRegulation'}" class="btn-link">
                            <Button icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novi propis'"/>
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
                    :value="regulations" 
                    :globalLoading="globalLoading" 
                    :lazy="true"
                    :paginator="true" 
                    :rows="perPage" 
                    :totalRecords="regulationsTotal" 
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
                        <div v-if="globalLoading">
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
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Search by name`"/>
                        </template>
                    </Column>
                    <Column field="messenger" header="Glasnik" :sortable="true" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.messenger}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Search by messenger`"/>
                        </template>
                    </Column>
                    <Column field="approved" header="Odobren" dataType="boolean" style="min-width: 6rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'pi-check-circle text-green-500': data.approved, 'pi-times-circle text-red-400': !data.approved }"></i>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                        </template>
                    </Column>
                    <Column field="created_at_formated" header="Created" :sortable="true" style="min-width:10%">
                        <template #body="{data, field}">
                            <div v-tooltip.top="data.created_at">
                                {{data[field]}}
                            </div>
                        </template>
                    </Column>
                    <!-- <Column field="updated_at_formated" header="Updated" :sortable="true"></Column> -->
                    <Column :exportable="false" style="min-width:10%">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'AdminRegulation', params: { regulationId: slotProps.data.id }}" class="btn-link">
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
                    <small>Total: {{regulationsTotal}}</small>
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
import { useRegulationStore } from '../../stores/regulation'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const authStore = useAuthStore();
const regulationStore = useRegulationStore();
const { regulations, regulationsTotal, globalLoading } = storeToRefs(regulationStore)
const { user } = storeToRefs(authStore)

const timer = ref(null);
const showForm = ref(false);
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
    'name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'messenger': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'approved': {value: null, matchMode: FilterMatchMode.EQUALS}
});
const formData = ref(null);

regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
const mainColumnsWidth = computed(() => { return {'min-width': (80/3).toFixed(2)+'%'} });

//data and props ready, dom still not
onBeforeMount( () => {
    //unselect if resource was selected in form
    regulationStore.regulation = null;
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
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        regulationStore.getRegulations({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
    regulationStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Propis obrisan.', life: 3000});
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
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
:deep(.edit-table .p-datatable-tbody tr:hover .action-table-btn){
    visibility: visible; 
}
:deep(.edit-table .p-datatable-tbody .delete-btn:hover) {
    background-color:red;
}
</style>../../stores/attraction