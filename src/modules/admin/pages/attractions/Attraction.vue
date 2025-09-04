<template>
    <div class="admin-attraction p-3">
        <div class="loading" v-if="!attraction">
            <div v-if="loading">Učitava se...</div>
            <div v-else-if="route.params.attractionId">Nema podataka.</div>
        </div>
        <div class="attraction-content">
            <div class="header">
                <div class="title">
                    <h2 v-if="route.params.attractionId">Znamenitost</h2>
                    <h2 v-else>Nova znamenitost</h2>
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
                                            attraction &&
                                            attraction.translations && 
                                            attraction.translations.find(t => t.language_id == slotProps.option.id)
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
                            <div class="error-field">
                                <small class="p-error">{{formErrors.name}}</small>
                            </div>
                        </div>
                        <div class="field col-12">
                            <label for="summary" :class="{'p-error': formErrors.summary}">Sažetak *</label>
                            <div>
                                <InputText id="summary" type="text" v-model="form.summary" :class="{'p-invalid': formErrors.summary}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.summary}}</small>
                            </div>
                        </div>
                        <div class="field col-12">
                            <label for="content" :class="{'p-error': formErrors.content}">Sadržaj *</label>
                            <div :class="{'error-border': formErrors.content}">
                                <!-- <Textarea id="content" type="text" v-model="form.content" :class="{'p-invalid': formErrors.content}" rows="10"/> -->
                                <jodit-editor 
                                    v-model="form.content" 
                                    
                                    :config="{height: 400, zIndex: 21}"
                                    :buttons="editorButtons"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.content}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.category_id}">Kategorija *</label>
                            <div>
                                <Dropdown v-model="categoryDropdowns.values.rootCategory" 
                                    placeholder="" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="rootCategories" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.category_id}"
                                    @change="onCategoryIdChange"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.category_id}}</small>
                            </div>
                        </div>
                        <!-- <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.order_num}">Redni broj za naj noviji sadržaj</label>
                            <div>
                                <Dropdown v-model="form.order_num" 
                                    placeholder="" 
                                    :options="orderNumOptions" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.order_num}"
                                    @change="onOrderNumChange"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.order_num}}</small>
                            </div>
                        </div> -->
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="place_id" :class="{'p-error': formErrors.place_id}">Mesto</label>
                            <div>
                                <Dropdown v-model="form.place_id" 
                                    placeholder="" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    filterPlaceholder="Pretraži"
                                    :options="places" 
                                    :showClear="true" 
                                    :filter="true"
                                    :class="{'p-invalid': formErrors.place_id}"
                                    @change="onPlaceIdChange"
                                    @filter="onFilterPlacesDropdown"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.place_id}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="phone_number" :class="{'p-error': formErrors.phone_number}">Kontakt telefon</label>
                            <div>
                                <InputText id="phone_number" 
                                    v-model="form.phone_number" 
                                    type="text" 
                                    placeholder="0641234567"
                                    :class="{'p-invalid': formErrors.phone_number}" 
                                    @keyup.enter="save"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.phone_number}}</small>
                            </div>
                        </div>
                        <div class="field col-12">
                            <div>
                                <Checkbox
                                    inputId="suggested"
                                    v-model="form.suggested"
                                    :binary="true"
                                    :class="{ 'p-invalid': formErrors.suggested }"
                                />&nbsp;
                                <label for="suggested" :class="{'p-error': formErrors.suggested}">Preporuka</label>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.suggested}}</small>
                            </div>
                        </div>
                        <div class="field col-12" v-if="authStore.hasEditorAccess()">
                            <div>
                                <Checkbox
                                    inputId="visible"
                                    v-model="form.visible"
                                    :binary="true"
                                    :class="{ 'p-invalid': formErrors.visible }"
                                />&nbsp;
                                <label for="visible" :class="{'p-error': formErrors.visible}">Vidljiv</label>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.visible}}</small>
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
                                            <span :title="file.name" :class="{thumbnail: attraction && attraction.thumbnail?.file_path.includes('thumbnail_'+file.id)}">
                                                <span v-if="file.is_tmp" class="file-not-saved">*</span>
                                                {{file.original_name}}
                                            </span> 
                                            <Button icon="pi pi-image" 
                                                v-if="!file.is_tmp && (!attraction.thumbnail || !attraction.thumbnail.file_path.includes('thumbnail_'+file.id))"
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
import { useAttractionStore } from '@/stores/attraction'
import { useAuthStore } from '@/stores/auth'
import { useGlobalStore } from '@/stores/global'
import { usePlaceStore } from '@/stores/place'
import { useFileStore } from '@admin/stores/file'
import { getSelectedApp } from '../../util/general'
import dateTool from '@/util/dateTool'
import { editorButtons } from '@/constants/editorOptions'
import { JoditEditor } from 'jodit-vue'
import 'jodit/build/jodit.min.css'
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

