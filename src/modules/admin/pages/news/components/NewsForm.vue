<template>
    <div class="news-form">
        <Dialog v-model:visible="openDialog" appendTo="self" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
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
                        <InputText id="subtitle" type="text" v-model="form.subtitle" :class="{'p-invalid': formErrors.subtitle}"/>
                        <label for="name-help">Podnaslov</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.subtitle}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name-help">Sažetak</label>
                    <span class="p-float-label">
                        Editor
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.summary}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name-help">Sadržaj</label>
                    <span class="p-float-label">
                        Editor
                    <small id="name-help" class="p-error">{{formErrors.text}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <Calendar id="publish_date" v-model="form.publish_date" dateFormat="dd.mm.yy." :class="{'p-invalid': formErrors.publish_date}"/>
                        <label for="name-help">Datum objavljivanja</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.publish_date}}</small>
                </div>
                <div>
                    <small class="p-error">{{formErrors.default}}</small>
                </div>
                <div class="field flex flex-column">
                    <FileUpload v-if="!form.image"
                        mode="basic" 
                        name="files[]" 
                        chooseLabel="Okači fajl"
                        accept="image/*"
                        :auto="true" 
                        :url="uploadUrl" 
                        :maxFileSize="maxFileSize" 
                        :withCredentials="true"
                        :disabled="loading"
                        @upload="onUpload($event, 'image')" 
                        @before-send="beforeSend"
                        @before-upload="beforeUpload"
                    />
                    <div v-else>
                        <div class="delete-file">
                            <div v-if="form.image">
                                <span :title="form.image.original_name">
                                    <span v-if="form.image && form.image.is_tmp" class="file-not-saved">*</span>
                                    {{form.image.original_name}}
                                </span> 
                                <Button icon="pi pi-trash" @click="confirmDeleteFile('image')" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                            </div>
                        </div>
                    </div>
                    <small id="name-help" class="p-error">{{formErrors.messenger}}</small>
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
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useNewsStore } from '@admin/stores/news';
import Calendar from 'primevue/calendar';
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
const uploadUrl = baseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 10; //10MB
const confirm = useConfirm();
const newsStore = useNewsStore();
const { loading } = storeToRefs(newsStore)
const authStore = useAuthStore();
const fileStore = useFileStore();
const { token, authToken } = storeToRefs(authStore)
const openDialog = ref(false);
const showConfirmation = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni vest' : 'Dodaj novu vest');
const form = reactive({
    title: "",
    subtitle: "",
    summary: "",
    text: "",
    publish_date: "",
    image: null,
    tmp_files: [],
});
const joditButtons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "link",
    "table",
    "hr",
    "source"
];

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
    subtitle: "",
    summary: "",
    text: "",
    publish_date: "",
    image: "",
    tmp_files: ""
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
    form.subtitle = "";
    form.summary = "";
    form.text = "";
    form.publish_date = "";
    form.image = null;
    form.tmp_files = [];
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.subtitle = "";
    formErrors.summary = "";
    formErrors.text = "";
    formErrors.publish_date = "";
    formErrors.image = "";
    formErrors.tmp_files = "";
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
        newsStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Vest je ažurirana!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        newsStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreirana nova vest!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
};

const beforeUpload = (event) => {
    event.formData.append('is_public', 1);
}

//when upload is completed
const onUpload = (event, fieldName) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form[fieldName] = response.data.files[0];
        form.tmp_files = form.tmp_files.concat(response.data.files);
    }
}

const confirmDeleteFile = (fieldName) => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje fajla',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteFile(fieldName);
        },
        //no
        reject: () => {
            
        },
        //dialog closed
        onHide: () => {
            
        }
    });
};

const deleteFile = async (fieldName) => {
    let file = form[fieldName];
    if(file && file.is_tmp){
        //delete temp file
        await fileStore.deleteTmpFile(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        const newsIndex = newsStore.news.findIndex( el => el.id == props.formData.id);
        newsStore.news[newsIndex][fieldName] = null;
    }
}

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
</style>