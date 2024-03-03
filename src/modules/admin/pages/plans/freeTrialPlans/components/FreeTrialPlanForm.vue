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
                    <span class="p-float-label">
                        <InputText id="days" type="text" v-model="form.days" :class="{'p-invalid': formErrors.days}"/>
                        <label for="name-help">Dani</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.days}}</small>
                </div>
            </div>

            <template #footer>
                <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
                <Button :label="props.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useFreeTrialStore } from '@admin/stores/freeTrial'

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

const freeTrialStore = useFreeTrialStore();
const { freeTrialPlan, loading } = storeToRefs(freeTrialStore);
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.id ? 'Izmeni plan' : 'Dodaj novi plan');
const form = reactive({
    name: "",
    key: "",
    days: "",
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    //fetch form data
    if (props.id) {
        freeTrialStore.getFreeTrialPlan(props.id);
    }
});

//formData
watch( freeTrialPlan, (newVal, oldVal) => {
    setFormData(newVal);
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

const formErrors = reactive({
    name: "",
    key: "",
    days: "",
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (freeTrialPlan.value.hasOwnProperty(field)) {
                const formDataField = freeTrialPlan.value[field];
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
    form.days = "";
    clearFormErrors();
};

const clearFormErrors = () => { 
    formErrors.name = "";
    formErrors.key = "";
    formErrors.days = "";
}

const save = async () => {
    clearFormErrors();
    //Update
    if(props.id)
    {
        freeTrialStore.updatePlan(props.id, form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Probni period je ažurirana!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        freeTrialStore.createPlan(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi probni period!', detail: form.title, life: 3000});
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