<template>
    <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="onHide">
        <template #header>
            <h3>{{ form.name ? 'Izmeni' : 'Dodaj novu kategoriju'}}</h3>
        </template>

        <div class="app-form flex flex-column">
            <div class="field flex flex-column">
                <span class="p-float-label">
                    <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}" @keyup.enter="save"/>
                    <label for="name-help">Naziv</label>
                </span>
                <small id="name-help" class="p-error">{{formErrors.name}}</small>
            </div>
            <div>
                <small class="p-error">{{formErrors.default}}</small>
            </div>
        </div>

        <template #footer>
            <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
            <Button :label="props.formData && props.formData.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save" autofocus />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useAttractionStore } from '@/stores/attraction'

const props = defineProps({
    modelValue: {
        default: false
    },
    formData: {
        default: null
    },
    categoryStore: {
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'created', 'updated']);

const attractionStore = useAttractionStore();
const { loading } = storeToRefs(attractionStore)
const openDialog = ref(false);
const toast = useToast();

const form = reactive({
    name: "",
    parent_id: null
});
const formErrors = reactive({
    name: "",
    parent_id: ""
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    //reopens empty form again (if prev had errors then clear form)
    if(!props.formData){
        clearForm();
    }
});

//formData
watch( () => props.formData, (newVal, oldVal) => {
    //click on update form 
    if(newVal)
    {
        setFormData(newVal);
    }
    //add new resource
    else 
    {
        clearForm();
    }
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (props.formData.hasOwnProperty(field)) {
                const formDataField = props.formData[field];
                form[field] = formDataField;
            }
        }
    } 
}

const closeAndClearForm = () => {
    clearForm();
    closeForm();
};

const closeForm = () => {
    openDialog.value = false;
};

const clearForm = () => {
    form.name = "";
    form.parent_id = null;
    formErrors.name = "";
    formErrors.parent_id = "";
    formErrors.default = "";
};

const save = async () => {
    //Update
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        props.categoryStore.updateCategory(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kategorija je ažuriran!', detail: form.name, life: 3000});
                emit('updated', responseData);
                closeAndClearForm();
            })
            .catch((err) => {
                console.log(err);
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
            })
    } 
    //Create
    else 
    {
        attractionStore.createCategory(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreiran nova kategorija!', detail: form.name, life: 3000});
                emit('created', responseData);
                closeAndClearForm();
            })
            .catch((err) => {
                console.log(err);
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const onHide = () => {
    clearForm();
}

</script>

<style>

</style>