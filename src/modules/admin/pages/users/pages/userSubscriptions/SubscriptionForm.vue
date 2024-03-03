<template>
    <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="closeForm">
        <template #header>
            <h3>{{ subscritpionId ? 'Izmeni pretplatu' : 'Dodaj novu pretplatu' }}</h3>
        </template>

        <div class="subscription-form">
            <div class="field flex flex-column">
                <label for="app" :class="{'p-error': formErrors.app}">Portal *</label>
                <div>
                    <Dropdown v-model="form.app" 
                        placeholder="Izaberi portal" 
                        inputId="app"
                        optionLabel="title" 
                        optionValue="appName" 
                        :options="userApps" 
                        :showClear="true" 
                        :class="{'p-invalid': formErrors.app}"
                    />
                </div>
                <small class="p-error">{{formErrors.app}}</small>
            </div>
            <div class="field flex flex-column">
                <label for="subscription_plan_id" :class="{'p-error': formErrors.subscription_plan_id}">Plan *</label>
                <div>
                    <Dropdown v-model="form.subscription_plan_id" 
                        placeholder="Izaberi model plan" 
                        inputId="subscription_plan_id"
                        optionLabel="name" 
                        optionValue="id" 
                        :options="subscriptionPlans" 
                        :showClear="true" 
                        :class="{'p-invalid': formErrors.subscription_plan_id}"
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
            <div class="field flex flex-column">
                <label for="note" :class="{'p-error': formErrors.note}">Napomena</label>
                <div>
                    <Textarea 
                        id="phone_number"
                        type="textarea"
                        v-model="form.note"
                        :class="{ 'p-invalid': formErrors.note }"
                        @keyup.enter="save"
                    />
                </div>
                <small class="p-error">{{formErrors.note}}</small>
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
            <div v-if="subscription && props.subscritpionId">
                <div>
                    <small>Ističe: {{ subscription.end_datetime_formated }}</small>
                </div>
                <div>
                    <small>Preostali dani: {{ subscription.remaining_days }}</small>
                </div>
                <div>
                    <small>Status: {{ subscription.status }}</small>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
            <Button :label="props.formData && props.formData.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save" autofocus />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useSubscriptionStore } from '@admin/stores/subscription'
import { useUserStore } from '@admin/stores/user'
import dateTool from '@/util/dateTool'
import { getSelectedApp } from '@admin/util/general'
import { getUserAppsArray } from '@/util/general'

const userApps = getUserAppsArray();

const props = defineProps({
    modelValue: {
        default: false
    },
    subscritpionId: {
        default: null
    },
    userId: {
        default: null
    },
});

const emit = defineEmits(['update:modelValue', 'created', 'updated', 'saved']);

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const { subscription, subscriptionPlans, loading } = storeToRefs(subscriptionStore)
const toast = useToast();
const openDialog = ref(false);

const form = reactive({
    user_id: "",
    subscription_plan_id: null,
    start_date: "",
    start_date_formated: "",
    end_date: "",
    end_date_formated: "",
    active: "",
    note: "",
    app: getSelectedApp(),
});

const formErrors = reactive({
    user_id: "",
    subscription_plan_id: "",
    start_date: "",
    end_date: "",
    active: "",
    note: "",
    app: ""
});

onBeforeMount( () => {
    subscriptionStore.getSubscriptionPlans();
});

//modelValue
watch( [() => props.modelValue, () => props.subscritpionId], (newValX, newValY) => {
    openDialog.value = props.modelValue;
    if (props.subscritpionId) {
        subscriptionStore.getSubscription(props.subscritpionId)
    } 
});

//formData
watch( [subscription, () => props.subscritpionId], (newVal, oldVal) => {
    //click on update form 
    if(subscription && props.subscritpionId)
    {
        setFormData(subscription.value);
    }
});

watch( () => props.userId, (newVal, oldVal) => {
    form.user_id = newVal;
},{ immediate: true });


//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});


const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (formData.hasOwnProperty(field)) {
                const formDataField = formData[field];
                form[field] = formDataField;
            }
        }
    } 
}

const clearForm = () => {
    form.subscription_plan_id = null;
    form.start_date = "";
    form.start_date_formated = "";
    form.end_date = "";
    form.end_date_formated = "";
    form.active = "";
    form.note = "";
    form.app = getSelectedApp();
    clearErrors();
    subscriptionStore.subscription = null;
};

const clearErrors = () => {
    formErrors.user_id = "";
    formErrors.subscription_plan_id = "";
    formErrors.start_date = "";
    formErrors.end_date = "";
    formErrors.active = "";
    formErrors.note = "";
    formErrors.default = "";
    formErrors.app = "";
}

const formateDateFields = () => {
    form.start_date = dateTool.toDbFormat(form.start_date_formated);
    form.end_date = dateTool.toDbFormat(form.end_date_formated);
}

const save = async () => {
    clearErrors();
    formateDateFields();
    //Update
    if(subscription.value)
    {
        subscriptionStore.update(subscription.value.id, form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Pretplata je ažurirana!', detail: form.title, life: 3000});
                userStore.getUserProfile(props.userId);
                closeForm();
                emit('saved', responseData.subscription);
            })
            .catch((e) => {
                console.log(e);
                closeForm();
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        subscriptionStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreirana nova pretplata!', detail: form.title, life: 3000});
                closeForm();
                emit('saved', responseData.subscription);
                userStore.deactivateFreeTrial();
                userStore.getUserProfile(props.userId);
            })
            .catch((e) => {
                console.log(e);
                closeForm();
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

const closeForm = () => {
    openDialog.value = false; //dialog already sets to flase
    clearForm();
    emit('update:modelValue', false);
    subscriptionStore.subscription = null;
}

</script>

<style lang="scss" scoped>
:deep(.calendar-field),
:deep(.p-inputtext),
:deep(.p-dropdown) {
    width: 100%;
}
</style>