<template>
    <div class="news-form">
        <Dialog v-model:visible="openDialog" appendTo="self" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
            <template #header>
                <h3>{{formName}}</h3>
            </template>

            <div class="app-form flex flex-column">
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}"/>
                        <label for="name-help">Naziv</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.name}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="key" type="text" v-model="form.key" :class="{'p-invalid': formErrors.key}"/>
                        <label for="name-help">Ključ</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.key}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="interval" :class="{'p-error': formErrors.interval}">Interval</label>
                    <div>
                        <Dropdown v-model="form.interval" 
                            placeholder="Izaberi interval" 
                            inputId="interval"
                            optionLabel="name" 
                            optionValue="value" 
                            :options="intervals" 
                            :showClear="true" 
                            :class="{'p-invalid': formErrors.interval}"
                        />
                    </div>
                    <small class="p-error">{{formErrors.interval}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="amount" type="text" v-model="form.amount" :class="{'p-invalid': formErrors.amount}"/>
                        <label for="name-help">Iznos</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.amount}}</small>
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
import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useSubscriptionStore } from '@admin/stores/subscription'

const props = defineProps({
    modelValue: {
        default: false
    },
    id: {
        default: null
    },
    formData: {
        default: null
    },
});

const emit = defineEmits(['update:modelValue', 'saved']);

const subscriptionStore = useSubscriptionStore();
const { subscriptionPlan, intervals, loading} = storeToRefs(subscriptionStore);
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.id ? 'Izmeni plan' : 'Dodaj novi plan');
const form = reactive({
    name: "",
    key: "",
    interval: "",
    amount: "",
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    //fetch form data
    if (props.id) {
        subscriptionStore.getSubscriptionPlan(props.id);
    }
});

//formData
watch( subscriptionPlan, (newVal, oldVal) => {
    setFormData(newVal);
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

const formErrors = reactive({
    name: "",
    key: "",
    interval: "",
    amount: "",
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (subscriptionPlan.value.hasOwnProperty(field)) {
                const formDataField = subscriptionPlan.value[field];
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
    form.name = "";
    form.key = "";
    form.interval = "";
    form.amount = "";
    clearFormErrors();
};

const clearFormErrors = () => { 
    formErrors.name = "";
    formErrors.key = "";
    formErrors.interval = "";
    formErrors.amount = "";
}

const save = async () => {
    clearFormErrors();
    //Update
    if(props.id)
    {
        subscriptionStore.updatePlan(props.id, form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Plan je ažurirana!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        subscriptionStore.createPlan(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi plan!', detail: form.title, life: 3000});
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