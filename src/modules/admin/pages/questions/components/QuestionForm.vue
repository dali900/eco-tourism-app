<template>
    <div class="question-form">
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
                    <label for="name-help">Pitanje</label>
                    <span class="p-float-label">
                        Editor
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.question}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name-help">Odgovor</label>
                    <span class="p-float-label">
                        Editor
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.answer}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="author" type="text" v-model="form.author" :class="{'p-invalid': formErrors.author}"/>
                        <label for="name-help">Autor</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.author}}</small>
                </div>
                <div class="field flex flex-column">
                    <label for="name" :class="{'p-error': formErrors.question_type_id}">Kategorija pitanja i odgovora</label>
                    <div>
                        <Dropdown 
                            v-model="form.question_type_id" 
                            placeholder="" 
                            filterPlaceholder="Pretraži kategorije članaka"
                            :options="questionTypes" 
                            optionLabel="name" 
                            optionValue="id" 
                            :filter="true" 
                            :showClear="true" 
                            :class="{'p-invalid': formErrors.question_type_id}"
                            class="question-type-dropdown"
                            @filter="onFilterQuestionType"
                        />
                    </div>
                    <small class="p-error">{{formErrors.question_type_id}}</small>
                </div>
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <Calendar id="publish_date" v-model="form.publish_date" dateFormat="dd.mm.yy." :class="{'p-invalid': formErrors.publish_date}"/>
                        <label for="name-help">Datum objavljivanja</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.publish_date}}</small>
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
                <div>
                    <small class="p-error">{{formErrors.default}}</small>
                </div>
            </div>

            <template v-if="canEdit" #footer>
                <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
                <Button :label="props.formData && props.formData.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useQuestionStore } from '@admin/stores/question';
import Calendar from 'primevue/calendar';
import { FilterMatchMode } from 'primevue/api';
import { useAuthStore } from '@/stores/auth'

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

const authStore = useAuthStore();
const questionStore = useQuestionStore();
const { user } = storeToRefs(authStore)
const { loading, questionTypes } = storeToRefs(questionStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni pitanje i odgovor' : 'Dodaj novo pitanje i odgovor');
const form = reactive({
    title: "",
    question: "",
    answer: "",
    author: "",
    publish_date: "",
    question_type_id: "",
    approved: authStore.hasEditorAccess() ? 1 : 0
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

const filters = ref({
    'title': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});
questionStore.getQuestionTypes({filters: filters.value});
const onFilterQuestionType = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        questionStore.getQuestionTypes({filters: filters.value});
    },400);
};

//Check if the user has access to edit and delete
const canEdit = computed(() => { 
    return !props.formData ||
    props.formData.user_id === user.value.id ||
    authStore.hasEditorAccess() 
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const formErrors = reactive({
    title: "",
    question: "",
    answer: "",
    author: "",
    publish_date: "",
    question_type_id: ""
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
    form.question = "";
    form.answer = "";
    form.author = "";
    form.publish_date = "";
    form.question_type_id = "";
    form.approved = 0;
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.title = "";
    formErrors.question = "";
    formErrors.answer = "";
    formErrors.author = "";
    formErrors.publish_date = "";
    formErrors.question_type_id = "";
    formErrors.approved = "";
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
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        
        questionStore.update(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Pitanje i odgovor je ažurirano!', life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', life: 3000});
            })
    } 
    //Create
    else 
    {
        questionStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreirano novo pitanje i odgovor!', life: 3000});
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
.question-type-dropdown{
    width: 100%;
}
</style>