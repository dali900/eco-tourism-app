<script setup>

</script>

<template>
    <div class="admin-banners">
        <BannerForm v-model="showForm" :id="selectedBannerId"></BannerForm>
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <span>Baneri</span> <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj nov baner'"></Button>
            </template>
            <template #content>
                <DataTable :value="banners" responsiveLayout="stack" breakpoint="960px" editMode="cell" class="edit-table" dataKey="id"
                    :loading="loading" :lazy="true"
                    @sort="onSort($event)" 
                    v-model:filters="filters" filterDisplay="row" @filter="onFilter($event)" :globalFilterFields="['title']"
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
                    <Column field="title" header="Naslov" :sortable="true" ref="title" :style="mainColumnsWidth">
                        <template #body="{data}">
                            <span v-html="data.title"></span>
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretražite po naslovu`"/>
                        </template>
                    </Column>
                    <Column field="position" header="Pozicija banera" :sortable="true" ref="position" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.position}}
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Pretražite po poziciji`"/>
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn" @click="openForm(slotProps.data.id)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-warning action-table-btn delete-btn" @click="confirmDeleteResource(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable> 
            </template>
            <template #footer>
                <div class="flex justify-content-between">
                    <small>Total: {{bannersTotal}}</small>
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
import BannerForm from './components/BannerForm.vue'
import { useBannerStore } from '@admin/stores/banner'
import { useConfirm } from "primevue/useconfirm";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const bannerStore = useBannerStore();
const { banners, bannersTotal, loading } = storeToRefs(bannerStore);

const timer = ref(null);
const bannersFilterTimer = ref(null);
const selectedBannerId = ref(null);
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
    'position': {value: null, matchMode: FilterMatchMode.CONTAINS}
});
const formData = ref(null);

bannerStore.getBanners({sort: sort.value, pagination: pagination.value, filters: filters.value});
const mainColumnsWidth = computed(() => { return {'min-width': (90/4).toFixed(2)+'%'} });

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
    position: ""
});
const formErrors = reactive({
    title: "",
    position: ""
});

const clearForm = () => {
    form.title = "";
    form.position = "";
    
    showUpdateForm.value = false;
};

const openForm = (id = null) => {
    selectedBannerId.value = id;
    showForm.value = true;
}

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    bannerStore.getBanners({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        bannerStore.getBanners({sort: sort.value, pagination: pagination.value, filters: filters.value});
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
    bannerStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Baner je obrisan.', life: 3000});
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
:deep(.edit-table .p-datatable-tbody tr:hover .action-table-btn){
    visibility: visible;
}
:deep(.edit-table .p-datatable-tbody .delete-btn:hover) {
    background-color:red;
}
</style>