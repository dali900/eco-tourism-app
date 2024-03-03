<template>
    <div class="admin-regulation p-3">
        <div class="loading" v-if="!regulation">
            <div v-if="loading">Učitava se...</div>
            <div v-else>Nema podataka.</div>
        </div>
        <div class="regulation-content">
            <div class="grid" v-if="authStore.hasAuthorAccess()">
                <div class="col-12 md:col-6 lg:col-6">
                    <div class="preview">
                        <Card>
                            <template #title>
                                <div v-if="regulation && regulation.name">{{regulation.name}}</div>
                                <div v-else>Novi propis</div>                              
                            </template>
                            <template #content>
                                <small v-if="regulation && (!regulation.pdf_file && !regulation.html_files)">Nema fajla za pregled.</small> 
                                <div class="file-preview">
                                    <template v-if="regulation">
                                        <iframe v-if="regulation.html_files?.length && regulation.html_file" :src="baseUrl+regulation.html_file.file_url" policy="SAMEORIGIN"></iframe>
                                        <iframe v-else-if="regulation.pdf_file" :src="baseUrl+regulation.pdf_file.file_url" policy="SAMEORIGIN"></iframe>
                                    </template>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
                <div class="field col-12 md:col-6 lg:col-6 align-self-start">
                    <div class="grid">
                        <div class="field col-12">
                            <label for="name" :class="{'p-error': formErrors.name}">Naziv *</label>
                            <div>
                                <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.name}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="messenger" :class="{'p-error': formErrors.messenger}">Glasilo</label>
                            <div>
                                <Textarea id="messenger" type="text" v-model="form.messenger" :class="{'p-invalid': formErrors.messenger}" @keyup.enter="save" rows="4"/>
                            </div>
                            <small class="p-error">{{formErrors.messenger}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="name" :class="{'p-error': formErrors.regulation_root_type_id}">{{getSelectedApp() == 'bzr' ? 'Vrsta *' : 'Oblast *'}}</label>
                            <div>
                                <Dropdown v-model="typeDropdowns.values.rootType" 
                                    placeholder="" 
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="regulationRootTypes" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.regulation_root_type_id}"
                                    @change="onTypeIdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.regulation_root_type_id}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4" v-if="getSelectedApp() != 'bzr'">
                            <label for="name" :class="{'p-error': formErrors.regulation_type_id}">Vrsta propisa</label>
                            <div>
                                <Dropdown v-model="typeDropdowns.values.subType1" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži vrste propisa"
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="typeDropdowns.options.subType1" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.regulation_type_id}"
                                    @filter="onFilterRegulationType"
                                    @change="onRegulationSub1TypeIdChange"
                                />
                            </div>
                            <small class="p-error">{{formErrors.regulation_type_id}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4" v-if="getSelectedApp() == 'zzs'">
                            <label for="name" :class="{'p-error': formErrors.regulation_type_id}">Podvrsta</label>
                            <div>
                                <Dropdown v-model="typeDropdowns.values.subType2" 
                                    placeholder="" 
                                    filterPlaceholder="Pretraži vrste propisa"
                                    optionLabel="name" 
                                    optionValue="id" 
                                    :options="typeDropdowns.options.subType2" 
                                    :filter="true" 
                                    :showClear="true" 
                                    :class="{'p-invalid': formErrors.regulation_type_id}"
                                    @filter="onFilterRegulationType"
                                />
                            </div>
                            <small class="p-error">{{formErrors.regulation_type_id}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
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
                            <label for="version_release_date_formated" :class="{'p-error': formErrors.version_release_date}">Datum objavljivanja verzije</label>
                            <div>
                                <Calendar inputId="version_release_date_formated" v-model="form.version_release_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.version_release_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.version_release_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="text_release_date_formated" :class="{'p-error': formErrors.text_release_date}">Datum objavljivanja osnovnog teksta</label>
                            <div>
                                <Calendar inputId="text_release_date_formated" v-model="form.text_release_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.text_release_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.text_release_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="int_start_date_formated" :class="{'p-error': formErrors.int_start_date}">Datum stupanja na snagu međunarodnog ugovora</label>
                            <div>
                                <Calendar inputId="int_start_date_formated" v-model="form.int_start_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.int_start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.int_start_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="text_start_date_formated" :class="{'p-error': formErrors.text_start_date}">Datum početka primene</label>
                            <div>
                                <Calendar inputId="text_start_date_formated" v-model="form.text_start_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.text_start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.text_start_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="end_date_formated" :class="{'p-error': formErrors.end_date}">Datum prestanka važenja propisa</label>
                            <div>
                                <Calendar inputId="end_date_formated" v-model="form.end_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.end_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.end_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="use_start_date_formated" :class="{'p-error': formErrors.use_start_date}">Datum stupanja na snagu verzije propisa</label>
                            <div>
                                <Calendar inputId="use_start_date_formated" v-model="form.use_start_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.use_start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.use_start_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="legal_predecessor_end_date_formated" :class="{'p-error': formErrors.legal_predecessor_end_date}">Datum prestanka važenja pravnog prethodnika</label>
                            <div>
                                <Calendar inputId="legal_predecessor_end_date_formated" v-model="form.legal_predecessor_end_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.legal_predecessor_end_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                            </div>
                            <small class="p-error">{{formErrors.legal_predecessor_end_date}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="basis" :class="{'p-error': formErrors.basis}">Osnova za donošenje</label>
                            <div>
                                <InputText id="basis" type="text" v-model="form.basis" :class="{'p-invalid': formErrors.basis}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.basis}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="invalid_regulation" :class="{'p-error': formErrors.invalid_regulation}">Propis koji je prestao da važi</label>
                            <div>
                                <InputText id="invalid_regulation" type="text" v-model="form.invalid_regulation" :class="{'p-invalid': formErrors.invalid_regulation}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.invalid_regulation}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="invalid_basis" :class="{'p-error': formErrors.invalid_basis}">Norma za prestanak važenja</label>
                            <div>
                                <InputText id="invalid_basis" type="text" v-model="form.invalid_basis" :class="{'p-invalid': formErrors.invalid_basis}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.invalid_basis}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <label for="historical_version" :class="{'p-error': formErrors.historical_version}">Istorijska verzija propisa</label>
                            <div>
                                <InputText id="historical_version" type="text" v-model="form.historical_version" :class="{'p-invalid': formErrors.historical_version}" @keyup.enter="save"/>
                            </div>
                            <small class="p-error">{{formErrors.historical_version}}</small>
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
                                        :disabled="wordLoading || loading"
                                        @upload="onUpload($event, 'download_file')" 
                                        @before-send="beforeSend"
                                        @before-upload="beforeUploadFileForDownload"
                                    />
                                    <ProgressSpinner v-if="wordLoading"/>
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
                                    :disabled="htmlLoading || loading"
                                    @upload="onMultipleUpload($event, 'html_files')" 
                                    @before-send="beforeSend"
                                    @before-upload="beforeUploadHtml"
                                />
                                <ProgressSpinner v-if="htmlLoading"/>
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
                                <router-link :to="{ name: 'AdminRegulations'}" class="btn-link">
                                    <Button label="Nazad" icon="pi pi-arrow-left" class="mr-2" />
                                </router-link>
                                <Button label="Sačuvaj" icon="pi pi-check" @click="save" :loading="loading" :disabled="disabledSaveBtn" :title="regulation && regulation.id ? 'Ažuriraj' : 'Novi unos'"/>
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
import { useRegulationStore } from '@admin/stores/regulation'
import { useAuthStore } from '@/stores/auth'
import { useFileStore } from '@admin/stores/file'
import { getSelectedApp } from '../../util/general'
import dateTool from '@/util/dateTool'
import NoAccess from '../noAccess/NoAccess.vue'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const baseUrl = import.meta.env.VITE_BASE_API_URL;
const uploadUrl = baseUrl + '/api/files/upload';
const uploadMultipleUrl = baseUrl + '/api/files/upload-multiple';
const maxFileSize = 1000000 * 10; //10MB

const regulationStore = useRegulationStore();
const authStore = useAuthStore();
const fileStore = useFileStore();
const { user } = storeToRefs(authStore)
const { regulation, regulationsTotal, loading, regulationRootTypes } = storeToRefs(regulationStore);
const { token, authToken } = storeToRefs(authStore)
const disabledSaveBtn = ref(false);
const fileFrame = ref(null);
const timer = ref(null);
const wordLoading = ref(false);
const pdfLoading = ref(false);
const htmlLoading = ref(false);
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
    regulation_type_id: null,
    name: "",
    messenger: "",
    maker: "",
    validity_level: "",
    start_date: "",
    start_date_formated: "",
    version_end_date: "",
    version_end_date_formated: "",
    version_release_date: "",
    version_release_date_formated: "",
    text_release_date: "",
    text_release_date_formated: "",
    int_start_date: "",
    int_start_date_formated: "",
    text_start_date: "",
    text_start_date_formated: "",
    end_date: ".",
    end_date_formated: "",
    use_start_date: "",
    use_start_date_formated: "",
    use_start: "",
    use_start_date_formated: "",
    legal_predecessor_end_date: "",
    legal_predecessor_end_date_formated: "",
    basis: "",
    invalid_regulation: "",
    invalid_basis: "",
    historical_version: "",
    note: "",
    approved: authStore.hasEditorAccess() ? 1 : 0,
    download_file: "",//file to display information on frontend
    pdf_file: null,//file to display information on frontend
    html_files: [],//file to display information on frontend
    tmp_files: [],//files inforamtion for backend
});
const formErrors = reactive({
    regulation_type_id: "",
    regulation_root_type_id: "",
    name: "",
    messenger: "",
    maker: "",
    validity_level: "",
    start_date: "",
    version_end_date: "",
    version_release_date: "",
    text_release_date: "",
    int_start_date: "",
    text_start_date: "",
    end_date: "",
    use_start_date: "",
    use_start: "",
    legal_predecessor_end_date: "",
    basis: "",
    invalid_regulation: "",
    invalid_basis: "",
    historical_version: "",
    note: "",
    approved: "",
    default: "",
    tmp_files: "", //shows form errors for all files
});

regulationStore.getRegulationRootTypes();
//data and props ready, dom still not
onBeforeMount( () => {
    if(route.params.regulationId){
        regulationStore.getRegulation(route.params.regulationId);
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
    return !regulation.value ||
    regulation.value.user_id === user.value.id || 
    authStore.hasEditorAccess() 
});

//fill form
watch( regulation, (newVal, oldVal) => {
    if(newVal)
    {
        setFormData(newVal);
    }
});

//load and filter dropdown options - subtypes based on root type id
watch( () => typeDropdowns.values.rootType, (newVal, oldVal) => {
    if(newVal)
    {
        regulationStore.getRegulationTypes({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => {
                typeDropdowns.options.subType1 = responseData.regulation_types.results
            })
    }
});

//load and filter dropdown options - subtypes 
watch( () => typeDropdowns.values.subType1, (newVal, oldVal) => {
    if(newVal)
    {
        regulationStore.getRegulationTypes({filters: {"parent_id": {value: newVal, matchMode: FilterMatchMode.EQUALS}}})
            .then( responseData => { 
                typeDropdowns.options.subType2 = responseData.regulation_types.results
            })
    }
});

//listen when iframe and regluation is loaded and insert html for file preview
/* watch( [fileFrame, regulation], ([newFileFrame, newRegulation]) => {
    //click on update form 
    if(newFileFrame && newRegulation)
    {
        if(regulation && fileFrame.value){
            const iframe = fileFrame.value.contentWindow.document
            iframe.open();
            iframe.write(regulation.value.file_html_doc);
            iframe.close();
        }
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

        // parents (types)
        if(data.type && data.type.ancestorsAndSelf) {
            let i = 0;
            for (const filedName in typeDropdowns.values) {
                if (typeDropdowns.values.hasOwnProperty(filedName)) {
                    const dropdownValue = typeDropdowns.values[filedName];
                    const parent = data.type.ancestorsAndSelf[i];
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
    formErrors.regulation_type_id = "";
    formErrors.name = "";
    formErrors.messenger = "";
    formErrors.file_path = "";
    formErrors.preview_file_path = "";
    formErrors.regulation_root_type_id = "";
    formErrors.name = "";
    formErrors.messenger = "";
    formErrors.maker = "";
    formErrors.validity_level = "";
    formErrors.start_date = "";
    formErrors.version_end_date = "";
    formErrors.version_release_date = "";
    formErrors.text_release_date = "";
    formErrors.int_start_date = "";
    formErrors.text_start_date = "";
    formErrors.end_date = "";
    formErrors.use_start_date = "";
    formErrors.use_start = "";
    formErrors.legal_predecessor_end_date = "";
    formErrors.basis = "";
    formErrors.invalid_regulation = "";
    formErrors.invalid_basis = "";
    formErrors.historical_version = "";
    formErrors.note = "";
    formErrors.tmp_files = "";
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
    setSelectedRegulationTypeId();
    //Update
    if(route.params.regulationId)
    {
        form.id = route.params.regulationId;
        disabledSaveBtn.value = true;
        regulationStore.update(form, formErrors)
            .then(() => {
                setFormData(regulation.value);
                toast.add({severity:'success', summary: 'Propis je ažuriran!', detail: form.name, life: 3000});
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
        regulationStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreiran novi propis!', detail: form.name, life: 2000});
                //redirect user from create to update page
                router.push({name: 'AdminRegulation', params: { regulationId: regulation.value.id }})
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
    form.start_date = dateTool.toDbFormat(form.start_date_formated);
    form.version_end_date = dateTool.toDbFormat(form.version_end_date_formated);
    form.version_release_date = dateTool.toDbFormat(form.version_release_date_formated);
    form.text_release_date = dateTool.toDbFormat(form.text_release_date_formated);
    form.int_start_date = dateTool.toDbFormat(form.int_start_date_formated);
    form.text_start_date = dateTool.toDbFormat(form.text_start_date_formated);
    form.end_date = dateTool.toDbFormat(form.end_date_formated);
    form.use_start_date = dateTool.toDbFormat(form.use_start_date_formated);
    form.use_start = dateTool.toDbFormat(form.use_start_formated);
    form.legal_predecessor_end_date = dateTool.toDbFormat(form.legal_predecessor_end_date_formated);
}

const onFilterRegulationType = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        regulationStore.getRegulationTypes({filters: filters.value});
    },400);
}

//before uploading file
const beforeSend = (event) => {
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
}

//Download file - before uploading file send additional data
const beforeUploadFileForDownload = (event) => {
    event.formData.append('file_tag', 'download-file');
    wordLoading.value = true;
}

//HTML - before uploading file send additional data
const beforeUploadHtml = (event) => {
    event.formData.append('file_tag', 'html-preview');
    event.formData.append('is_public', 1);
    htmlLoading.value = true;
}

//PDF - before uploading file send additional data
const beforeUploadPdf = (event) => {
    event.formData.append('file_tag', 'pdf-preview');
    event.formData.append('is_public', 1);
    pdfLoading.value = true;
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
    wordLoading.value = false;
    pdfLoading.value = false;
}

/* Tmp multiple files upload*/
//when upload is completed
const onMultipleUpload = (event, fieldName) => {
    const response = JSON.parse(event.xhr.response)
    if(response){
        form[fieldName] = form[fieldName].concat(response.data.files);
        form.tmp_files = form.tmp_files.concat(response.data.files);
    }
    htmlLoading.value = false;
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
        regulation.value[fieldName] = null;
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form.tmp_files = form.tmp_files.filter( (el, i) => el.file_path != file.file_path);
        form[fieldName] = null;
        regulation.value[fieldName] = null;
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
        regulation.value[fieldName] = regulation.value[fieldName].filter( (el, i) => i != index);
    } else {
        //delete saved file
        await fileStore.delete(file.file_path);
        form[fieldName] = form[fieldName].filter( (el, i) => i != index);
        regulation.value[fieldName] = regulation.value[fieldName].filter( (el, i) => i != index);
    }
}

// on change 2. dropdown gets new options, and 3. dropdown options will be empty
const onTypeIdChange = (event) => {
    typeDropdowns.values.subType1 = null;
    typeDropdowns.options.subType1 = null;
    onRegulationSub1TypeIdChange(null);
}

const onRegulationSub1TypeIdChange = (event) => {
    typeDropdowns.values.subType2 = null;
    typeDropdowns.options.subType2 = null;
    //call every dropdown change event except the last one
    //onRegulationSub2TypeIdChange(null);
}

//get type_id
const setSelectedRegulationTypeId = () => {
    form.regulation_type_id = typeDropdowns.values.subType2 
        || typeDropdowns.values.subType1 
        || typeDropdowns.values.rootType;
}

</script>

<style scoped>
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