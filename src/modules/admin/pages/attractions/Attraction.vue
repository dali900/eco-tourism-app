<template>
    <div class="admin-attraction p-3">
        <div class="loading" v-if="!attraction">
            <div v-if="loading">Učitava se...</div>
            <div v-else-if="route.params.attractionId">Nema podataka.</div>
        </div>
        <div class="attraction-content">
            <h2 v-if="route.params.attractionId">Atrakcija</h2>
            <h2 v-else>Nova atrakcija</h2>
            <div class="grid" v-if="authStore.hasAuthorAccess()">
                <div class="field col-12 align-self-start">
                    <div class="grid">
                        <div class="field col-12">
                            <label for="name" :class="{'p-error': formErrors.name}">Naziv *</label>
                            <div>
                                <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.name}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="summary" :class="{'p-error': formErrors.summary}">Sažetak *</label>
                            <div>
                                <InputText id="summary" type="text" v-model="form.summary" :class="{'p-invalid': formErrors.summary}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.summary}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="content" :class="{'p-error': formErrors.content}">Sadržaj</label>
                            <div>
                                <Textarea id="content" type="text" v-model="form.content" :class="{'p-invalid': formErrors.content}" @keyup.enter="save" rows="4"/>
                            </div>
                            <small class="p-error">{{formErrors.content}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.category_id}">Kategorija</label>
                            <div>
                                <Dropdown v-model="categoryDropdowns.values.rootCategory" 
                                    placeholder="" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="attractionRootCategories" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.category_id}"
                                    @change="onCategoryIdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.category_id}}</small>
                        </div>
                        <div v-if="canEdit" class="field col-12 md:col-12 lg:col-12">
                            <label :class="{'p-error': formErrors.images}">Slike</label>
                            <div>
                                <FileUpload class="p-button-secondary"
                                    mode="basic" 
                                    name="files[]" 
                                    chooseLabel="Upload"
                                    :auto="true" 
                                    :multiple="true" 
                                    :withCredentials="true"
                                    :url="uploadMultipleUrl" 
                                    :maxFileSize="maxFileSize" 
                                    :disabled="uploadingImages || loading"
                                    @upload="onMultipleUpload($event, 'images')" 
                                    @before-send="beforeSend"
                                    @before-upload="beforeUploadFiles"
                                />
                                <ProgressSpinner v-if="uploadingImages"/>
                                <!-- files -->
                                <div>
                                    <template v-for="(file, index) of form.images">
                                        <div class="delete-file">
                                            <span :title="file.name">
                                                <span v-if="file.is_tmp" class="file-not-saved">*</span>
                                                {{file.original_name}}
                                            </span> 
                                            <Button icon="pi pi-trash" @click="confirmDeleteOneOfMultipleFiles('images', index)" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div>
                                <Galleria :value="form.images" :responsiveOptions="responsiveOptions" :numVisible="5" >
                                    <template #item="slotProps">
                                        <div class="gallery-image-wrapper">
                                            <!-- <img :src="apiBaseUrl+slotProps.item.file_url" :alt="slotProps.item.original_name" class="gallery-image" /> -->
                                            <Image :src="apiBaseUrl+slotProps.item.file_url" :alt="slotProps.item.original_name" imageClass="gallery-image" preview />
                                        </div>
                                    </template>
                                    <template #thumbnail="slotProps">
                                        <div class="gallery-thumbnail-wrapper">
                                            <img :src="apiBaseUrl+slotProps.item.file_url" :alt="slotProps.item.original_name" class="thumbnail-image" />
                                        </div>
                                    </template>
                                </Galleria>
                            </div>
                        </div>
                        <!-- <div class="field col-12 md:col-6 lg:col-4" v-if="getSelectedApp() != 'bzr'">
                            <label for="category_id" :class="{'p-error': formErrors.category_id}">Potkategorija</label>
                            <div>
                                <Dropdown v-model="categoryDropdowns.values.subCategory1" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži kategorie"
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="categoryDropdowns.options.subCategory1" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.category_id}"
                                    @filter="onFilterCategories"
                                    @change="onSubCategory1IdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.category_id}}</small>
                        </div> -->
                        <!--<div class="field col-12 md:col-6 lg:col-4" v-if="getSelectedApp() == 'zzs'">
                            <label for="name" :class="{'p-error': formErrors.category_id}">Potkategorija 2</label>
                            <div>
                                <Dropdown v-model="categoryDropdowns.values.subCategory2" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži kategorie"
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="categoryDropdowns.options.subCategory2" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.category_id}"
                                    @filter="onFilterCategories"
                                />
                            </div>
                            <small class="p-error">{{formErrors.category_id}}</small>
                        </div> -->
                        <!-- <div class="field col-12 md:col-6 lg:col-4">
                            <label for="maker" :class="{'p-error': formErrors.maker}">Donosilac</label>
                            <div>
                                <InputText id="maker" type="text" v-model="form.maker" :class="{'p-invalid': formErrors.maker}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.maker}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="validity_level" :class="{'p-error': formErrors.validity_level}">Nivo važenja</label>
                            <div>
                                <InputText id="validity_level" type="text" v-model="form.validity_level" :class="{'p-invalid': formErrors.validity_level}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.validity_level}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="start_date_formated" :class="{'p-error': formErrors.start_date}">Datum stupanja na snagu propisa</label>
                            <div>
                                <Calendar inputId="start_date_formated" v-model="form.start_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.start_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="version_end_date_formated" :class="{'p-error': formErrors.version_end_date}">Datum prestanka verzije</label>
                            <div>
                                <Calendar inputId="version_end_date_formated" v-model="form.version_end_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.version_end_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.version_end_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="note" :class="{'p-error': formErrors.note}">Napomena</label>
                            <div>
                                <InputText id="note" type="text" v-model="form.note" :class="{'p-invalid': formErrors.note}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.note}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="messenger_note" :class="{'p-error': formErrors.messenger_note}">Napomena glasnika</label>
                            <div>
                                <InputText id="messenger_note" type="text" v-model="form.messenger_note" :class="{'p-invalid': formErrors.messenger_note}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.messenger_note}}</small>
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
                        <div v-if="canEdit" class="field col-12 md:col-6 lg:col-6">
                            <label :class="{'p-error': formErrors.download_file}">Word dokument</label>
                            <div>
                                <template v-if="!form.download_file">
                                    <FileUpload class="p-button-secondary"
                                        mode="basic" 
                                        name="files[]" 
                                        chooseLabel="Okači fajl"
                                        :url="uploadMultipleUrl" 
                                        :auto="true" 
                                        :maxFileSize="maxFileSize" 
                                        :withCredentials="true"
                                        :disabled="uploadingImages || loading"
                                        @upload="onUpload($event, 'download_file')" 
                                        @before-send="beforeSend"
                                        @before-upload="beforeUploadFiles"
                                    />
                                    <ProgressSpinner v-if="uploadingImages"/>
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
                        </div>
                        <div v-if="canEdit"  class="field col-12 md:col-6 lg:col-6">
                            <label :class="{'p-error': formErrors.pdf_tmp_file}">PDF fajl</label>
                            <div>
                                <template v-if="!form.pdf_file">
                                    <FileUpload class="p-button-secondary"
                                        mode="basic" 
                                        name="files[]" 
                                        chooseLabel="Okači fajl"
                                        accept="application/pdf"
                                        :auto="true" 
                                        :url="uploadMultipleUrl" 
                                        :maxFileSize="maxFileSize" 
                                        :withCredentials="true"
                                        :disabled="pdfLoading || loading"
                                        @upload="onUpload($event, 'pdf_file')" 
                                        @before-send="beforeSend"
                                        @before-upload="beforeUploadPdf"
                                    />
                                    <ProgressSpinner v-if="pdfLoading"/>
                                </template>
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
                        </div> -->
                        <div v-if="canEdit" class="field col-12">
                            <div class="flex justify-content-end">
                                <router-link :to="{ name: 'AdminAttractions'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="attraction && attraction.id ? 'Ažuriraj' : 'Novi unos'"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid" v-else>
                <div class="field">
                    <NoAccess/>
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
import { useAttractionStore } from '@admin/stores/attraction'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'
import { getSelectedApp } from '../../util/general'
import dateTool from '@/util/dateTool'
import NoAccess from '../noAccess/NoAccess.vue'
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = apiBaseUrl + '/api/files/upload';
const uploadMultipleUrl = apiBaseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 30; //30MB

