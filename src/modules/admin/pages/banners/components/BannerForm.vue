<template>
    <div class="banner-form">
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
                    <label for="name-help">Sadržaj</label>
                    <span class="p-float-label">
                        Editor
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.content}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.position}">Pozicija banera</label>
                    <InputText id="position" type="text" v-model="form.position" :class="{'p-invalid': formErrors.position}"/>
                    <small id="name-help" class="p-error">{{formErrors.position}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.button_title}">Tekst dugmeta</label>
                    <InputText id="button_title" type="text" v-model="form.button_title" :class="{'p-invalid': formErrors.button_title}"/>
                    <small id="name-help" class="p-error">{{formErrors.button_title}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.question_label}">Tekst za polje pitanje</label>
                    <Textarea id="question_label" type="text" v-model="form.question_label" :class="{'p-invalid': formErrors.question_label}"/>
                    <small id="name-help" class="p-error">{{formErrors.question_label}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.message}">Poruka kontakt forme</label>
                    <Textarea id="message" type="text" v-model="form.message" :class="{'p-invalid': formErrors.message}"/>
                    <small id="name-help" class="p-error">{{formErrors.message}}</small>
                </div>
                <div>
                    <small class="p-error">{{formErrors.default}}</small>
                </div>
            </div>

            <template #footer>
                <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
                <Button :label="props.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useBannerStore } from '@admin/stores/banner';

const props = defineProps({
    modelValue: {
        default: false
    },
    hideFields: {
        default: null
    },
    id: {
        default: null
    },
});

const emit = defineEmits(['update:modelValue', 'saved']);
const bannerStore = useBannerStore();
const { banner, loading } = storeToRefs(bannerStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.id ? 'Izmeni baner' : 'Dodaj novbaner');
const form = reactive({
    title: "",
    content: "",
    position: "",
    button_title: "",
    question_label: "",
    message: "",
});
const timer = ref(null);
const joditButtons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "link",
    "table",
    "hr",
    "source"
];

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    setFormData(banner.value);
});

//fetch banner
watch( () => props.id, (newVal, oldVal) => {
    //click on update form 
    if(newVal)
    {
        bannerStore.getBanner(props.id);
    } else {
        bannerStore.banner = null;
    }
});

//formData
watch( banner, (newVal, oldVal) => {
    setFormData(banner.value);
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

onMounted(() => {
    
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const formErrors = reactive({
    title: "",
    content: "",
    position: "",
    button_title: "",
    question_label: "",
    message: "",
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (formData.hasOwnProperty(field)) {
                const formDataField = formData[field];
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
    form.content = "";
    form.position = "";
    form.button_title = "";
    form.question_label = "";
    form.message = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.content = "";
    formErrors.position = "";
    formErrors.button_title = "";
    formErrors.question_label = "";
    formErrors.message = "";
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
    if(props.id)
    {
        form.id = props.id;
        
        bannerStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Baner je ažuriran!', life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', life: 3000});
            })
    } 
    //Create
    else 
    {
        bannerStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreirano nov baner!', life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', life: 3000});
            })
    }
};

</script>

<style lang="scss" scoped>
.p-dialog {
    width: 80%;
    .field {
        width: 100%;
        margin-top: 1.2rem;
        margin-bottom: 0px;
    }
}
.p-dropdown-panel {
    z-index: 3 !important;
}
</style>