<template>
    <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="onHide">
        <template #header>
            <h3>{{ form.name ? 'Izmeni' : 'Dodaj novu kategoriju'}}</h3>
        </template>

        <div class="app-form flex flex-column">
            <div class="field flex flex-column mb-5">
                <span class="p-float-label"></span>
                <label for="name-help">Jezik</label>
                <Dropdown
                    v-model="selectedLang" 
                    class="w-full"
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
                                        category &&
                                        category.translations && 
                                        category.translations.find(t => t.language_id == slotProps.option.id)
                                    ) 
                                    //slotProps.option.lang_code == 'sr-latin'
                                " 
                                class="pi pi-check" style="color: green"></i>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="field flex flex-column">
                <span class="p-float-label">
                    <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}" @keyup.enter="save"/>
                    <label for="name-help">Naziv</label>
                </span>
                <small id="name-help" class="p-error">{{formErrors.name}}</small>
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
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useAttractionStore } from '@/stores/attraction'
import { useGlobalStore } from '@/stores/global'

const props = defineProps({
    modelValue: {
        default: false
    },
    formData: {
        default: null
    },
    categoryStore: {
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'created', 'updated']);

const globalStore = useGlobalStore();
const attractionStore = useAttractionStore();
const { category, loading } = storeToRefs(attractionStore)
const openDialog = ref(false);
const toast = useToast();
const languages = ref([]);
const selectedLang = ref(false);

const form = reactive({
    name: "",
    parent_id: null,
    selected_language_id: "",
});
const formErrors = reactive({
    name: "",
    parent_id: "",
    selected_language_id: ""
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    //reopens empty form again (if prev had errors then clear form)
    if(!props.formData){
        clearForm();
    } else {
        setFormData(props.formData);
    }
});

//formData
watch( () => props.formData, (newVal, oldVal) => {
    //click on update form 
    if(newVal)
    {
        setFormData(newVal);
    }
    //add new resource
    else 
    {
        clearForm();
    }
});

//TODO: logika nejasna, refaktorisati
//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
    if (newVal) {
        globalStore.getLanguages().then(responseData => {
            if(props.formData && props.formData.id){
                languages.value = responseData;
                selectDefaultLanguage();
                attractionStore.getCatagory(props.formData.id, selectedLang.value.id);
            } else {
                //TODO: kreirati konstantu za default jezik
                //Za sada defualt jezik je sr latinica, za drugi jezik potrebno je u lokal storage sacuvati lang code
                languages.value = responseData.filter( l => l.lang_code == 'sr-latin');
                selectDefaultLanguage();
            }
        })
    }
});

watch( languages, (newVal, oldVal) => {
    if(newVal && !selectedLang.value && languages.value && languages.value.length)
    {
        selectDefaultLanguage();
    }
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

const closeAndClearForm = () => {
    clearForm();
    closeForm();
};

const closeForm = () => {
    openDialog.value = false;
};

const clearForm = () => {
    form.name = "";
    form.parent_id = null;
    form.selected_language_id = "";
    formErrors.name = "";
    formErrors.parent_id = "";
    formErrors.selected_language_id = "";
    formErrors.default = "";
};

const selectDefaultLanguage = () => {
    let langId = null;
    if (languages && languages.value.length) {
        langId = languages.value.find(l => l.lang_code == 'sr-latin');
        selectedLang.value = langId;
        form.selected_language_id = selectedLang.value.id;
    }
    return langId;
}

const save = async () => {
    //Update
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        attractionStore.updateCategory(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kategorija je ažuriran!', detail: form.name, life: 3000});
                if (selectedLang.value && selectedLang.value.lang_code === 'sr-latin') {
                    emit('updated', responseData);
                }
                closeAndClearForm();
            })
            .catch((err) => {
                console.log(err);
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
            })
    } 
    //Create
    else 
    {
        attractionStore.createCategory(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreiran nova kategorija!', detail: form.name, life: 3000});
                console.log(responseData);
                emit('created', responseData);
                closeAndClearForm();
            })
            .catch((err) => {
                console.log(err);
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const onHide = () => {
    clearForm();
}

const onLangChange = (event) => {
    //save selected language id
    form.selected_language_id = event.value.id;
    if (event.value && props.formData?.id) {
        //fetch translations
        attractionStore.getCatagory(props.formData.id, event.value.id)
            .then((responseData) => {
                console.log(responseData);
                form.name = responseData.name;
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

</script>

<style>

</style>