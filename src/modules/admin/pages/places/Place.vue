<template>
    <div class="admin-place p-3">
        <div class="loading" v-if="!place">
            <div v-if="loading">Učitava se...</div>
            <div v-else-if="route.params.id">Nema podataka.</div>
        </div>
        <div class="place-description">
            <div class="header">
                <div class="title">
                    <h2 v-if="route.params.id">Mesto</h2>
                    <h2 v-else>Dodaj novo mesto</h2>
                </div>
                <div class="options">
                    <Dropdown
                        v-model="selectedLang" 
                        class="w-full md:w-14rem"
                        optionLabel="name" 
                        placeholder="Izaberi jezik" 
                        :options="languages" 
                        @change="onLangChange"
                    >
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex align-items-center">
                                <img :alt="slotProps.value.label" :src="'/images/langs/'+slotProps.value.lang_code+'.png'" :class="`mr-2 flag flag-${slotProps.value.lang_code.toLowerCase()}`" style="width: 18px" />
                                <div>{{ slotProps.value.name }}</div>&nbsp;
                                <div v-if="slotProps.value.note"> ({{ slotProps.value.note }})</div> &nbsp;
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <img :alt="slotProps.option.label" :src="'/images/langs/'+slotProps.option.lang_code+'.png'" :class="`mr-2 flag`" style="width: 18px" />
                                <div>{{ slotProps.option.name }}</div>&nbsp;
                                <div v-if="slotProps.option.note"> ({{ slotProps.option.note }})</div> &nbsp;
                                <i v-if="
                                        (
                                            place &&
                                            place.translations && 
                                            place.translations.find(t => t.language_id == slotProps.option.id)
                                        ) 
                                        //slotProps.option.lang_code == 'sr-latin'
                                    " 
                                    class="pi pi-check" style="color: green"></i>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>
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
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.parent_id}">Pripada</label>
                            <div>
                                <Dropdown v-model="form.parent_id" 
                                    placeholder="" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="places" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.parent_id}"
                                    @change="onCategoryIdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.category_id}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="description" :class="{'p-error': formErrors.description}">Opis</label>
                            <div>
                                <Textarea id="description" type="text" v-model="form.description" :class="{'p-invalid': formErrors.description}" rows="10"/>
                            </div>
                            <small class="p-error">{{formErrors.description}}</small>
                        </div>
                        <div v-if="canEdit" class="field col-12 md:col-12 lg:col-12">
                            <label :class="{'p-error': formErrors.images}">Slike</label>
                            <div>
                                <FileUpload class="p-button-secondary"
                                    mode="basic" 
                                    name="files[]" 
                                    chooseLabel="Upload"
                                    accept="image/*"
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
                                        <div class="files">
                                            <span :title="file.name" :class="{thumbnail: place && place.thumbnail?.file_path.includes('thumbnail_'+file.id)}">
                                                <span v-if="file.is_tmp" class="file-not-saved">*</span>
                                                {{file.original_name}}
                                            </span> 
                                            <Button icon="pi pi-image" 
                                                v-if="!file.is_tmp && (!place.thumbnail || !place.thumbnail.file_path.includes('thumbnail_'+file.id))"
                                                class="p-button-rounded p-button-text p-button-sm action-btn" 
                                                v-tooltip.top="'Postavi na kakrtici'" 
                                                @click="setThumbnail(file)" 
                                            />
                                            <Button icon="pi pi-trash" 
                                                class="p-button-rounded p-button-danger p-button-text p-button-sm action-btn" 
                                                v-tooltip.top="'Obriši sliku'" 
                                                @click="confirmDeleteOneOfMultipleFiles('images', index)" 
                                            />
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
                            <div class="flex justify-description-end">
                                <router-link :to="{ name: 'AdminPlaces'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="place && place.id ? 'Ažuriraj' : 'Novi unos'"/>
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
import { usePlaceStore } from '@/stores/place'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'
import { useGlobalStore } from '@/stores/global'
import NoAccess from '../noAccess/NoAccess.vue'
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { responsiveOptions } from '@/constants/gallerySettings'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = apiBaseUrl + '/api/files/upload';
const uploadMultipleUrl = apiBaseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 30; //30MB

