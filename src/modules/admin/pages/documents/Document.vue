<template>
    <div class="admin-document p-3">
        <div class="loading" v-if="!document">
            <div v-if="loading">Učitava se...</div>
            <div v-else="loading">Nema podataka.</div>
        </div>
        <div class="document-content">
            <div class="grid">
                <div class="col-12 md:col-6 lg:col-6">
                    <div class="preview">
                        <Card>
                            <template #title>
                                <div v-if="document && document.title">{{document.title}}</div>
                                <div v-else>Novi dokument</div>                              
                            </template>
                            <template #content>
                                <small v-if="document && (!document.pdf_file && !document.html_files)">Nema fajla za pregled.</small> 
                                <div class="file-preview">
                                    <template v-if="document">
                                        <iframe v-if="document.html_files?.length && document.html_file" :src="baseUrl+document.html_file.file_url" policy="SAMEORIGIN"></iframe>
                                        <iframe v-else-if="document.pdf_file" :src="baseUrl+document.pdf_file.file_url" policy="SAMEORIGIN"></iframe>
                                    </template>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
                <div class="field col-12 md:col-6 lg:col-6 align-self-start">
                    <div class="grid">
                        <div class="field col-12">
                            <label for="title" :class="{'p-error': formErrors.title}">Naslov</label>
                            <div>
                                <InputText id="title" type="text" v-model="form.title" :class="{'p-invalid': formErrors.title}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.title}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="author" :class="{'p-error': formErrors.author}">Autor</label>
                            <div>
                                <InputText id="author" type="text" v-model="form.author" :class="{'p-invalid': formErrors.author}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.author}}</small>
                        </div>
                        <!-- <div class="field col-12 md:col-6 lg:col-4">
                            <label for="name" :class="{'p-error': formErrors.document_type_id}">Vrsta dokumenta</label>
                            <div>
                                <Dropdown v-model="form.document_type_id" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži vrste dokumenata"
                                    :options="documentTypes" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.document_type_id}"
                                    @filter="onFilterDocumentType"
                                />
                            </div>
                            <small class="p-error">{{formErrors.document_type_id}}</small>
                        </div> -->
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="name" :class="{'p-error': formErrors.document_root_type_id}">{{getSelectedApp() == 'bzr' ? 'Vrsta *' : 'Oblast *'}}</label>
                            <div>
                                <Dropdown v-model="typeDropdowns.values.rootType" 
                                    placeholder="" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="documentRootTypes" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.document_root_type_id}"
                                    @change="onTypeIdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.document_root_type_id}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4" v-if="getSelectedApp() != 'bzr'">
                            <label for="name" :class="{'p-error': formErrors.document_type_id}">Vrsta dokumenta</label>
                            <div>
                                <Dropdown v-model="typeDropdowns.values.subType1" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži vrste dokumenta"
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="typeDropdowns.options.subType1" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.document_type_id}"
                                    @filter="onFilterDocumentType"
                                    @change="onDocumentSub1TypeIdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.document_type_id}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4" v-if="getSelectedApp() == 'zzs'">
                            <label for="name" :class="{'p-error': formErrors.document_type_id}">Podvrsta</label>
                            <div>
                                <Dropdown v-model="typeDropdowns.values.subType2" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži vrste dokumenta"
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="typeDropdowns.options.subType2" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.document_type_id}"
                                    @filter="onFilterDocumentType"
                                />
                            </div>
                            <small class="p-error">{{formErrors.document_type_id}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="comment" :class="{'p-error': formErrors.comment}">Napomena</label>
                            <div>
                                <InputText id="comment" type="text" v-model="form.comment" :class="{'p-invalid': formErrors.messenger}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.comment}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="publish_date" :class="{'p-error': formErrors.publish_date}">Datum objavljivanja</label>
                            <div>
                                <Calendar inputId="publish_date" v-model="form.publish_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.publish_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.publish_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6" v-if="authStore.hasEditorAccess()">
                            <div>
                                <Checkbox
                                    inputId="approved"
                                    v-model="form.approved"
                                    :trueValue="1"
                                    :falseValue="0"
                                    :binary="true"
                                    :class="{ 'p-invalid': formErrors.approved }"
                                />&nbsp;
                                <label for="approved" :class="{'p-error': formErrors.approved}">Odobri</label>
                            </div>
                            <small class="p-error">{{formErrors.approved}}</small>
                        </div>
                    </div>
                    <div class="grid">
                        <div v-if="canEdit" class="field col-12 md:col-6 lg:col-6">
                            <label :class="{'p-error': formErrors.download_file}">Word dokument</label>
                            <div>
                                <FileUpload v-if="!form.download_file" class="p-button-secondary"
                                    mode="basic" 
                                    name="files[]" 
                                    chooseLabel="Okači fajl"
                                    :url="uploadMultipleUrl" 
                                    :auto="true" 
                                    :maxFileSize="maxFileSize" 
                                    :withCredentials="true"
                                    :disabled="loading"
                                    @upload="onUpload($event, 'download_file')" 
                                    @before-send="beforeSend"
                                    @before-upload="beforeUploadFileForDownload"
                                />
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
                        </div>
                        <div v-if="canEdit" class="field col-12 md:col-6 lg:col-6">
                            <label :class="{'p-error': formErrors.pdf_file}">PDF fajl</label>
                            <div>
                                <FileUpload v-if="!form.pdf_file" class="p-button-secondary"
                                    mode="basic" 
                                    name="files[]" 
                                    chooseLabel="Okači fajl"
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
                        </div>
                        <div v-if="canEdit" class="field col-12 md:col-12 lg:col-12">
                            <label :class="{'p-error': formErrors.tmp_files}">HTML fajlovi</label>
                            <div>
                                <FileUpload  class="p-button-secondary"
                                    mode="basic" 
                                    name="files[]" 
                                    chooseLabel="Okači fajl"
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
                            </div>
                            <small class="p-error">{{formErrors.tmp_files}}</small>
                        </div>
                        <div v-if="canEdit" class="field col-12">
                            <div class="flex justify-content-end">
                                <router-link :to="{ name: 'AdminDocuments'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" autofocus @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="document && document.id ? 'Ažuriraj' : 'Novi unos'"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { useDocumentStore } from '@admin/stores/document'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'
import { getSelectedApp } from '../../util/general'
import dateTool from '@/util/dateTool'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const baseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = baseUrl + '/api/files/upload';
const uploadMultipleUrl = baseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 10; //10MB

const documentStore = useDocumentStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const { user } = storeToRefs(authStore)
const { document, documentTypes, loading, documentRootTypes } = storeToRefs(documentStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const timer = ref(null);
//Order has to mutch with html order
const typeDropdowns = reactive({
    values: {//ids
        rootType: null,
        subType1: null,
        subType2: null,
    },
    options: {
        subType1: null,
        subType2: null,
    }
});
const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
const form = reactive({
    title: "",
    author: "",
    comment: "",
    publish_date: "",
    publish_date_formated: "",
    document_type: "",
    document_type_id: "",
    approved: authStore.hasEditorAccess() ? 1 : 0,
    download_file: "",//file to display information on frontend
    pdf_file: null,//file to display information on frontend
    html_files: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
});
const formErrors = reactive({
    title: "",
    author: "",
    comment: "",
    publish_date: "",
    document_type: "",
    tmp_files: "", //shows form errors for all files
    document_type_id: "",
    approved: "",
    default: ""
});
documentStore.getDocumentRootTypes({filters: filters.value});
//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.documentId){
        documentStore.getDocument(route.params.documentId);
    }
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

//fill form
watch( document, (newVal, oldVal) => {
    if(newVal)
    {
        setFormData(newVal);
    }
});

//filter subtypes based on root type id, fill dropdown options
watch( () => typeDropdowns.values.rootType, (newVal, oldVal) => {
    if(newVal)
    {
        documentStore.getDocumentTypes({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => {
                typeDropdowns.options.subType1 = responseData.document_types.results
            })
    }
});

//load and filter dropdown options - subtypes 
watch( () => typeDropdowns.values.subType1, (newVal, oldVal) => {
    if(newVal)
    {
        documentStore.getDocumentTypes({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => { 
                typeDropdowns.options.subType2 = responseData.document_types.results
            })
    }
});

//Check if the user has access to edit and delete
const canEdit = computed(() => { 
    console.log(document);
    return !document.value ||
    document.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

const setFormData = (data) => {
    if(data){
        for (const field in form) {
            if (data.hasOwnProperty(field)) {
                const dataField = data[field];
                form[field] = dataField;
            } 
        }
        // parents (types)
        if(data.document_type && data.document_type.ancestorsAndSelf) {
            let i = 0;
            for (const filedName in typeDropdowns.values) {
                if (typeDropdowns.values.hasOwnProperty(filedName)) {
                    const dropdownValue = typeDropdowns.values[filedName];
                    const parent = data.document_type.ancestorsAndSelf[i];
                    if (parent) {
                        typeDropdowns.values[filedName] = parent.id
                    }
                    i++;
                }
            
            }
        }
    } 
}

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.author = "";
    formErrors.comment = "";
    formErrors.publish_date = "";
    formErrors.tmp_files = "";
    formErrors.document_type = "";
    formErrors.document_type_id = "";
    formErrors.approved = "";
    formErrors.default = "";
}

const save = async () => {
    if (!canEdit) {
        return false;
    }
    //format date fields
    clearFormErrors();
    formateDateFields();
    setSelectedDocumentTypeId();
    //Update
    if(route.params.documentId)
    {
        form.id = route.params.documentId;
        disabledSaveBtn.value = true;
        documentStore.update(form, formErrors)
            .then(() => {
                setFormData(document.value);
                toast.add({severity:'success', summary: 'Dokument je ažuriran!', detail: form.title, life: 3000});
                disabledSaveBtn.value = false;
                form.tmp_files = [];
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
                disabledSaveBtn.value = false;
            })
    } 
    //Create
    else 
    {
        disabledSaveBtn.value = true;
        documentStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreiran novi dokument!', detail: form.title, life: 2000});
                //redirect user from create to update page
                router.push({name: 'AdminDocument', params: { documentId: responseData.document.id }});
                disabledSaveBtn.value = false;
                form.tmp_files = [];

            })
            .catch((e) => {
                disabledSaveBtn.value = false;
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const formateDateFields = () => {
    form.publish_date = dateTool.toDbFormat(form.publish_date_formated);
}

const onFilterDocumentType = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        documentStore.getDocumentTypes({filters: filters.value});
    },400);
}

//Attach headers before send file
const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
}

//Download file - before uploading file send additional data
const beforeUploadFileForDownload = (event) => {
    event.formData.append('file_tag', 'download-file');
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

/* Tmp File upload*/
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
        document.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = null;
        document.value[fieldName] = null;
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
        document.value[fieldName] = document.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => i != index);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        document.value[fieldName] = document.value[fieldName].filter( (el, i) => i != index);
    }
}
/* const deleteOneOfMultipleFiles = async (index) => {
    const files = document.value && document.value.files;
    if(files){
        //delete saved file
        await fileStore.delete(files[index].file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => i != index);
    } else if (form.tmp_files && form.tmp_files[index] !== undefined) {
        //delete temp file
        await fileStore.deleteTmpFile(form.tmp_files[index].file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => i != index);
    }
} */

