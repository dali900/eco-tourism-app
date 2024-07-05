<template>
    <div class="admin-news-form p-3">
        <div class="loading" v-if="!one_news">
            <div v-if="loading">Učitava se...</div>
            <div v-else-if="route.params.id">Nema podataka.</div>
        </div>
        <div class="news-text">
            <div class="header">
                <div class="title">
                    <h2 v-if="route.params.id">Vest</h2>
                    <h2 v-else>Nova vest</h2>
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
                                            one_news &&
                                            one_news.translations && 
                                            one_news.translations.find(t => t.language_id == slotProps.option.id)
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
                            <label for="title" :class="{'p-error': formErrors.title}">Naslov *</label>
                            <div>
                                <InputText id="title" type="text" v-model="form.title" :class="{'p-invalid': formErrors.title}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.title}}</small>
                            </div>
                        </div>
                        <div class="field col-12">
                            <label for="subtitle" :class="{'p-error': formErrors.subtitle}">Podnaslov</label>
                            <div>
                                <InputText id="subtitle" type="text" v-model="form.subtitle" :class="{'p-invalid': formErrors.subtitle}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.subtitle}}</small>
                            </div>
                        </div>
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
                            <label for="text" :class="{'p-error': formErrors.text}">Sadržaj</label>
                            <div>
                                <Textarea id="text" type="text" v-model="form.text" :class="{'p-invalid': formErrors.text}" rows="10"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.text}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.category_id}">Kategorija *</label>
                            <div>
                                <TreeSelect v-model="selectedCategoryValues" :options="tree" selectionMode="multiple" display="chip" placeholder="Izaberi kategoriju" class="md:w-20rem w-full" />
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
                                            <span :title="file.name" :class="{thumbnail: one_news && one_news.thumbnail?.file_path.includes('thumbnail_'+file.id)}">
                                                <span v-if="file.is_tmp" class="file-not-saved">*</span>
                                                {{file.original_name}}
                                            </span> 
                                            <Button icon="pi pi-image" 
                                                v-if="!file.is_tmp && (!one_news.thumbnail || !one_news.thumbnail.file_path.includes('thumbnail_'+file.id))"
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
                            <div class="flex justify-text-end">
                                <router-link :to="{ name: 'admin-news-form'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="one_news && one_news.id ? 'Ažuriraj' : 'Novi unos'"/>
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
import { useNewsStore } from '@/stores/news'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'
import { useGlobalStore } from '@/stores/global'
import TreeSelect from 'primevue/treeselect';
import dateTool from '@/util/dateTool'
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

const newsStore = useNewsStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const globalStore = useGlobalStore();
const { user } = storeToRefs(authStore)
const { one_news, loading, tree, selectedCategories } = storeToRefs(newsStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const fileFrame = ref(null);
const timer = ref(null);
const uploadingImages = ref(false);
const selectedCategoryValues = ref(null);
const languages = ref([]);
const selectedLang = ref(false);
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
const orderNumOptions = [1,2,3,4,5,6,7,8,9,10,11,12];
const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
const form = reactive({
    title: "",
    subtitle: "",
    summary: "",
    text: "",
    category_ids: null,
    approved: true,
    selected_language_id: null,
    images: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
});
const formErrors = reactive({
    title: "",
    subtitle: "",
    summary: "",
    text: "",
    approved: "",
    category_ids: "",
    selected_language_id: "",
    images: "",
    tmp_files: "", //shows form errors for all files
});
const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.subtitle = "";
    formErrors.summary = "";
    formErrors.text = "";
    formErrors.approved = "";
    formErrors.category_ids = "";
    formErrors.selected_language_id = "";
    formErrors.images = "";
    formErrors.tmp_files = "";
}

newsStore.getNewsCategoryTree();
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
        newsStore.adminGetOneNews(route.params.id);
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
    return !one_news.value ||
    one_news.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

//fill form
watch( one_news, (newVal, oldVal) => {
    if(newVal)
    {
        setFormData(newVal);
    }
});
watch( selectedCategories, (newVal, oldVal) => {
    if(newVal)
    {
        selectedCategoryValues.value = {...newVal};
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
    formateDateFields();
    if (selectedCategoryValues.value) {
        form.category_ids = Object.keys(selectedCategoryValues.value)
    }
    //Update
    if(route.params.id)
    {
        form.id = route.params.id;
        disabledSaveBtn.value = true;
        newsStore.update(form, formErrors)
            .then(() => {
                setFormData(one_news.value);
                toast.add({severity:'success', summary: 'Ažuriranje uspešno!', detail: form.title, life: 3000});
                disabledSaveBtn.value = false;
                form.tmp_files = [];
                router.push({name: 'admin-news-form', params: { id: one_news.value.id }})
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
        newsStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Vest kreirana!', detail: form.title, life: 2000});
                //redirect user from create to update page
                disabledSaveBtn.value = false;
                form.tmp_files = [];
                router.push({name: 'admin-news', params: { id: one_news.value.id }})

            })
            .catch(() => {
                disabledSaveBtn.value = false;
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

const formateDateFields = () => {
    //form.start_date = dateTool.toDbFormat(form.start_date_formated);
}

const onFilterCategories = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        newsStore.getNewsCategories({filters: filters.value});
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
        one_news.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        one_news.value[fieldName] = null;
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
        one_news.value[fieldName] = one_news.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        one_news.value[fieldName] = one_news.value[fieldName].filter( (el, i) => i != index);
    }
}

const setThumbnail = (file) => {
    fileStore.setThumbnail(file.id)
        .then(responseData => {
            one_news.value.thumbnail = responseData;
        })
}

const onLangChange = (event) => {
    //save selected language id
    form.selected_language_id = event.value.id;
    if (event.value) {
        if(route.params.id){
            newsStore.adminGetOneNews(route.params.id, event.value.id);
        }
    }
}

</script>

<style scoped>
.admin-news-form { 
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
</style>