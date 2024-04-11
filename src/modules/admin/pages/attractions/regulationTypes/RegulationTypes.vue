<template>
    <div class="types p-3">
        <div class="top-section mb-2">
            <div class="title">Tipovi propisa</div>
            <div>
                <Button @click="openAddNewRootTypeForm()" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novi tip'"></Button>
            </div>
        </div>
        <TypeForm v-model="showTypeForm" 
            :typeStore="regulationStore"
            :formData="formData" 
            @created="insertNode" 
            @updated="updateNode"
        />
        <Tree :value="tree" class="w-full md:w-30rem">
            <template #default="slotProps">
                <div class="tree-item">
                    <span :class="{'root-type': slotProps.node.parent_id == null}">{{ slotProps.node.name }}</span> 
                    <Button icon="pi pi-plus" text rounded 
                        class="p-button-sm node-icon" 
                        v-tooltip.top="'Dodaj podvrstu'"
                        @click="openAddNewTypeForm(slotProps.node)" 
                    />
                    <Button v-if="canEdit(slotProps.node)" icon="pi pi-pencil" text rounded 
                        class="p-button-sm node-icon" 
                        v-tooltip.top="'Izmeni naziv'"
                        @click="openUpdateTypeForm(slotProps.node)" 
                    />
                    <Button v-if="canEdit(slotProps.node)" icon="pi pi-trash" text rounded 
                        class="p-button-sm p-button-warning node-icon delete-node" 
                        v-tooltip.top="'Obriši'"
                        @click="confirmDeleteNode(slotProps.node)" 
                    />
                </div>
                <!-- <div class="node-info">
                    <small>Kreiran: {{ dateTool.toAppFormat(slotProps.node.created_at) }}</small>
                </div> -->
            </template>
        </Tree>
        <div class="bottom-section">
            <small>Ukupno tipova: {{ treeCount }}</small>
        </div>
    </div>
    <!-- <div class="admin-regulation">
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
        <RegulationTypeForm v-model="showForm" :formData="formData" ></RegulationTypeForm>
        <Card class="resource-list">
            <template #title>
                <div class="flex justify-content-between">
                    <div>
                        <span>Tipovi propisa</span>&nbsp;
                        <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novi propis'"></Button>
                    </div>
                </div>
            </template>
            <template #content>
                <DataTable :value="regulationTypes" responsiveLayout="stack" breakpoint="960px" editMode="cell" class="edit-table" dataKey="id"
                    :loading="loading" :lazy="true"
                    @sort="onSort($event)" 
                    :paginator="true" @page="onPage($event)" :rows="perPage" :totalRecords="regulationTypesTotal" :rowsPerPageOptions="[20, 50, 100]"
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
                            <InputText type="text" v-model="filterModel.value" @keyup="filterCallback()" class="p-column-filter" :placeholder="`Search by name`"/>
                        </template>
                    </Column>
                    <Column field="created_at_formated" header="Created" :sortable="true" style="min-width:10%">
                        <template #body="{data, field}">
                            <div v-tooltip.top="data.created_at">
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
                    <small>Total: {{regulationTypesTotal}}</small>
                </div>
            </template>
        </Card>
    </div> -->
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import Tree from 'primevue/tree';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useConfirm } from "primevue/useconfirm";
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import { useRegulationStore } from '@admin/stores/regulation'
import RegulationTypeForm from './components/RegulationTypeForm.vue'
import { useBuildMenuRecursively } from '@/composables/useBuildMenuRecursively'
import TypeForm from './components/TypeForm.vue'
import dateTool from '@/util/dateTool'
import { useAuthStore } from '@/stores/auth'


const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const regulationStore = useRegulationStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const { tree, treeCount, regulationTypesTotal, loading } = storeToRefs(regulationStore);
const { insertTreeItems } = useBuildMenuRecursively();

const timer = ref(null);
const regulationFilterTimer = ref(null);
const showForm = ref(false);
const showTypeForm = ref(false);
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

regulationStore.getRegulationTypeTree();
regulationStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
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

//Check if the user has access to edit and delete
const canEdit = (node) => { 
    return node.user_id === user.value.id || 
    authStore.hasEditorAccess() 
};

const openAddNewRootTypeForm = () => {
    showTypeForm.value = true;
    formData.value = {parent_id: null};
}

const openAddNewTypeForm = (type) => {
    showTypeForm.value = true;
    formData.value = {
        name: null,
        parent_id: type?.id
    };
}

const openUpdateTypeForm = (type) => {
    showTypeForm.value = true;
    formData.value = type;
}

const confirmDeleteNode = (node) => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteResource(node);
        },
        //no
        reject: () => {},
        //dialog closed
        onHide: () => {}
    });
}

const deleteResource = (node) => {
    const deleted = findAndDeleteObjectById(unref(tree), node.id);
    regulationStore.deleteType(node.id)
        .then(() => {
            toast.add({severity:'success', summary: 'Tip propis obrisan.', life: 3000});
        })
        .catch((e) => {
            console.log(e);
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

// Recursive function to find and delete an object by ID in a tree
function findAndDeleteObjectById(nodes, targetId) {
    // Find the index of the target object in the children array
    const index = nodes.findIndex(child => child.id === targetId);
    if (index !== -1) {
        // If found, remove the object from the children array
        nodes.splice(index, 1);
        return true; // Indicate that the object was found and deleted
    }
    for (const node of nodes) {
        if (node.children && node.children.length) {
            if(findAndDeleteObjectById(node.children, targetId)){
                return true;
            }
        }
    }
  return false; // Object not found in this subtree
}

//Insert tree node
const insertNode = (event) => {
    //new root type created
    if (event.parent_id === null) {
        tree.value.push(event)
    } else {
        const node = findObjectById(unref(tree), event.parent_id);
        if (node) {
            if (!node.children) {
                node.children = [];
            }
            node.children.push(event)
        }
    }
}

// Recursive function to search for an object by ID in a tree
const findObjectById = (nodes, targetId) => {
    for (const node of nodes) {
        if (node.id === targetId) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            const result = findObjectById(node.children, targetId);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

//Update tree node
const updateNode = (event) => {
    formData.value.name = event.name;
}

//create new resource
const openForm = () => {
    formData.value = null;
    showForm.value = true;
}

//update resource
const openUpdateForm = (data, row) => {
    //updatingIndex.value = row.index;
    formData.value = data;
    showForm.value = true;
}

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    regulationStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    regulationStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        regulationStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const confirmDeleteResource = (data) => {
    deletingResourceId.value = data.id;
    showConfirmation.value = true;
}

</script>

<style lang="scss" scoped>
.types {
    height: calc(100vh - 60px);
    overflow-y: scroll;
}
.top-section {
    display: flex;
    align-items: center;
    gap: 4px;
    .title {
        font-size: 1.5rem;
    }
}
.p-button:hover {
    background-color: lightgrey !important;
}
.root-type {
    font-weight: 600;
}
.tree-item {
    display: flex;
    align-items: center;
}
.tree-item:hover .node-icon{
    visibility: visible
}
.node-icon {
    visibility: hidden;
}
.delete-node:hover {
    color: red !important;
}
.node-info {
    margin-top: -13px;
    color: grey;
}
</style>@/modules/admin/stores/attraction