// on change 2. dropdown gets new options, and 3. dropdown options will be empty
const onTypeIdChange = (event) => {
    typeDropdowns.values.subType1 = null;
    typeDropdowns.options.subType1 = null;
    onDocumentSub1TypeIdChange(null);
}

const onDocumentSub1TypeIdChange = (event) => {
    typeDropdowns.values.subType2 = null;
    typeDropdowns.options.subType2 = null;
    //call every dropdown change event except the last one
    //onDocumentSub2TypeIdChange(null);
}

//get type_id
const setSelectedDocumentTypeId = () => {
    form.document_type_id = typeDropdowns.values.subType2 
        || typeDropdowns.values.subType1
        || typeDropdowns.values.rootType;
}

</script>

<style scoped>
.field {
    padding-right: 10px;
    align-self: end;
}
.field input, .calendar-field, .field .p-dropdown{
    width: 100%;
}
input.p-invalid{
    border-color: red !important;
}
.file-not-saved {
    color: var(--orange-600)
}
.delete-file{
    height: 30px;
    display: flex;
    align-items: baseline;
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
    overflow: hidden;
    text-overflow: ellipsis;
}
.preview .file-preview{
    min-height: calc(100vh - 190px);
}
.preview iframe {
    width: 100%;
    min-height: calc(100vh - 190px);
    background-color: white;
    border: none;
}
</style>