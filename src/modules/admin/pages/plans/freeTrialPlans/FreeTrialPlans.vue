<template>
    <div class="admin-document">
        <FreeTrialPlanForm v-model="showForm" :id="resourceId"></FreeTrialPlanForm>
        <!-- list -->
        <Card class="resource-list">
            <template #title>
                <span>Free trial planovi</span> &nbsp;
                <Button icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novi dokument'" @click="openForm(null)"/>
            </template>
            <template #content>
                <DataTable class="edit-table" 
                    responsiveLayout="stack" 
                    breakpoint="960px" 
                    dataKey="id"
                    :value="freeTrialPlans" 
                    :loading="loading" 
                    :lazy="true"
                    :scrollable="windowWidth > 960 ? true : false"
                    :scrollHeight="windowWidth > 960 ? 'flex' : null"
                >
                    <template #empty>
                        Nema rezultata.
                    </template>
                    <template #loading>
                        Učitava se. Molimo vas sačekajte.
                    </template>
                    <Column field="name" header="Naziv" ref="name" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.name}}
                        </template>
                    </Column>
                    <Column field="key" header="Ključ" ref="key" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.key}}
                        </template>
                    </Column>
                    <Column field="days" header="Dani" ref="days" :style="mainColumnsWidth">
                        <template #body="{data}">
                            {{data.days}}
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
                    <small>Total: {{freeTrialPlansTotal}}</small>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
/**
 * Forma uvek da zove api za dovlacenje podataka za formu, kako bi komponenta forme bila sto nezavisnija
 */
import { ref, unref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { useFreeTrialStore } from '@admin/stores/freeTrial'
import FreeTrialPlanForm from './components/FreeTrialPlanForm.vue'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const freeTrialStore = useFreeTrialStore();
const { freeTrialPlans, freeTrialPlansTotal, loading } = storeToRefs(freeTrialStore);

const timer = ref(null);
const showForm = ref(false);
const windowWidth = ref("");
const resourceId = ref(null);

const mainColumnsWidth = computed(() => { return {'min-width': (90/3).toFixed(2)+'%'} });

//data and props ready, dom still not
onBeforeMount( () => {
    freeTrialStore.getFreeTrialPlans();
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

const openForm = (id) => {
    resourceId.value = id;
    showForm.value = true;
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
    freeTrialStore.deletePlan(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Plan obrisan.', life: 3000});
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