<template>
    <div class="article-form">
        <Dialog v-model:visible="openDialog" appendTo="self" :baseZIndex="2" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
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
                    <label for="name" :class="{'p-error': formErrors.article_type_id}">Kategorija članka</label>
                    <div>
                        <Dropdown 
                            v-model="articleRootTypeId" 
                            filterPlaceholder="Pretraži kategorije članaka"
                            placeholder="" 
                            optionLabel="name" 
                            optionValue="id" 
                            class="article-type-dropdown"
                            :options="articleRootTypes" 
                            :filter="true" 
                            :showClear="true" 
                            :class="{'p-invalid': formErrors.article_type_id}"
                            @change="onTypeIdChange"
                        />
                    </div>
                    <small class="p-error">{{formErrors.article_type_id}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.article_type_id}">Podkategorija članka</label>
                    <div>
                        <Dropdown 
                            v-model="articleSub1TypeId" 
                            placeholder="" 
                            filterPlaceholder="Pretraži podkategorije članaka"
                            class="article-type-dropdown"
                            optionLabel="name" 
                            optionValue="id" 
                            :options="articleTypes" 
                            :filter="true" 
                            :showClear="true" 
                            :class="{'p-invalid': formErrors.article_type_id}"
                            @change="onTypeIdChange"
                            @filter="onFilterArticleType"
                        />
                    </div>
                    <small class="p-error">{{formErrors.article_type_id}}</small>
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
                <!-- <div class="field flex flex-column">
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
                </div> -->
                <div class="field flex flex-column">
                    <template v-if="!form.download_file">
                        <FileUpload class="p-button-secondary"
                            mode="basic" 
                            name="files[]" 
                            chooseLabel="Word dokument"
                            :url="uploadMultipleUrl" 
                            :auto="true" 
                            :maxFileSize="maxFileSize" 
                            :withCredentials="true"
                            :disabled="loading"
                            @upload="onUpload($event, 'download_file')" 
                            @before-send="beforeSend"
                            @before-upload="beforeUploadWord"
                        />
                    </template>
                    <div v-else>
                        <div class="delete-file">
                            <span :title="form.download_file.original_name">
                                <span v-if="form.download_file && form.download_file.is_tmp" class="file-not-saved">*</span>
                                {{form.download_file.original_name}}
                            </span> 
                            <Button icon="pi pi-trash" @click="confirmDeleteFile('download_file')" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                        </div>
                    </div>
                </div>
                <div class="field flex flex-column">
                    <FileUpload v-if="!form.pdf_file" class="p-button-secondary"
                        mode="basic" 
                        name="files[]" 
                        chooseLabel="Okači PDF fajl"
                        accept="application/pdf"
                        :auto="true" 
                        :url="uploadMultipleUrl" 
                        :maxFileSize="maxFileSize" 
                        :withCredentials="true"
                        :disabled="loading"
                        @upload="onUpload($event, 'pdf_file')" 
                        @before-send="beforeSend"
                        @before-upload="beforeUploadPdf"
                    />
                    <div v-else>
                        <div class="delete-file">
                            <div v-if="form.pdf_file">
                                <span :title="form.pdf_file.original_name">
                                    <span v-if="form.pdf_file && form.pdf_file.is_tmp" class="file-not-saved">*</span>
                                    {{form.pdf_file.original_name}}
                                </span> 
                                <Button icon="pi pi-trash" @click="confirmDeleteFile('pdf_file')" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field flex flex-column">
                    <FileUpload class="p-button-secondary"
                        mode="basic" 
                        name="files[]" 
                        chooseLabel="Okači Html fajl"
                        :auto="true" 
                        :multiple="true" 
                        :withCredentials="true"
                        :url="uploadMultipleUrl" 
                        :maxFileSize="maxFileSize" 
                        :disabled="loading"
                        @upload="onMultipleUpload($event, 'html_files')" 
                        @before-send="beforeSend"
                        @before-upload="beforeUploadHtml"
                    />
                    <div>
                        <!-- files -->
                        <template v-for="(file, index) of form.html_files">
                            <div class="delete-file">
                                <span :title="file.name">
                                    <span v-if="file.is_tmp" class="file-not-saved">*</span>
                                    {{file.original_name}}
                                </span> 
                                <Button icon="pi pi-trash" @click="confirmDeleteOneOfMultipleFiles('html_files', index)" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                            </div>
                        </template>
                    </div>
                    <small class="p-error">{{formErrors.tmp_files}}</small>
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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useArticleStore } from '@admin/stores/article';
import Calendar from 'primevue/calendar';
import { useAuthStore } from '@/stores/auth';
import { useFileStore } from '@admin/stores/file';
import { FilterMatchMode } from 'primevue/api';

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
const uploadMultipleUrl = baseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 10; //10MB

