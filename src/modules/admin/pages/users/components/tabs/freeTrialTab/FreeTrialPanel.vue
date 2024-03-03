<template>
    <Panel :header="headerTitle" class="free-trial-panel a-shadow">
        <div class="user-form">
            <div class="field flex flex-column">
                <label for="free_trial_plan_id" :class="{'p-error': formErrors.free_trial_plan_id}">Plan *</label>
                <div>
                    <Dropdown v-model="form.free_trial_plan_id" 
                        placeholder="Izaberi model plan" 
                        inputId="free_trial_plan_id"
                        optionLabel="name" 
                        optionValue="id" 
                        :options="freeTrialPlans" 
                        :showClear="true" 
                        :class="{'p-invalid': formErrors.free_trial_plan_id}"
                    />
                </div>
                <small class="p-error">{{formErrors.interval}}</small>
            </div>
            <div class="field flex flex-column">
                <label for="start_date" :class="{'p-error': formErrors.start_date}">Početak</label>
                <div>
                    <Calendar inputId="start_date" v-model="form.start_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                </div>
                <small class="p-error">{{formErrors.start_date}}</small>
            </div>
            <div class="field flex flex-column">
                <label for="end_date" :class="{'p-error': formErrors.end_date}">Ističe</label>
                <div>
                    <Calendar inputId="end_date" v-model="form.end_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.end_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                </div>
                <small class="p-error">{{formErrors.end_date}}</small>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <div>
                        <Checkbox
                            inputId="active"
                            v-model="form.active"
                            :trueValue="1"
                            :falseValue="0"
                            :binary="true"
                            :class="{ 'p-invalid': formErrors.active }"
                        />&nbsp;
                        <label for="active">Aktivan</label>
                    </div>
                    <small id="active-help" class="p-error">{{
                        formErrors.active
                    }}</small>
                </div>
            </div>
            <div>
                <small class="p-error">{{ formErrors.default }}</small>
            </div>
            <div v-if="freeTrial">
                <div>
                    <small>Ističe: {{ freeTrial.end_datetime_formated }}</small>
                </div>
                <div>
                    <small>Preostali dani: {{ freeTrial.remaining_days }}</small>
                </div>
                <div>
                    <small>Status: {{ freeTrial.status }}</small>
                </div>
            </div>
            <div class="flex justify-content-between mt-2">
                <Button
                    :label="freeTrial ? 'Ažuriraj' : 'Sačuvaj'"
                    :loading="loading"
                    @click="save"
                    icon="pi pi-save"
                />
                <Button v-if="freeTrial" 
                    icon="pi pi-trash" 
                    severity="danger" 
                    class="p-button-text p-button-danger p-button-rounded delete-free-trial-plan" 
                    title="Obriši plan"
                    @click="confirmDeleteResource(freeTrial.id)"/>
            </div>
        </div>
    </Panel>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useFreeTrialStore } from '@admin/stores/freeTrial'
import { useUserStore } from "@admin/stores/user";
import { useConfirm } from "primevue/useconfirm";
import Panel from 'primevue/panel';
import dateTool from '@/util/dateTool'

const freeTrialStore = useFreeTrialStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore)
const { freeTrialPlans, loading } = storeToRefs(freeTrialStore)
const openDialog = ref(false);
const confirm = useConfirm();
const toast = useToast();

const form = reactive({
    user_id: "",
    free_trial_plan_id: "",
    start_date: "",
    start_date_formated: "",
    end_date: "",
    end_date_formated: "",
    active: "",
});

onBeforeMount( () => {
    freeTrialStore.getFreeTrialPlans();
});

const freeTrial = computed( () => user.value?.free_trial );
const activeFreeTrial = computed( () => user.value?.free_trial?.active );
const headerTitle = computed( () => freeTrial?.value ? "Probni period" : "Kreiraj probni period");

//changes when subscription is created
watch( freeTrial, (newVal, oldVal) => {
    setFormData(freeTrial);
});

//changes when subscription is created
watch( activeFreeTrial, (newVal, oldVal) => {
    form.active = newVal;
});

watch( user, (newVal, oldVal) => {
    if(user.value) {
        form.user_id = user.value.id
    }
});

const formErrors = reactive({
    user_id: "",
    free_trial_plan_id: "",
    start_date: "",
    end_date: "",
    active: "",
});

const setFormData = (formData) => {
    if(formData && freeTrial.value){
        for (const field in form) {
            if (freeTrial.value.hasOwnProperty(field)) {
                const formDataField = freeTrial.value[field];
                form[field] = formDataField;
            }
        }
    } 
}

const clearForm = () => {
    form.free_trial_plan_id = "";
    form.start_date = "";
    form.start_date_formated = "";
    form.end_date = "";
    form.end_date_formated = "";
    form.active = "";
    clearErrors();
};

const clearErrors = () => {
    formErrors.user_id = "";
    formErrors.free_trial_plan_id = "";
    formErrors.start_date = "";
    formErrors.end_date = "";
    formErrors.active = "";
    formErrors.default = "";
}

const formateDateFields = () => {
    form.start_date = dateTool.toDbFormat(form.start_date_formated);
    form.end_date = dateTool.toDbFormat(form.end_date_formated);
}

const save = async () => {
    clearErrors();
    formateDateFields();
    //Update
    if(freeTrial.value)
    {
        freeTrialStore.update(freeTrial.value.id, form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Probni period je ažurirana!', detail: form.title, life: 3000});
                user.value.free_trial = responseData.free_trial;
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        freeTrialStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreiran novi probni period!', detail: form.title, life: 3000});
                user.value.free_trial = responseData.free_trial;
            })
            .catch((e) => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
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
            toast.add({severity:'success', summary: 'Plan obrisan.', life: 3000});
            user.value.free_trial = null;
            clearForm();
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

</script>

<style scoped>
.calendar-field {
    width: 100%;
}
.delete-free-trial-plan {
    visibility: hidden;
}
.free-trial-panel:hover .delete-free-trial-plan {
    visibility: visible;
}
.delete-free-trial-plan {
    visibility: hidden;
}
.free-trial-panel:hover .delete-free-trial-plan {
    visibility: visible;
}
.p-dropdown.p-component.p-inputwrapper {
    width: 100%;
}
</style>