const attractionStore = useAttractionStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const { user } = storeToRefs(authStore)
const { attraction, loading, attractionRootCategories } = storeToRefs(attractionStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const fileFrame = ref(null);
const timer = ref(null);
const uploadingImages = ref(false);
const pdfLoading = ref(false);
const htmlLoading = ref(false);
//Order has to mutch with html order
const categoryDropdowns = reactive({
    values: {//ids
        rootCategory: null,
        subCategory1: null,
        subCategory2: null,
    },
    options: {
        subCategory1: null,
        subCategory2: null,
    }
});
const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
const form = reactive({
    category_id: null,
    name: "",
    summary: "",
    content: "",
    images: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
});
const formErrors = reactive({
    category_id: null,
    name: "",
    summary: "",
    content: "",
    tmp_files: "", //shows form errors for all files
});
const clearFormErrors = () => {
    formErrors.category_id = "";
    formErrors.name = "";
    formErrors.summary = "";
    formErrors.content = "";
    formErrors.tmp_files = "";
}

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

attractionStore.getAttractionRootCategories();
//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.attractionId){
        attractionStore.getAttraction(route.params.attractionId);
    }
});

//onMounted( () => {});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

//Check if the user has access to edit and delete
const canEdit = computed(() => { 
    return !attraction.value ||
    attraction.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

//fill form
watch( attraction, (newVal, oldVal) => {
    if(newVal)
    {
        setFormData(newVal);
    }
});

 //load and filter dropdown options - subtypes based on root type id
watch( () => categoryDropdowns.values.rootCategory, (newVal, oldVal) => {
    if(newVal)
    {
        attractionStore.getAttractionCategories({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => {
                categoryDropdowns.options.subCategory1 = responseData.results
            })
    }
});

/*//load and filter dropdown options - subtypes 
watch( () => categoryDropdowns.values.subCategory1, (newVal, oldVal) => {
    if(newVal)
    {
        attractionStore.getAttractionCategories({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => { 
                categoryDropdowns.options.subCategory2 = responseData.results
            })
    }
}); */


const setFormData = (data) => {
    if(data){
        for (const field in form) {
            if (data.hasOwnProperty(field)) {
                const dataField = data[field];
                form[field] = dataField;
            } 
        }

        // parents (categories)
        if(data.category && data.category.ancestorsAndSelf) {
            let i = 0;
            for (const filedName in categoryDropdowns.values) {
                if (categoryDropdowns.values.hasOwnProperty(filedName)) {
                    const dropdownValue = categoryDropdowns.values[filedName];
                    const parent = data.category.ancestorsAndSelf[i];
                    if (parent) {
                        categoryDropdowns.values[filedName] = parent.id
                    }
                    i++;
                }
            
            }
        }
    } 
}

const save = async () => {
    if (!canEdit) {
        return false;
    }
    //format date fields
    clearFormErrors();
    formateDateFields();
    setSelectedAttractionCategoryId();
    //Update
    if(route.params.attractionId)
    {
        form.id = route.params.attractionId;
        disabledSaveBtn.value = true;
        attractionStore.update(form, formErrors)
            .then(() => {
                setFormData(attraction.value);
                toast.add({severity:'success', summary: 'Ažuriranje uspešno!', detail: form.name, life: 3000});
                disabledSaveBtn.value = false;
                form.tmp_files = [];
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
                disabledSaveBtn.value = false;
            })
    } 
    //Create
    else 
    {
        disabledSaveBtn.value = true;
        attractionStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Atrakcija kreirana!', detail: form.name, life: 2000});
                //redirect user from create to update page
                router.push({name: 'AdminAttraction', params: { attractionId: attraction.value.id }})
                disabledSaveBtn.value = false;
                form.tmp_files = [];

            })
            .catch(() => {
                disabledSaveBtn.value = false;
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const formateDateFields = () => {
    //form.start_date = dateTool.toDbFormat(form.start_date_formated);
}

const onFilterCategories = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        attractionStore.getAttractionCategories({filters: filters.value});
    },400);
}

//before uploading file
const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
}

//Download file - before uploading file send additional data
const beforeUploadFiles = (event) => {
    //event.formData.append('file_tag', 'image');
    uploadingImages.value = true;
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
    uploadingImages.value = false;
}

/* Tmp multiple files upload*/
//when upload is completed
const onMultipleUpload = (event, fieldName) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form[fieldName] = form[fieldName].concat(response);
        form.tmp_files = form.tmp_files.concat(response);
    }
    uploadingImages.value = false;
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
        attraction.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        attraction.value[fieldName] = null;
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
        attraction.value[fieldName] = attraction.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        attraction.value[fieldName] = attraction.value[fieldName].filter( (el, i) => i != index);
    }
}

