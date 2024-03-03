<template>
    <div class="article-form">
        <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}">
            <template #header>
                <h3>{{formName}}</h3>
            </template>

            <div class="app-form flex flex-column">
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}" @keyup.enter="save"/>
                        <label for="name-help">Naziv</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.name}}</small>
                </div>
                <div class="field flex flex-column">
                    <Dropdown v-model="form.parent_id" 
                        placeholder="Nadtip" 
                        inputId="parent_id"
                        optionLabel="name_parent_name" 
                        optionValue="id" 
                        :options="categoriesFiltered" 
                        :showClear="true" 
                        :class="{'p-invalid': formErrors.parent_id}"
                    />
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
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useArticleStore } from '@admin/stores/article'

const props = defineProps({
    modelValue: {
        default: false
    },
    hideFields: {
        default: null
    },
    formData: {
        default: null
    },
});

const emit = defineEmits(['update:modelValue', 'saved']);

const articleStore = useArticleStore();
const { articleTypes, loading } = storeToRefs(articleStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni kategoriju članka' : 'Dodaj novu kategoriju članka');
const form = reactive({
    name: "",
    parent_id: ""
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

const categoriesFiltered = computed(() => articleTypes.value.filter( r => r.id != props.formData?.id ));

onMounted(() => {
    
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

const closeForm = () => {
    openDialog.value = false;
};

const clearForm = () => {
    form.name = "";
    form.parent_id = "";
    formErrors.name = "";
    formErrors.parent_id = "";
    formErrors.default = "";
};

const save = async () => {
    //Update
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        articleStore.updateType(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kategorija članka je ažurirana!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
            })
    } 
    //Create
    else 
    {
        articleStore.createType(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreirana novia kategorija članka!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};



</script>

<style lang="scss">
.p-dialog {
    width: 60%;
    .field {
        width: 100%;
        margin-top: 1.2rem;
        margin-bottom: 0px;
    }
}
</style>