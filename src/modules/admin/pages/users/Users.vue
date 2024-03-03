<template>
    <div v-if="authStore.hasAdminAccess()" class="users">
        <UserForm v-model="showForm" :id="resourceId"></UserForm>
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <div class="flex justify-content-between">
                    <div>
                        <span>Korisnici</span>&nbsp;
                        <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novog korisnika'"></Button>&nbsp;
                        <Button @click="exportToExcel" icon="pi pi-file-excel" class="p-button-sm" v-tooltip="'Export u excel'"></Button>
                    </div>
                    <!-- <div>Opcija</div> -->
                </div>
            </template>
            <template #content>
                <DataTable :value="users" responsiveLayout="stack" breakpoint="960px" editMode="cell" class="edit-table" dataKey="id"
                    :loading="loading" :lazy="true"
                    @sort="onSort($event)" 
                    :paginator="true" @page="onPage($event)" :rows="perPage" :totalRecords="usersTotal" :rowsPerPageOptions="[20, 50, 100]"
                    v-model:filters="filters" filterDisplay="row" @filter="onFilter($event)" :globalFilterFields="['name']"
                    :scrollable="windowWidth > 960 ? true : false"
                    :scrollHeight="windowWidth > 960 ? 'flex' : null"
                    :style="windowWidth > 960 ? 'height: calc(100vh - 200px)' : ''"
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
                    <template #loading>
                        Učitava se. Molimo vas sačekajte.
                    </template>
                    <Column field="name" header="Naziv" :sortable="true" ref="name" :style="mainColumnsWidth">
                        <template #body="{data}">
                            <router-link :to="{ name: 'AdminUser', params: { userId: data.id }}" class="resource-link">
                                {{data.name}}
                            </router-link>
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretraga po imenu`"/>
                        </template>
                    </Column>
                    <Column field="email" header="Email" :sortable="true" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.email}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretraga po email adresi`"/>
                        </template>
                    </Column>
                    <Column field="role" header="Rola" :sortable="true" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.role}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretraga po roli`"/>
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
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn" @click="openUpdateForm(slotProps.data.id)" /> 
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-warning action-table-btn delete-btn" @click="confirmDeleteResource(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable> 
            </template>
            <template #footer>
                <div class="flex justify-content-between">
                    <small>Total: {{usersTotal}}</small>
                </div>
            </template>
        </Card>
    </div>
    <div v-else class="grid">
        <div class="field">
            <NoAccess/>
        </div>
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useConfirm } from "primevue/useconfirm";
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import UserForm from './components/UserForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@admin/stores/user'
import NoAccess from '../noAccess/NoAccess.vue'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const authStore = useAuthStore();
const userStore = useUserStore();
const { users, usersTotal, loading } = storeToRefs(userStore)

const timer = ref(null);
const showForm = ref(false);
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
    'name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'email': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'first_name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'last_name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'role': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'status': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const resourceId = ref(null);

userStore.getUsers({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
    resourceId.value = null;
    showForm.value = true;
}


const openUpdateForm = (id) => {
    //updatingIndex.value = row.index;
    resourceId.value = id;
    showForm.value = true;
}

const exportToExcel = () => {
    userStore.exportToExcel();
}

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    userStore.getUsers({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    userStore.getUsers({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        userStore.getUsers({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
        reject: () => {
            
        },
        //dialog closed
        onHide: () => {
            
        }
    });
};

const deleteResource = (id) => {
    userStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Korisnik obrisan.', life: 3000});
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
:deep(.edit-table .p-datatable-tbody tr:hover .action-table-btn) {
    visibility: visible;
}
:deep(.edit-table .p-datatable-tbody .delete-btn:hover) {
    background-color:red;
}
.resource-link {
    color: inherit;
}
.resource-link:hover {
    color: var(--blue-500);
}
</style>