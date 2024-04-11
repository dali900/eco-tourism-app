<template>
    <div class="regulation-form">
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
                    <span class="p-float-label">
                        <InputText id="messenger" type="text" v-model="form.messenger" :class="{'p-invalid': formErrors.messenger}" @keyup.enter="save"/>
                        <label for="messenger">Glasnik</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.messenger}}</small>
                </div>
                <div class="field flex flex-column">
                    <FileUpload v-if="!form.file_path"
                        mode="basic" 
                        name="file" 
                        chooseLabel="Okači fajl"
                        :url="uploadUrl" 
                        :auto="true" 
                        :maxFileSize="maxFileSize" 
                        @upload="onUpload" 
                        :withCredentials="true"
                        @before-send="beforeSend"
                    />
                    <div v-else>
                        <div class="delete-file">
                            <span :title="form.file_path">{{form.file_path}}</span> 
                            <Button icon="pi pi-trash" @click="confirmDeleteFile" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                        </div>
                    </div>
                    <small id="name-help" class="p-error">{{formErrors.messenger}}</small>
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
        <Dialog header="Brisanje" v-model:visible="showConfirmation" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Da li želite da nastavite?</span>
            </div>
            <template #footer>
                <Button label="Ne" icon="pi pi-times" @click="showConfirmation = false" class="p-button-text"/>
                <Button label="Da" icon="pi pi-check" @click="deleteFile" class="p-button-text" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, toRefs, toRef, unref, reactive, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useRegulationStore } from '../@admin/stores/regulation'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'

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
const baseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = baseUrl + '/api/files/upload';
const maxFileSize = 1000000 * 10; //10MB
const accept = "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*";
const emit = defineEmits(['update:modelValue', 'saved']);

const authStore = useAuthStore();
const regulationStore = useRegulationStore();
const fileStore = useFileStore();
const { regulationsTypes, loading } = storeToRefs(regulationStore)
const { token, authToken } = storeToRefs(authStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni propis' : 'Dodaj novi propis');
const formData = toRef(props, 'formData');
const showConfirmation = ref(false);
const form = reactive({
    regulation_type_id: 1, //TODO: privremeno
    name: "",
    messenger: "",
    file_path: "",
});
const formErrors = reactive({
    //regulation_type_id: null,
    name: "",
    messenger: "",
    file_path: "",
    default: ""
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

const closeAndClearForm = () => {
    clearForm();
    closeForm();
};

const closeForm = () => {
    openDialog.value = false;
};

const clearForm = () => {
    form.name = "";
    form.messenger = "";
    form.file_path = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.name = "";
    formErrors.messenger = "";
    formErrors.file_path = "";
    formErrors.default = "";
}

const save = async () => {
    //Update
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        regulationStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Propis je ažuriran!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
            })
    } 
    //Create
    else 
    {
        regulationStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi propis!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const onUpload = (event) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form.file_path = response.data.file_path;
    }
}

const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
}

const confirmDeleteFile = (data) => {
    //when creating new resource we can delete temp files without confirmation
    if(!props.formData || !props.formData.file_path){
        deleteFile();
    } else {
        showConfirmation.value = true;
    }
}

const deleteFile = async () => {
    if(props.formData && props.formData.file_path){
        //delete saved file
        await regulationStore.deleteFile(props.formData.id);
        form.file_path = "";
        showConfirmation.value = false;
    } else if (form.file_path) {
        //delete temp file
        await fileStore.deleteTmpFile(form.file_path);
        form.file_path = "";
        showConfirmation.value = false;
    }
}

</script>

<style scoped>
    .delete-file{
        height: 40px;
        display: flex;
        align-items: center;
    }
    .delete-file-btn {
        visibility: hidden;
    }
    .delete-file:hover .delete-file-btn{
        visibility: visible;
    }
    .delete-file span {
        font-size: 13px;
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>