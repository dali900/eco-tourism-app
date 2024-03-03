<script setup>

</script>

<template>
    <div class="admin-news">
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <span>Vesti</span> <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novu vest'"></Button>
            </template>
            <template #content>
                <DataTable class="edit-table" 
                    dataKey="id"
                    editMode="cell" 
                    responsiveLayout="stack" 
                    breakpoint="960px" 
                    v-model:filters="filters" filterDisplay="row" 
                    :globalFilterFields="['title']"
                    :value="news" 
                    :loading="loading" :lazy="true"
                    :paginator="true" 
                    :rows="perPage" 
                    :totalRecords="newsTotal" 
                    :rowsPerPageOptions="[20, 50, 100]"
                    :scrollable="windowWidth > 960 ? true : false"
                    :scrollHeight="windowWidth > 960 ? 'flex' : null"
                    :style="windowWidth > 960 ? 'height: calc(100vh - 200px)' : ''"
                    @page="onPage($event)" 
                    @sort="onSort($event)" 
                    @filter="onFilter($event)" 
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
                    <Column field="title" header="Naslov" :sortable="true" ref="title" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.title}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretražite po naslovu`"/>
                        </template>
                    </Column>
                    <Column field="subtitle" header="Podnaslov" :sortable="true" ref="subtitle" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.subtitle}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretražite po podnaslovu`"/>
                        </template>
                    </Column>
                    <Column field="publish_date" header="Datum objavljivanja" :sortable="true" ref="publish_date" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.publish_date}}
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn" @click="openUpdateForm(slotProps.data, slotProps)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-warning action-table-btn delete-btn" @click="confirmDeleteResource(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable> 
            </template>
            <template #footer>
                <div class="flex justify-content-between">
                    <small>Total: {{newsTotal}}</small>
                </div>
            </template>
        </Card>
        <NewsForm v-model="showForm" :formData="formData"></NewsForm>
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
import NewsForm from './components/NewsForm.vue'
import { useNewsStore } from '@admin/stores/news'
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

const router = useRouter();
const route = useRoute();
const toast = useToast();

const newsStore = useNewsStore();
const { news, newsTotal, loading } = storeToRefs(newsStore);

const timer = ref(null);
const newsFilterTimer = ref(null);
const showForm = ref(false);
const showUpdateForm = ref(false);
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
    'title': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'subtitle': {value: null, matchMode: FilterMatchMode.CONTAINS}
});
const formData = ref(null);

newsStore.getNews({sort: sort.value, pagination: pagination.value, filters: filters.value});
const mainColumnsWidth = computed(() => { return {'min-width': (90/3).toFixed(2)+'%'} });

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
    title: "",
    subtitle: "",
    text: ""
});
const formErrors = reactive({
    title: "",
    subtitle: "",
    text: ""
});

const clearForm = () => {
    form.title = "";
    form.subtitle = "";
    form.text = "";
    
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
    newsStore.getNews({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    newsStore.getNews({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        newsStore.getNews({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
    newsStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Vest obrisana.', life: 3000});
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