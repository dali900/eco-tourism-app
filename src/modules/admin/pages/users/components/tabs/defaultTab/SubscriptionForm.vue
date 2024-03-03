<template>
    <div class="password-form">
        <Dialog v-model:visible="openDialog" appendTo="self" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
            <template #header>
                <h3>{{formName}}</h3>
            </template>

            <div class="app-form flex flex-column">
                <div class="field flex flex-column">
                    <label for="subscription_plan_id" :class="{'p-error': formErrors.subscription_plan_id}">Model plana</label>
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
                    <label for="start_date" :class="{'p-error': formErrors.start_date}">Početak plana</label>
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
            </div>

            <template #footer>
                <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
                <Button :label="props.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save"/>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useSubscriptionStore } from '@admin/stores/subscription'
import { useUserStore } from "@admin/stores/user";
import dateTool from '@/util/dateTool'

const props = defineProps({
    modelValue: {
        default: false
    },
    id: {
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const { subscription, subscriptionPlans, intervals, loading} = storeToRefs(subscriptionStore);
const { user } = storeToRefs(userStore);
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.id ? 'Izmena pretplate' : 'Nova pretplata');

const form = reactive({
    subscription_plan_id: "",
    start_date: "",
    start_date_formated: "",
    end_date: "",
    end_date_formated: "",
    active: "",
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    if (newVal) {
        subscriptionStore.getSubscriptionPlans();
    }
    //fetch form data
    if (props.id) {
        subscriptionStore.getSubscription(props.id);
    }
});

//formData
watch( subscription, (newVal, oldVal) => {
    setFormData(newVal);
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

const formErrors = reactive({
    subscription_plan_id: "",
    start_date: "",
    end_date: "",
    active: "",
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (subscription.value.hasOwnProperty(field)) {
                const formDataField = subscription.value[field];
                form[field] = formDataField;
            }
        }
    } 
}

const closeForm = () => {
    clearForm();
    openDialog.value = false;
};

const onFormClose = () => {
    clearForm();
}

const clearForm = () => {
    form.subscription_plan_id = "";
    form.start_date = "";
    form.start_date_formated = "";
    form.end_date = "";
    form.end_date_formated = "";
    form.active = "";
    formErrors.subscription_plan_id = "";
    formErrors.start_date = "";
    formErrors.end_date = "";
    formErrors.active = "";
};

const formateDateFields = () => {
    form.start_date = dateTool.toDbFormat(form.start_date_formated);
}

const save = async () => {
    //Update
    if(props.id)
    {
        subscriptionStore.update(props.id, form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Pretplata je ažurirana!', detail: form.title, life: 3000});
                user.value.subscription = responseData.subscription;
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        subscriptionStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreirana nova pretplata!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};


</script>

<style lang="scss">

.p-dialog {
    .field {
        width: 100%;
        margin-top: 1.2rem;
        margin-bottom: 0px;
    }
}
.p-dropdown.p-component.p-inputwrapper {
    width: 100%;
}
</style>