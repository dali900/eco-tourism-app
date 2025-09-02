<template>
    <div class="admin-ad p-3">
        <div class="loading" v-if="!ad">
            <div v-if="loading">Učitava se...</div>
            <div v-else-if="route.params.id">Nema podataka.</div>
        </div>
        <div class="ad-content">
            <div class="header">
                <div class="title">
                    <h2 v-if="route.params.id">Oglas</h2>
                    <h2 v-else>Novi oglas</h2>
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
                                            ad &&
                                            ad.translations && 
                                            ad.translations.find(t => t.language_id == slotProps.option.id)
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
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="root_category" :class="{'p-error': formErrors.category_id}">Kategorija *</label>
                            <div>
                                <TreeSelect v-model="selectedCategoryValues" 
                                    :options="tree" 
                                    selectionMode="single" 
                                    display="chip" 
                                    placeholder="Izaberi kategoriju" 
                                    class="w-full" 
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.category_id}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-4 lg:col-3">
                            <label for="price" :class="{'p-error': formErrors.price}">Cena *</label>
                            <div>
                                <InputNumber v-model="form.price" inputId="price" :useGrouping="false" :class="{'p-invalid': formErrors.price}" @keyup.enter="save"/>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.price}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4 ">
                            <div class="mb-3">
                                <label for="expires_at_formated" :class="{'p-error': formErrors.currency}">Valuta *</label>
                            </div>
                            <div class="flex align-items-center gap-3 align-self-center">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="form.currency" inputId="EUR" name="currency" value="EUR" :unstyled="true" inputClass="app-radio-button"/>
                                    <label for="EUR" class="ml-2">EUR</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="form.currency" inputId="RSD" name="currency" value="RSD" :unstyled="true" inputClass="app-radio-button"/>
                                    <label for="RSD" class="ml-2">RSD</label>
                                </div>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.currency}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label label for="first_name" :class="{'p-error': formErrors.first_name}">Ime *</label>
                            <div>
                                <InputText id="first_name" 
                                    v-model="form.first_name" 
                                    type="text" 
                                    :class="{'p-invalid': formErrors.first_name}" 
                                    @keyup.enter="save"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.first_name}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label label for="last_name" :class="{'p-error': formErrors.last_name}">Prezime *</label>
                            <div>
                                <InputText id="last_name" 
                                    v-model="form.last_name" 
                                    type="text" 
                                    :class="{'p-invalid': formErrors.last_name}" 
                                    @keyup.enter="save"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.last_name}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label label for="phone_number" :class="{'p-error': formErrors.phone_number}">Telefon </label>
                            <div>
                                <InputMask
                                    id="phone"
                                    v-model="form.phone_number"
                                    mask="999/99 99 99?99"
                                    placeholder="064/12 34 567"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.phone_number}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label label for="email" :class="{'p-error': formErrors.email}">Email</label>
                            <div>
                                <InputText id="email" 
                                    v-model="form.email" 
                                    type="text" 
                                    :class="{'p-invalid': formErrors.email}" 
                                    @keyup.enter="save"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.email}}</small>
                            </div>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="expires_at_formated" :class="{'p-error': formErrors.expires_at}">Ističe *</label>
                                <div>
                                    <Calendar inputId="expires_at_formated" v-model="form.expires_at_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                                </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.expires_at_formated}}</small>
                            </div>
                        </div>
                        <div class="field col-12">
                            <label for="description" :class="{'p-error': formErrors.description}">Opis *</label>
                            <div>
                                <!-- <Textarea id="description" type="text" v-model="form.description" :class="{'p-invalid': formErrors.description}" rows="10"/> -->
                                <jodit-editor 
                                    v-model="form.description" 
                                    :config="{height: 400, zIndex: 21}"
                                    :buttons="editorButtons"
                                />
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.description}}</small>
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
                            <label for="place_id" :class="{'p-error': formErrors.place_id}">Mesto *</label>
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
                        <!-- <div class="field col-12 md:col-6 lg:col-4">
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
                        </div> -->
                        <!-- <div class="field col-12 md:col-6 lg:col-4" v-if="authStore.hasEditorAccess()">
                            <div>
                                <Checkbox
                                    inputId="approved"
                                    v-model="form.approved"
                                    :binary="true"
                                    :class="{ 'p-invalid': formErrors.approved }"
                                />&nbsp;
                                <label for="approved" :class="{'p-error': formErrors.approved}">Odobren</label>
                            </div>
                            <div class="error-field">
                                <small class="p-error">{{formErrors.approved}}</small>
                            </div>
                        </div> -->
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
                                            <span :title="file.name" :class="{thumbnail: ad && ad.thumbnail?.file_path.includes('thumbnail_'+file.id)}">
                                                <span v-if="file.is_tmp" class="file-not-saved">*</span>
                                                {{file.original_name}}
                                            </span> 
                                            <Button icon="pi pi-image" 
                                                v-if="!file.is_tmp && (!ad.thumbnail || !ad.thumbnail.file_path.includes('thumbnail_'+file.id))"
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
                            <div class="flex justify-content-end">
                                <router-link :to="{ name: 'admin-ads'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="ad && ad.id ? 'Ažuriraj' : 'Novi unos'"/>
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
import InputNumber from 'primevue/inputnumber';
import TreeSelect from 'primevue/treeselect';
import RadioButton from 'primevue/radiobutton';
import InputMask from 'primevue/inputmask';
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { useAdStore } from '@/stores/ad'
import { useAuthStore } from '@/stores/auth'
import { useGlobalStore } from '@/stores/global'
import { usePlaceStore } from '@/stores/place'
import { useFileStore } from '@admin/stores/file'
import { JoditEditor } from 'jodit-vue'
import 'jodit/build/jodit.min.css'
import { editorButtons } from '@/constants/editorOptions'
import { getSelectedApp } from '../../util/general'
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