const emit = defineEmits(['update:modelValue', 'saved']);
const toast = useToast();
const confirm = useConfirm();

const articleStore = useArticleStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const { loading, articleTypes, articleRootTypes } = storeToRefs(articleStore)
const { token, authToken } = storeToRefs(authStore)
const openDialog = ref(false);
const wordLoading = ref(false);
const articleRootTypeId = ref(null);
const articleSub1TypeId = ref(null);
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni članak' : 'Dodaj novi članak');
const form = reactive({
    title: "",
    author: "",
    publish_date: "",
    article_type_id: null,
    pdf_file: null,//file to display information on frontend
    html_files: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
    download_file: "",//file to display information on frontend
});
const timer = ref(null);

const filters = ref({
    'title': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});

articleStore.getArticleTypes({filters: filters.value});
articleStore.getArticleRootTypes();

const onFilterArticleType = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        articleStore.getArticleTypes({filters: filters.value});
    },400);
};

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
});

//formData
watch( () => props.formData, (newVal, oldVal) => {
    //setFormData(newVal);
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
    setFormData(props.formData);
});

//filter subtypes based on root type id
watch( articleRootTypeId, (newVal, oldVal) => {
    if(newVal)
    {
        articleStore.getArticleTypes({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}});
    }
});

onMounted(() => {
    
});

const formErrors = reactive({
    title: "",
    author: "",
    article_type_id: "",
    article_root_type_id: "",
    publish_date: "",
    tmp_files: "", //shows form errors for all files
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (props.formData.hasOwnProperty(field)) {
                const formDataField = props.formData[field];
                form[field] = formDataField;
            }
        }
        if(formData.article_type) {
            if(formData.article_type.parent_id === null){
                articleRootTypeId.value = formData.article_type.id;
            } else {
                //level 2
                articleRootTypeId.value = formData.article_type.parent_id;
                articleSub1TypeId.value = formData.article_type.id;
                //for level 3 check if exists formData.article_type.parent.parent
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
    form.article_type_id = null;
    form.publish_date = "";
    form.pdf_file = null;
    form.html_files = [];
    form.tmp_files = [];
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.author = "";
    formErrors.article_type_id = "";
    formErrors.article_root_type_id = "";
    formErrors.publish_date = "";
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
        
        articleStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Članak je ažuriran!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        articleStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi članak!', detail: form.title, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

/* Tmp File upload*/
//before uploading file
const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
}

//WORD - before uploading file send additional data
const beforeUploadWord = (event) => {
    event.formData.append('file_tag', 'download-file');
    wordLoading.value = true;
}

//HTML - before uploading file send additional data
const beforeUploadHtml = (event) => {
    event.formData.append('file_tag', 'html-preview');
    event.formData.append('is_public', 1);
}

//PDF - before uploading file send additional data
const beforeUploadPdf = (event) => {
    event.formData.append('file_tag', 'pdf-preview');
    event.formData.append('is_public', 1);
}

//when upload is completed
const onUpload = (event, fieldName) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form[fieldName] = response.data.files[0];
        form.tmp_files = form.tmp_files.concat(response.data.files);
        //this format is also possible
        /*let tmpField = {};
        tmpField[fieldName] = response.data.files[0];
        form.tmp_files = tmpField; */
    }
}

/* Tmp multiple files upload*/
//when upload is completed
const onMultipleUpload = (event, fieldName) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form[fieldName] = form[fieldName].concat(response.data.files);
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
        const newsIndex = articleStore.articles.findIndex( el => el.id == props.formData.id);
        articleStore.articles[newsIndex][fieldName] = null;
    }
}

const confirmDeleteOneOfMultipleFiles = (fieldName, index) => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje PDF fajla',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteOneOfMultipleFiles(fieldName, index);
        },
        //no
        reject: () => {
            
        },
        //dialog closed
        onHide: () => {
            
        }
    });
};

const deleteOneOfMultipleFiles = async (fieldName, index) => {
    const file = form[fieldName].length && form[fieldName][index];
    if(file.is_tmp){
        //delete temp file
        await fileStore.deleteTmpFile(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => i != index);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => i != index);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        const newsIndex = articleStore.articles.findIndex( el, i => el.id == props.formData.id);
        articleStore.articles[newsIndex][fieldName] = null;
    }
}

const onTypeIdChange = (event) => {
    form.article_type_id = event.value;
}

</script>

<style lang="scss">
.article-form {
    
    .p-dialog {
        width: 80%;
        .field {
            width: 100%;
            margin-top: 1.2rem;
            margin-bottom: 0px;
        }
    }
}
.p-datepicker {
    z-index: 2;
}
.article-type-dropdown{
    width: 100%;
}
.p-dropdown-panel {
    z-index: 3;
}
</style>