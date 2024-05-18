<template>
    <div class="admin-trip-form p-3">
        <div class="loading" v-if="!trip">
            <div v-if="loading">Učitava se...</div>
            <div v-else-if="route.params.id">Nema podataka.</div>
        </div>
        <div class="trip-text">
            <h2 v-if="route.params.id">Turistička tura</h2>
            <h2 v-else>Nova turistička tura</h2>
            <div class="grid" v-if="authStore.hasAuthorAccess()">
                <div class="field col-12 align-self-start">
                    <div class="grid">
                        <div class="field col-12">
                            <label for="title" :class="{'p-error': formErrors.title}">Naslov *</label>
                            <div>
                                <InputText id="title" type="text" v-model="form.title" :class="{'p-invalid': formErrors.title}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.title}}</small>
                            </div>
                        </div>
                        <!-- <div class="field col-12">
                            <label for="subtitle" :class="{'p-error': formErrors.subtitle}">Podnaslov</label>
                            <div>
                                <InputText id="subtitle" type="text" v-model="form.subtitle" :class="{'p-invalid': formErrors.subtitle}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.subtitle}}</small>
                            </div>
                        </div> -->
                        <div class="field col-12">
                            <label for="summary" :class="{'p-error': formErrors.summary}">Sažetak</label>
                            <div>
                                <InputText id="summary" type="text" v-model="form.summary" :class="{'p-invalid': formErrors.summary}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.summary}}</small>
                            </div>
                        </div> 
                        <div class="field col-12">
                            <label for="text" :class="{'p-error': formErrors.text}">Text *</label>
                            <div>
                                <!-- <Textarea id="text" type="text" v-model="form.text" :class="{'p-invalid': formErrors.text}" rows="10"/> -->
                                <jodit-editor 
                                    v-model="form.text" 
                                    :config="{height: 400, zIndex: 21}"
                                    :buttons="[
                                        'source', '|',
                                        'bold',
                                        'strikethrough',
                                        'underline',
                                        'italic', '|',
                                        'ul',
                                        'ol', '|',
                                        'outdent', 'indent',  '|',
                                        'font',
                                        'fontsize',
                                        'brush',
                                        'paragraph', '|',
                                        /* 'file',
                                        'image',
                                        'video',
                                        'table',
                                        'link', '|', */
                                        'align', 'undo', 'redo', '|',
                                        'hr',
                                        'eraser',
                                        'copyformat', '|',
                                        'symbol',
                                        'fullsize',
                                        'print',
                                        'about']"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.text}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.category_id}">Znamenitosti</label>
                            <div>
                                <MultiSelect v-model="selectedAttractions" :options="attractions" filter optionLabel="name" placeholder="Izaberi"
                                    class="w-full md:w-20rem" 
                                    autoFilterFocus
                                    :filterFields="['name', 'content', 'title', 'subtitle', 'summary']"
                                    @filter="onFilterAttractions"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.category_id}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <div>
                                <Checkbox
                                    inputId="approved"
                                    v-model="form.approved"
                                    :binary="true"
                                    :class="{ 'p-invalid': formErrors.approved }"
                                />&nbsp;
                                <label for="approved" :class="{'p-error': formErrors.approved}">Odobreno</label>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.approved}}</small>
                            </div>
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
                        <div v-if="canEdit" class="field col-12">
                            <div class="flex justify-text-end">
                                <router-link :to="{ name: 'admin-trips'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="trip && trip.id ? 'Ažuriraj' : 'Novi unos'"/>
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
import { useAttractionStore } from '@/stores/attraction'
import { useTripStore } from '@/stores/trip'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'
import MultiSelect from 'primevue/multiselect';
import TreeSelect from 'primevue/treeselect';
import dateTool from '@/util/dateTool'
import NoAccess from '../noAccess/NoAccess.vue'
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import 'jodit/build/jodit.min.css'
import { JoditEditor } from 'jodit-vue'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = apiBaseUrl + '/api/files/upload';
const uploadMultipleUrl = apiBaseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 30; //30MB

