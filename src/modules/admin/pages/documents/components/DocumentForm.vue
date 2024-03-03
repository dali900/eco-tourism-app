<template>
    <div class="document-form">
        <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
            <template #header>
                <h3>{{formName}}</h3>
            </template>

            <div class="app-form flex flex-column">
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="title" type="text" v-model="form.title" :class="{'p-invalid': formErrors.title}"/>
                        <label for="name-help">Naslov</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.title}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="author" type="text" v-model="form.author" :class="{'p-invalid': formErrors.author}"/>
                        <label for="name-help">Autor</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.author}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.document_type_id}">Vrsta dokumenta</label>
                    <div>
                        <Dropdown 
                            v-model="form.document_type_id" 
                            placeholder="" 
                            filterPlaceholder="Pretraži vrste dokumenata"
                            :options="documentTypes" 
                            optionLabel="name" 
                            optionValue="id" 
                            :filter="true" 
                            :showClear="true" 
                            :class="{'p-invalid': formErrors.document_type_id}"
                            class="document-type-dropdown"
                            @filter="onFilterDocumentType"
                        />
                    </div>
                    <small class="p-error">{{formErrors.document_type_id}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="comment" type="text" v-model="form.comment" :class="{'p-invalid': formErrors.comment}"/>
                        <label for="name-help">Napomena</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.comment}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <Calendar id="publish_date" v-model="form.publish_date" dateFormat="dd.mm.yy." :class="{'p-invalid': formErrors.publish_date}"/>
                        <label for="name-help">Datum objavljivanja</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.publish_date}}</small>
                </div>
                <div class="field flex flex-column">
                    <FileUpload v-if="!form.document_path"
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
                            <span :title="form.document_path">
                                <span v-if="!formData || (!formData.document_path)" class="file-not-saved">*</span>
                                    {{form.document_path}}
                            </span> 
                            <Button icon="pi pi-trash" @click="confirmDeleteFile" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                        </div>
                    </div>
                    <small id="name-help" class="p-error">{{formErrors.document_path}}</small>
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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useDocumentStore } from '../@admin/stores/document';
import Calendar from 'primevue/calendar';
import { FilterMatchMode } from 'primevue/api';
import { useAuthStore } from '@/stores/auth';
import { useFileStore } from '@admin/stores/file';

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

const baseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = baseUrl + '/api/files/upload';
const maxFileSize = 1000000 * 10; //10MB
const documentStore = useDocumentStore();
const { documentTypes, loading } = storeToRefs(documentStore);
const timer = ref(null);
const authStore = useAuthStore();
const fileStore = useFileStore();
const { token, authToken } = storeToRefs(authStore)
const openDialog = ref(false);
const showConfirmation = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni dokument' : 'Dodaj novi dokument');
const form = reactive({
    title: "",
    author: "",
    comment: "",
    publish_date: "",
    document_type: "",
    document_path: "",
    document_type_id: ""
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
});

//formData
watch( () => props.formData, (newVal, oldVal) => {
    setFormData(newVal);
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

onMounted(() => {
    
});

const formErrors = reactive({
    title: "",
    author: "",
    comment: "",
    publish_date: "",
    document_path: "",
    document_type_id: ""
});

const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
documentStore.getDocumentTypes({filters: filters.value});

const onFilterDocumentType = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        documentStore.getDocumentTypes({filters: filters.value});
    },400);
};

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
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
    clearForm();
    openDialog.value = false;
};

const onFormClose = () => {
    clearForm();
}

const clearForm = () => {
    form.title = "";
    form.author = "";
    form.comment = "";
    form.publish_date = "";
    form.document_path = "";
    form.document_type_id = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.author = "";
    formErrors.comment = "";
    formErrors.publish_date = "";
    formErrors.document_path = "";
    formErrors.document_type_id = "";
    formErrors.default = "";
};

const save = async () => {
    if(form.publish_date && typeof(form.publish_date) !== "string")
    {
        let month = form.publish_date.getMonth() + 1;
        let year = form.publish_date.getFullYear();
        let day = form.publish_date.getDate();
        form.publish_date = day + '.' + month + '.' + year + '.';
    }

    //Update
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        
        documentStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Dokument je ažuriran!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        documentStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi dokument!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

const onUpload = (event) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form.document_path = response.data.file_path;
    }
};

const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
};

const confirmDeleteFile = (data) => {
    //when creating new resource we can delete temp files without confirmation
    if(!props.formData || !props.formData.document_path){
        deleteFile();
    } else {
        showConfirmation.value = true;
    }
};

const deleteFile = async () => {
    if(props.formData && props.formData.document_path){
        //delete saved file
        await documentStore.deleteFile(props.formData.id);
        form.document_path = "";
        showConfirmation.value = false;
    } else if (form.document_path) {
        //delete temp file
        await fileStore.deleteTmpFile(form.document_path);
        form.document_path = "";
        showConfirmation.value = false;
    }
};

</script>

<style lang="scss">
.p-dialog {
    width: 80%;
    .field {
        width: 100%;
        margin-top: 1.2rem;
        margin-bottom: 0px;
    }
}
.document-type-dropdown{
    width: 100%;
}
.p-dropdown-panel {
    z-index: 1;
}
.file-not-saved {
    color: var(--orange-600)
}
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
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>