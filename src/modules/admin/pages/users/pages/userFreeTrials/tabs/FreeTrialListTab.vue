<template>
    <div class="free-trial-list-tab">
        <FreeTrialForm v-model="showForm" :freeTrialId="selectedId" :userId="userId" @saved="saved"></FreeTrialForm>
        <div class="header flex justify-content-between p-3">
            <Button icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novu pretplatu'" @click="openForm"/>
            <div class="right">
                <!-- <small>Ukupno: </small>{{ freeTrialsTotal }} -->
            </div>
        </div>
        <div class="free-trial-list">
            <DataTable 
                class="edit-table" 
                v-model:expandedRows="expandedRows"
                :value="freeTrials" 
                stripedRows 
                dataKey="id"
                >
                <Column expander style="width: 30px"/>
                <Column field="start_date_formated" header="Datum početka" sortable></Column>
                <Column field="end_date_formated" header="Datum završetka" sortable></Column>
                <Column field="status" header="Status" sortable>
                    <template #body="{ data }">
                        <div :class="{ 
                            'error': data.status === 'expired' || data.status === 'canceled',
                            'success': data.status === 'active'
                        }">
                            {{ translateStatus(data.status) }}
                        </div>
                    </template>
                </Column>
                <template #empty>
                    <div v-if="loading">
                        Učitava se...
                    </div>
                    <div v-else>
                        Nema probnog perioda.
                    </div>
                </template>
                <template #expansion="slotProps">
                    <div class="p-3 grid">
                        <div class="col-12 md:col-6 lg:col-4 field">
                            <label>Preostali dani:</label>
                            <div>
                                {{ slotProps.data.remaining_days }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-4 field">
                            <label>Interval:</label>
                            <div>
                                {{ slotProps.data.plan?.name }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-4 field">
                            <label>Kreirao:</label>
                            <div>
                                {{ slotProps.data.created_by_user?.name }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-4 field">
                            <label>Kreiran:</label>
                            <div>
                                {{ slotProps.data.created_at_formated }}
                            </div>
                        </div>
                    </div>
                </template>
                <Column >
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-outlined p-button-sm action-table-btn" @click="selectItem(slotProps.data.id)"/>
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-sm p-button-warning action-table-btn delete-btn" @click="confirmDeleteResource(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useUserStore } from "@admin/stores/user";
import { useFreeTrialStore } from "@admin/stores/freeTrial";
import FreeTrialForm from "../FreeTrialForm.vue"

const userStore = useUserStore();
const freeTrialStore = useFreeTrialStore();
const { user, loading } = storeToRefs(userStore);
const { freeTrials, freeTrialsTotal } = storeToRefs(freeTrialStore);
const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const toast = useToast();
const expandedRows = ref([]);
const selectedId = ref(null);
const userId = ref(null);
const showForm = ref(false);

const sort = ref({
    sortField: "sortField" in route.query ? route.query.sortField : "created_at",
    sortOrder: "sortOrder" in route.query ? route.query.sortOrder : -1,
});

const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'user_id': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

watch( user, (newVal, oldVal) => {
    if (user.value) {
        userId.value = user.value.id;
    }
}, { immediate: true });

onBeforeMount( () => {
    if(route.params.userId){
        filters.value.user_id.value = route.params.userId;
        freeTrialStore.getFreeTrials({sort: sort.value, filters: filters.value});
    }
});

const translateStatus = (status) => {
    if (status === "active") return "Aktivan";
    if (status === "expired") return "Istekao";
    if (status === "canceled") return "Otkazan";
    return status;
}

const openForm = () => {
    showForm.value = true;
    selectedId.value = null;
};

const saved = () => {
    
};

const selectItem = (id) => {
    selectedId.value = id;
    showForm.value = true;
};

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
    freeTrialStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Probni period je obrisan.', life: 3000});
            userStore.getUserProfile(userId.value);
        })
        .catch((err) => {
            console.log(err);
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

</script>

<style lang="scss" scoped>
.free-trial-list-tab {
    label { 
        font-size: 14px;
        color: var(--text-light-color);
    }
   .success { color: var(--success-color)}
   .error { color: var(--error-color)}
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
}
</style>
