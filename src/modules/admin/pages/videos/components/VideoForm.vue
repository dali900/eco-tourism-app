<template>
    <div class="video-form">
        <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
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
                        <InputText id="video_link" type="text" v-model="form.video_link" :class="{'p-invalid': formErrors.video_link}"/>
                        <label for="name-help">Video link</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.video_link}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <Calendar id="publish_date" v-model="form.publish_date" dateFormat="dd.mm.yy." :class="{'p-invalid': formErrors.publish_date}"/>
                        <label for="name-help">Datum objavljivanja</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.publish_date}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <Textarea id="description" type="textarea" v-model="form.description" :class="{'p-invalid': formErrors.description}"/>
                        <label for="name-help">Opis</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.description}}</small>
                </div>
                <div class="field flex flex-column">
                    <FileUpload
                        mode="basic" 
                        name="files[]" 
                        chooseLabel="Okači fajlove"
                        :auto="true" 
                        :multiple="true"
                        :withCredentials="true"
                        :url="uploadUrl" 
                        :maxFileSize="maxFileSize" 
                        :disabled="uploadLoading"
                        @upload="onUpload" 
                        @before-send="beforeSend"
                    />
                    <template v-if="uploadLoading">
                        Upload-ovanje fajlova. Molimo sačekajte...
                    </template>
                    <template v-else>
                        <div>
                            <template v-for="(file, index) of form.files">
                                <div class="delete-file">
                                    <span :title="file.file_name">
                                        {{file.file_name}}
                                    </span> 
                                    <Button icon="pi pi-trash" @click="confirmDeleteFile(index)" class="p-button-rounded p-button-danger p-button-text p-button-sm delete-file-btn" />
                                </div>
                            </template>
                        </div>
                    </template>
                    <small id="name-help" class="p-error">{{formErrors.files}}</small>
                </div>
                <div>
                    <small class="p-error">{{formErrors.default}}</small>
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
import { useVideoStore } from '@admin/stores/video';
import Calendar from 'primevue/calendar';
import { useAuthStore } from '@/stores/auth';

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
const maxFileSize = 1000000 * 100; //100MB
const authStore = useAuthStore();
const { token, authToken } = storeToRefs(authStore);
const videoStore = useVideoStore();
const { loading, uploadLoading } = storeToRefs(videoStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni video' : 'Dodaj nov video');
const form = reactive({
    title: "",
    video_link: "",
    publish_date: "",
    files: "",
    description: ""
});

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
    video_link: "",
    publish_date: "",
    files: "",
    description: ""
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
    form.video_link = "";
    form.publish_date = "";
    form.files = "";
    form.description = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.video_link = "";
    formErrors.publish_date = "";
    formErrors.files = "";
    formErrors.description = "";
    formErrors.default = "";
};

const onUpload = (event) => {
    console.log('onUpload');
    const response = JSON.parse(event.xhr.response);
    if(response){
        form.files = response.data.files;
    }
    console.log('aaaaaa');
    videoStore.setUploadLoading(false);
};

const beforeSend = (event) => {
    videoStore.setUploadLoading(true);
    event.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    event.xhr.setRequestHeader('X-CSRF-TOKEN', token.value)
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + authToken.value);
};

const confirmDeleteFile = (index) => {
    if(form.files && form.files[index]){
        form.files.splice(index, 1);
    }
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
        
        videoStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Video je ažuriran!', life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', life: 3000});
            })
    } 
    //Create
    else 
    {
        videoStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi video!', life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', life: 3000});
            })
    }
};

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