const placeStore = usePlaceStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const globalStore = useGlobalStore();
const { user } = storeToRefs(authStore)
const { place, places, loading } = storeToRefs(placeStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const timer = ref(null);
const uploadingImages = ref(false);
const languages = ref([]);
const selectedLang = ref(false);

const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
const sort = ref({
    sortField: "sortField" in route.query ? route.query.sortField : "id",
    sortOrder: "sortOrder" in route.query ? route.query.sortOrder : -1,
});
const pagination = ref({
    page: 1,
    perPage: 10,
});

const form = reactive({
    parent_id: null,
    name: "",
    description: "",
    description: "",
    images: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
    selected_language_id: null
});
const formErrors = reactive({
    parent_id: "",
    name: "",
    description: "",
    tmp_files: "", //shows form errors for all files
    selected_language_id: ""
});
const clearFormErrors = () => {
    formErrors.parent_id = "";
    formErrors.name = "";
    formErrors.description = "";
    formErrors.tmp_files = "";
    formErrors.selected_language_id = "";
}

placeStore.getAll({sort: sort.value, pagination: pagination.value, filters: filters.value});

globalStore.getLanguages().then(responseData => {
    if(route.params.id){
        languages.value = responseData;
    } else {
        //Za sada defualt jezik je sr latinica, za drugi jezik potrebno je u lokal storage sacuvati lang code
        languages.value = responseData.filter( l => l.lang_code == 'sr-latin')
    }
})

//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.id){
        placeStore.adminGet(route.params.id);
    }
});


//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

//Check if the user has access to edit and delete
const canEdit = computed(() => { 
    return !place.value ||
    place.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

//fill form
watch( place, (newVal, oldVal) => {
    if(newVal)
    {
        setFormData(newVal);
    }
});

watch( languages, (newVal, oldVal) => {
    if(newVal && !selectedLang.value && languages.value && languages.value.length)
    {
        selectedLang.value = languages.value.find(l => l.lang_code == 'sr-latin');
        form.selected_language_id = selectedLang.value.id;
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
    } 
}

const save = async () => {
    if (!canEdit) {
        return false;
    }
    //format date fields
    clearFormErrors();
    //Update
    if(route.params.id)
    {
        form.id = route.params.id;
        disabledSaveBtn.value = true;
        placeStore.update(form, formErrors)
            .then(() => {
                setFormData(place.value);
                toast.add({severity:'success', description: 'Ažuriranje uspešno!', detail: form.name, life: 3000});
                disabledSaveBtn.value = false;
                form.tmp_files = [];
            })
            .catch(() => {
                toast.add({severity:'error', description: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
                disabledSaveBtn.value = false;
            })
    } 
    //Create
    else 
    {
        disabledSaveBtn.value = true;
        placeStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', description: 'Uspešno kreirano!', detail: form.name, life: 2000});
                //redirect user from create to update page
                router.push({name: 'AdminPlaces'})
                disabledSaveBtn.value = false;
                form.tmp_files = [];

            })
            .catch(() => {
                disabledSaveBtn.value = false;
                toast.add({severity:'error', description: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const onFilterCategories = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        placeStore.getCategories({filters: filters.value});
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
        place.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        place.value[fieldName] = null;
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
        place.value[fieldName] = place.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        place.value[fieldName] = place.value[fieldName].filter( (el, i) => i != index);
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

const setThumbnail = (file) => {
    fileStore.setThumbnail(file.id)
        .then(responseData => {
            place.value.thumbnail = responseData;
        })
}

const onLangChange = (event) => {
    //save selected language id
    form.selected_language_id = event.value.id;
    if (event.value) {
        if(route.params.id){
            placeStore.adminGet(route.params.id, event.value.id);
        }
    }
}

</script>

<style scoped>
.admin-place { 
    max-width: 1200px;
    margin: auto;
}
.header {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
    .title h2 {
        margin: 0
    }
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
.files {
    height: 40px;
    display: flex;
    align-items: center;
}
.action-btn {
    visibility: hidden;
}
.files:hover .action-btn{
    visibility: visible;
}
.files span {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.thumbnail {
    font-weight: 600;
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