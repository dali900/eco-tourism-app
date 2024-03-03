<template>
    <div class="default-tab p-3">
        <FreeTrialForm v-model="showFreeTrialForm" :userId="user?.id" />
        <h4 class="mt-0">Probni period</h4>
        <Card v-if="showForm">
            <template #content>
                <div class="user-form">
                    <div class="grid">
                        <div class="col-12 field">
                            <div class="mb-2">
                                <label
                                    for="app"
                                    :class="{ 'p-error': formErrors.app }">
                                    Portal *
                                </label>
                            </div>
                            <Dropdown
                                v-model="form.app"
                                class="plans-dropdown"
                                placeholder="Izaberi portal"
                                inputId="app"
                                optionLabel="title"
                                optionValue="appName"
                                :options="userApps"
                                :showClear="true"
                                :class="{ 'p-invalid': formErrors.app }"
                            />
                            <small class="p-error">{{ formErrors.app }}</small>
                        </div>
                        <div class="col-12 field">
                            <div class="mb-2">
                                <label
                                    for="free_trial_plan_id"
                                    :class="{ 'p-error': formErrors.free_trial_plan_id }">
                                    Plan *
                                </label>
                            </div>
                            <Dropdown
                                v-model="form.free_trial_plan_id"
                                class="plans-dropdown"
                                placeholder=""
                                inputId="free_trial_plan_id"
                                optionLabel="name"
                                optionValue="id"
                                :options="freeTrialPlans"
                                :showClear="true"
                                :class="{ 'p-invalid': formErrors.free_trial_plan_id }"
                            />
                            <small class="p-error">{{ formErrors.free_trial_plan_id }}</small>
                        </div>
                        <div class="col-12 field">
                            <label 
                                for="start_date" 
                                :class="{'p-error': formErrors.start_date}">
                                Datum početak *
                            </label>
                            <div>
                                <Calendar 
                                    class="calendar-field"
                                    inputClass="calendar-input"
                                    inputId="start_date" 
                                    v-model="form.start_date_formated" 
                                    dateFormat="dd.mm.yy." 
                                    :inputClass="formErrors.start_date ? 'p-invalid' : ''" 
                                    @keyup.enter="save" 
                                />
                            </div>
                            <small class="p-error">{{formErrors.start_date}}</small>
                        </div>
                        <div class="col-12 field">
                            <label 
                                for="end_date" 
                                :class="{'p-error': formErrors.end_date}">
                                Datum završetka *
                            </label>
                            <div>
                                <Calendar 
                                    class="calendar-field"
                                    inputClass="calendar-input"
                                    inputId="start_date" 
                                    v-model="form.end_date_formated" 
                                    dateFormat="dd.mm.yy." 
                                    :inputClass="formErrors.end_date ? 'p-invalid' : ''" 
                                    @keyup.enter="save" 
                                />
                            </div>
                            <small class="p-error">{{formErrors.end_date}}</small>
                        </div>
                        <div class="col-12">
                            <div class="mb-2">
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
                                <small id="active-help" class="p-error">{{ formErrors.active }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="options flex justify-content-end">
                        <div class="mr-2">
                            <Button
                                label="Nazad"
                                :loading="loading"
                                @click="setShowForm(false)"
                                icon="pi pi-arrow-left"
                            />
                        </div>
                        <div class="mr-2">
                            <Button
                                :label="freeTrial ? 'Ažuriraj' : 'Sačuvaj'"
                                :loading="loading"
                                @click="save"
                                icon="pi pi-save"
                            />
                        </div>
                        <div>
                            <Button v-if="freeTrial"
                                class="delete-btn" 
                                icon="pi pi-trash" 
                                severity="warning" 
                                aria-label="Notification" 
                                @click="confirmDeleteResource(freeTrial.id)"
                            />
                        </div>      
                    </div>
                </div>
            </template>
        </Card>
        <Card v-if="!showForm && freeTrial">
            <template #content>
                <div class="user-preview">
                    <div class="grid">
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Plan:</label>
                            <div class="data">{{ freeTrial.plan.name }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Datum početka:</label>
                            <div class="data">{{ freeTrial.start_date_formated }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Datum završetka:</label>
                            <div class="data">{{ freeTrial.end_date_formated }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Activan:</label>
                            <div class="data" :class="{'success': freeTrial.active, 'error': !freeTrial.active}">
                                {{ freeTrial.active ? 'Da' : 'Ne' }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <small>Ističe: {{ freeTrial.end_datetime_formated }}</small>
                    </div>
                    <div>
                        <small>Preostali dani: {{ freeTrial.remaining_days }}</small>
                    </div>
                    <div>
                        <small>Status: {{ freeTrial.status }}</small>
                    </div>
                    <div class="col-12 field">
                        <Button label="Izmeni" icon="pi pi-pencil" outlined severity="info" @click="setShowForm(true)"/>
                    </div>
                </div>
            </template>
        </Card>
        <div v-if="loading">Ucitava se...</div>
        <div v-else-if="!freeTrial && !showForm" class="no-free-trial">
            Korisnik nema probni period 
            <div>
                <Button label="Kreiraj" icon="pi pi-plus" outlined severity="info" @click="setShowForm(true)"/>
            </div>
        </div>
        <div v-if="freeTrial && !showForm" class="mt-2">
            <Button label="Dodaj novi" icon="pi pi-plus" outlined severity="info" @click="setShowFreeTrialForm(true)"/>
        </div>
        
    </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useFreeTrialStore } from '@admin/stores/freeTrial'
import { useUserStore } from "@admin/stores/user";
import dateTool from '@/util/dateTool'
import { getSelectedApp } from '@admin/util/general'
import { getUserAppsArray } from '@/util/general'
import FreeTrialForm from '../FreeTrialForm.vue'

const userApps = getUserAppsArray();
const freeTrialStore = useFreeTrialStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore)
const { freeTrial, freeTrialPlans, loading } = storeToRefs(freeTrialStore)
const confirm = useConfirm();
const toast = useToast();
const route = useRoute();

const showForm = ref(false);
const showFreeTrialForm = ref(false);

const form = reactive({
    user_id: "",
    free_trial_plan_id: null,
    start_date: "",
    start_date_formated: "",
    end_date: "",
    end_date_formated: "",
    active: "",
    app: getSelectedApp(),
});
const formErrors = reactive({
    user_id: "",
    free_trial_plan_id: "",
    start_date: "",
    end_date: "",
    active: "",
    app: "",
});

const clearForm = () => {
    form.free_trial_plan_id = null;
    form.start_date = "";
    form.start_date_formated = "";
    form.end_date = "";
    form.end_date_formated = "";
    form.active = "";
    form.app = "";
    clearErrors();
};

const clearErrors = () => {
    formErrors.user_id = "";
    formErrors.free_trial_plan_id = "";
    formErrors.start_date = "";
    formErrors.end_date = "";
    formErrors.active = "";
    formErrors.app = "";
    formErrors.default = "";
}

const setShowForm = (value) => {
    showForm.value = value;
};

//create another free trial
const setShowFreeTrialForm = (value) => {
    showFreeTrialForm.value = value;
};


onMounted( () => {
    if (user.value && user.value.free_trial) {
        setFormData(user.value.free_trial);
    }
})

onBeforeMount( () => {
    freeTrialStore.getFreeTrialPlans();
    freeTrialStore.getUserFreeTrial(route.params.userId);
});

watch( freeTrial, (newVal, oldVal) => {
    setFormData(freeTrial.value);
});

watch( user, (newVal, oldVal) => {
    if(user.value) {
        form.user_id = user.value.id
    }
}, {immediate: true});

const setFormData = (formData) => {
    console.log(formData);
    if (formData) {
        for (const field in form) {
            if (formData.hasOwnProperty(field)) {
                const formDataField = formData[field];
                form[field] = formDataField;
            }
        }
    }
};

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
                setFormData(responseData.free_trial);
                userStore.getUserProfile(form.user_id);
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        toast.add({severity:'info', summary: 'Kreiran novi probni period!', detail: 'Šalje se email notifikacija...', life: 4000});
        freeTrialStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Notifikacija je poslata korisniku!', detail: form.title, life: 3000});
                setFormData(responseData.free_trial);
                userStore.getUserProfile(form.user_id);
            })
            .catch((e) => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
    setShowForm(false);
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
    clearForm();
    setShowForm(false);
    freeTrialStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Plan obrisan.', life: 3000});
            user.value.free_trial = null;
            userStore.getUserProfile(form.user_id);
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}
</script>

<style lang="scss" scoped>
.default-tab {
    .user-preview {}
    :deep(.p-inputtext),
    :deep(.p-dropdown) {
        min-width: 225px;
    }
    :deep(.calendar-input) {
        min-width: 264px;
    }
}
:deep(.field) {
    margin-bottom: 4px;
    label {
        font-size: 14px;
        color: var(--text-light-color);
    }
    .data {
        color: var(--text-primary-color);
    }
}
:deep(.success) { color: var(--success-color) !important }
:deep(.error) { color: var(--error-color) !important }
</style>
