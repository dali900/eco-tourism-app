<template>
    <div class="categories p-3">
        <div class="top-section mb-2">
            <div class="title">Kategorije znamenitosti</div>
            <div>
                <Button @click="openAddNewRootCategoryForm()" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novu kategoriju'"></Button>
            </div>
        </div>
        <CategoryForm v-model="showCategoryForm" 
            :formData="formData" 
            @created="insertNode" 
            @updated="updateNode"
        />
        <Tree :value="tree" class="category-tree">
            <template #default="slotProps">
                <div class="tree-item">
                    <span :class="{'root-category': slotProps.node.parent_id == null}">{{ slotProps.node.name }}</span> 
                    <Button icon="pi pi-plus" text rounded 
                        class="p-button-sm node-icon" 
                        v-tooltip.top="'Dodaj podkategoriju'"
                        @click="openAddNewCategoryForm(slotProps.node)" 
                    />
                    <Button v-if="canEdit(slotProps.node)" icon="pi pi-pencil" text rounded 
                        class="p-button-sm node-icon" 
                        v-tooltip.top="'Izmeni naziv'"
                        @click="openUpdateCategoryForm(slotProps.node)" 
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
            <small>Ukupno kategorija: {{ treeCount }}</small>
        </div>
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import Tree from 'primevue/tree';
import { useConfirm } from "primevue/useconfirm";
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useAttractionStore } from '@/stores/attraction'
import CategoryForm from './components/CategoryForm.vue'
import dateTool from '@/util/dateTool'
import { useAuthStore } from '@/stores/auth'
import { useGlobalStore } from '@/stores/global'


const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const attractionStore = useAttractionStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const { tree, treeCount, loading } = storeToRefs(attractionStore);

const timer = ref(null);
const categoryFilterTimer = ref(null);
const showForm = ref(false);
const showCategoryForm = ref(false);
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
});
const formData = ref(null);

globalStore.getLanguages();
attractionStore.getAttractionCategoryTree();

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

const openAddNewRootCategoryForm = () => {
    showCategoryForm.value = true;
    formData.value = {parent_id: null};
}

const openAddNewCategoryForm = (category) => {
    showCategoryForm.value = true;
    formData.value = {
        name: null,
        parent_id: category?.id
    };
}

const openUpdateCategoryForm = (category) => {
    showCategoryForm.value = true;
    formData.value = category;
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
    attractionStore.deleteCategory(node.id)
        .then(() => {
            toast.add({severity:'success', summary: 'Kategorija obrisana.', life: 3000});
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
    //new root category created
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
    if (event) {
        formData.value.name = event.name;
    }
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
    attractionStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    attractionStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        attractionStore.getRegulationTypes({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const confirmDeleteResource = (data) => {
    deletingResourceId.value = data.id;
    showConfirmation.value = true;
}

</script>

<style lang="scss" scoped>
.categories {
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
.root-category {
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
:deep(.p-treenode-content){
    padding: 2px 0;
    border: 2px solid transparent;
    max-width: 600px;
}
:deep(.p-treenode-content:hover){
    background-color: var(--color-background-mute);
    border: 2px solid grey;
}
</style>@/modules/admin/stores/attraction