// on change 2. dropdown gets new options, and 3. dropdown options will be empty
const onCategoryIdChange = (event) => {
    categoryDropdowns.values.subCategory1 = null;
    categoryDropdowns.options.subCategory1 = null;
    onSubCategory1IdChange(null);
}

const onSubCategory1IdChange = (event) => {
    categoryDropdowns.values.subCategory2 = null;
    categoryDropdowns.options.subCategory2 = null;
    //call every dropdown change event except the last one
    //onSubCategory2IdChange(null);
}

//get category_id
const setSelectedAttractionCategoryId = () => {
    form.category_id = 
        categoryDropdowns.values.subCategory2 
        || categoryDropdowns.values.subCategory1 
        || categoryDropdowns.values.rootCategory;
}

</script>

<style scoped>
.admin-attraction { 
    max-width: 1200px;
    margin: auto;
}
.field {
    padding-right: 10px;
    align-self: end;
}
.field input, .calendar-field, .field .p-dropdown, .field textarea{
    width: 100%;
}
input.p-invalid{
    border-color: red !important;
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
    overflow: hidden;
    text-overflow: ellipsis;
}
.gallery-image-wrapper {
    height: 500px;
    overflow: hidden;
    display: flex;
    align-items: center;
}
:deep(.gallery-image) {
    width: 100%;
    height: auto;
    display: block;
}
.gallery-thumbnail-wrapper {
    max-width: 100px;
    overflow: hidden;
}
.thumbnail-image {
    max-height: 100px;
    width: auto;
}
</style>