const tripStore = useTripStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const attractionStore = useAttractionStore();
const { user } = storeToRefs(authStore)
const { trip, loading } = storeToRefs(tripStore);
const { attractions } = storeToRefs(attractionStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const fileFrame = ref(null);
const timer = ref(null);
const uploadingImages = ref(false);
const selectedAttractions = ref(null);

const attractionFilters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
});
attractionStore.getAttractions({filters: attractionFilters});

const form = reactive({
    title: "",
    subtitle: "",
    summary: "",
    text: "",
    attraction_ids: null,
    approved: true,
    images: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
});
const formErrors = reactive({
    title: "",
    subtitle: "",
    summary: "",
    text: "",
    approved: "",
    attraction_ids: "",
    images: "",
    tmp_files: "", //shows form errors for all files
});
const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.subtitle = "";
    formErrors.summary = "";
    formErrors.text = "";
    formErrors.approved = "";
    formErrors.attraction_ids = "";
    formErrors.images = "";
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

//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.id){
        tripStore.get(route.params.id);
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
    return !trip.value ||
    trip.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

//fill form
watch( trip, (newVal, oldVal) => {
    if(newVal)
    {
        setFormData(newVal);
    }
});

const setFormData = (data) => {
    if(data){
        for (const field in form) {
            if (data.hasOwnProperty(field)) {
                const dataField = data[field];
                form[field] = dataField;
            }
        }
        if (data.attractions && data.attractions.length) {
            selectedAttractions.value = data.attractions;
            copyMissingObject(selectedAttractions.value, attractions.value);
        }
    } 
}

const copyMissingObject = (array1, array2) => {
    for (const obj1 of array1) {
        let exists = false;
        for (const obj2 of array2) {
            if (obj1.id === obj2.id) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            array2.push(obj1);
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
    if (selectedAttractions.value && selectedAttractions.value.length) {
        form.attraction_ids = selectedAttractions.value.map(a => a.id)
    }
    //Update
    if(route.params.id)
    {
        form.id = route.params.id;
        disabledSaveBtn.value = true;
        tripStore.update(form, formErrors)
            .then(() => {
                setFormData(trip.value);
                toast.add({severity:'success', summary: 'Ažuriranje uspešno!', detail: form.title, life: 3000});
                disabledSaveBtn.value = false;
                form.tmp_files = [];
                router.push({name: 'admin-trip', params: { id: trip.value.id }})
            })
            .catch((error) => {
                console.log(error);
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
                disabledSaveBtn.value = false;
            })
    } 
    //Create
    else 
    {
        disabledSaveBtn.value = true;
        tripStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Vest kreirana!', detail: form.title, life: 2000});
                //redirect user from create to update page
                disabledSaveBtn.value = false;
                form.tmp_files = [];
                router.push({name: 'admin-trip', params: { id: responseData.id }})

            })
            .catch((error) => {
                console.log(error);
                disabledSaveBtn.value = false;
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

const formateDateFields = () => {
    //form.start_date = dateTool.toDbFormat(form.start_date_formated);
}

const onFilterAttractions = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        attractionFilters.value.global.value = event.value;
        attractionStore.getAttractions({filters: attractionFilters.value});
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

const deleteFile = async (fieldName) => {
    let file = form[fieldName];
    if(file && file.is_tmp){
        //delete temp file
        await fileStore.deleteTmpFile(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        trip.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        trip.value[fieldName] = null;
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
        trip.value[fieldName] = trip.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        trip.value[fieldName] = trip.value[fieldName].filter( (el, i) => i != index);
    }
}

</script>

<style scoped>
.admin-trip-form { 
    max-width: 1200px;
    margin: auto;
}
.field {
    padding-right: 10px;
    align-self: end;
    margin-bottom: 4px;
}
.field input, .calendar-field, .field .p-dropdown, .field textarea{
    width: 100%;
}
input.p-invalid{
    border-color: red !important;
}
.error-field {
    height: 15px;
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
    max-height: 650px;
    overflow: hidden;
    display: flex;
    align-items: center;
}
:deep(.gallery-image) {
    width: 100%;
    max-height: 500px;
    /* height: auto; */
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
:deep(.jodit-toolbar__box) {
    z-index: 1 !important;
}
</style>