const adStore = useAdStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const globalStore = useGlobalStore();
const placeStore = usePlaceStore();
const { user } = storeToRefs(authStore)
const { ad, loading, tree } = storeToRefs(adStore);
const { places } = storeToRefs(placeStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const timer = ref(null);
const uploadingImages = ref(false);
const selectedCategoryValues = ref(null);
const languages = ref([]);
const selectedLang = ref(false);
//Order has to mutch with html order
const orderNumOptions = [1,2,3,4,5,6,7,8,9,10,11,12];
const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
const form = reactive({
    category_id: null,
    title: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    order_num: null,
    place_id: null,
    suggested: false,
    approved: true,
    suggested: null,
    description: "",
    price: null,
    currency: null,
    expires_at: null,
    expires_at_formated: null,
    published_at: null,
    note: null,
    images: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
    selected_language_id: null
});
const formErrors = reactive({
    category_id: "",
    order_num: "",
    place_id: "",
    suggested: "",
    approved: "",
    suggested: "",
    title: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    description: "",
    price: "",
    currency: "",
    expires_at: "",
    expires_at_formated: "",
    published_at: "",
    note: "",
    tmp_files: "", //shows form errors for all files
    selected_language_id: "",
});
const clearFormErrors = () => {
    formErrors.category_id = "";
    formErrors.order_num = "";
    formErrors.place_id = "";
    formErrors.suggested = "";
    formErrors.approved = "";
    formErrors.suggested = "";
    formErrors.title = "";
    formErrors.first_name = "";
    formErrors.last_name = "";
    formErrors.phone_number = "";
    formErrors.email = "";
    formErrors.description = "";
    formErrors.price = "";
    formErrors.currency = "";
    formErrors.expires_at = "";
    formErrors.expires_at_formated = "";
    formErrors.published_at = "";
    formErrors.note = "";
    formErrors.tmp_files = "";
    formErrors.selected_language_id = "";
}

globalStore.getLanguages().then(responseData => {
    if(route.params.id){
        languages.value = responseData;
    } else {
        //Za sada defualt jezik je sr latinica, za drugi jezik potrebno je u lokal storage sacuvati lang code
        languages.value = responseData.filter( l => l.lang_code == 'sr-latin')
    }
})
placeStore.getAll();
adStore.getAdCategoryTree();
//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.id){
        adStore.adminGetAd(route.params.id);
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
    return !ad.value ||
    ad.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

//fill form
watch( ad, (newVal, oldVal) => {
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

        //Append doropdown option if not exists in paginated options
        if (places.value && data.place) {
            const index = places.value.findIndex( el => el.id == data.id);
            if (index == -1) {
                places.value.push({id: data.place.id, name: data.place.name});
            }
        }

        // parents (categories)
        if(data.category_id) {
            let selectedCategory = {};
            selectedCategory[data.category_id] = true;
            selectedCategoryValues.value = selectedCategory;
        }
    } 
}

watch( selectedCategoryValues, (newVal, oldVal) => {
    if(newVal)
    {
        form.category_id = Object.keys(newVal).pop();
    }
});

const save = async () => {
    if (!canEdit) {
        return false;
    }
    //format date fields
    clearFormErrors();
    formateDateFields();
    //Update
    if(route.params.id)
    {
        const id = route.params.id;
        disabledSaveBtn.value = true;
        adStore.update(id, form, formErrors)
            .then(() => {
                setFormData(ad.value);
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
        adStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Oglas kreirana!', detail: form.name, life: 2000});
                //redirect user from create to update page
                disabledSaveBtn.value = false;
                form.tmp_files = [];
                router.push({name: 'admin-ads'})

            })
            .catch((err) => {
                console.log(err);
                disabledSaveBtn.value = false;
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const formateDateFields = () => {
    form.expires_at = dateTool.toDbFormat(form.expires_at_formated);
}

const onFilterCategories = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        adStore.getCategories({filters: filters.value});
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
    event.formData.append('file_tag', 'image');
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
        ad.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        ad.value[fieldName] = null;
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
        ad.value[fieldName] = ad.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        ad.value[fieldName] = ad.value[fieldName].filter( (el, i) => i != index);
    }
}

const setThumbnail = (file) => {
fileStore.setThumbnail(file.id)
    .then(responseData => {
        ad.value.thumbnail = responseData;
    })
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
        adStore.adminGetAd(route.params.id, event.value.id);
    }
}

</script>

<style scoped lang="scss">
.admin-ad { 
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
</style>