const attractionStore = useAttractionStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const globalStore = useGlobalStore();
const placeStore = usePlaceStore();
const { user } = storeToRefs(authStore)
const { attraction, loading, rootCategories } = storeToRefs(attractionStore);
const { places } = storeToRefs(placeStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const timer = ref(null);
const uploadingImages = ref(false);
const languages = ref([]);
const selectedLang = ref(false);
//Order has to mutch with html order
//!TODO: replace with TreeSelect component
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
    category_id: null,
    name: "",
    order_num: null,
    place_id: null,
    phone_number: null,
    suggested: false,
    visible: true,
    summary: "",
    content: "",
    images: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
    selected_language_id: null
});
const formErrors = reactive({
    category_id: "",
    order_num: "",
    place_id: "",
    phone_number: "",
    suggested: "",
    visible: "",
    name: "",
    summary: "",
    content: "",
    tmp_files: "", //shows form errors for all files
    selected_language_id: "",
});
const clearFormErrors = () => {
    formErrors.category_id = "";
    formErrors.order_num = "";
    formErrors.place_id = "";
    formErrors.phone_number = "";
    formErrors.suggested = "";
    formErrors.visible = "";
    formErrors.name = "";
    formErrors.summary = "";
    formErrors.content = "";
    formErrors.tmp_files = "";
    formErrors.selected_language_id = "";
}

globalStore.getLanguages().then(responseData => {
    if(route.params.attractionId){
        languages.value = responseData;
    } else {
        //Za sada defualt jezik je sr latinica, za drugi jezik potrebno je u lokal storage sacuvati lang code
        languages.value = responseData.filter( l => l.lang_code == 'sr-latin')
    }
})
placeStore.getAll();
attractionStore.getRootCategories();
//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.attractionId){
        attractionStore.adminGetAttraction(route.params.attractionId);
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

watch( languages, (newVal, oldVal) => {
    if(newVal && !selectedLang.value && languages.value && languages.value.length)
    {
        selectedLang.value = languages.value.find(l => l.lang_code == 'sr-latin');
        form.selected_language_id = selectedLang.value.id;
    }
});


//load and filter dropdown options - subtypes based on root type id
watch( () => categoryDropdowns.values.rootCategory, (newVal, oldVal) => {
    if(newVal)
    {
        attractionStore.getCategories({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => {
                categoryDropdowns.options.subCategory1 = responseData.results
            })
    }
});

/*//load and filter dropdown options - subtypes 
watch( () => categoryDropdowns.values.subCategory1, (newVal, oldVal) => {
    if(newVal)
    {
        attractionStore.getCategories({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
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

        //Append doropdown option if not exists in paginated options
        if (places.value && data.place) {
            const index = places.value.findIndex( el => el.id == data.id);
            if (index == -1) {
                places.value.push({id: data.place.id, name: data.place.name});
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
        //translation API
        /* if (selectedLang.value && selectedLang.value.lang_code !== 'sr-latin') {
            attractionStore.updateOrCreateTranslation(form, formErrors, selectedLangId)
                .then(() => {
                    setFormData(attraction.value);
                    toast.add({severity:'success', summary: "Ažuriranje na jeziku '"+selectedLang.value.name+"' uspešno!", detail: form.name, life: 3000});
                    disabledSaveBtn.value = false;
                    form.tmp_files = [];
                })
                .catch(() => {
                    toast.add({severity:'error', summary: 'Greška tokom ažuriranja jezika.', detail: form.name, life: 3000});
                    disabledSaveBtn.value = false;
                })
        } else { */
        //Default API
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
        //}
    } 
    //Create
    else 
    {
        disabledSaveBtn.value = true;
        attractionStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Znamenitost kreirana!', detail: form.name, life: 2000});
                //redirect user from create to update page
                router.push({name: 'AdminAttractions'})
                disabledSaveBtn.value = false;
                form.tmp_files = [];

            })
            .catch((err) => {
                console.log(err);
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
        attractionStore.getCategories({filters: filters.value});
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
        header: 'Brisanje',
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

const setThumbnail = (file) => {
fileStore.setThumbnail(file.id)
    .then(responseData => {
        attraction.value.thumbnail = responseData;
    })
}

// on change 2. dropdown gets new options, and 3. dropdown options will be empty
const onCategoryIdChange = (event) => {
    categoryDropdowns.values.subCategory1 = null;
    categoryDropdowns.options.subCategory1 = null;
    onSubCategory1IdChange(null);
    clearFormErrors();
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

const onPlaceIdChange = () => {
    clearFormErrors();
}

const onFilterPlacesDropdown = (event) => {
    placeStore.getAll({filters: {'name': {value: event.value, matchMode: FilterMatchMode.STARTS_WITH}}})
}

const onLangChange = (event) => {
    //save selected language id
    form.selected_language_id = event.value.id;
    if (event.value) {
        attractionStore.adminGetAttraction(route.params.attractionId, event.value.id);
    }
}

</script>

<style scoped lang="scss">
.admin-attraction { 
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
    height: 500px;
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
.error-border {
    border: 1px solid red;
}
</style>