<template>
    <div class="regulation-form">
        <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="onHide">
            <template #header>
                <h3>{{formName}}</h3>
            </template>

            <div class="app-form flex flex-column">
                <div class="field flex flex-column">
                    <span class="p-float-label">
                        <InputText id="name" type="text" v-model="form.name" :class="{'p-invalid': formErrors.name}" @keyup.enter="save"/>
                        <label for="name-help">Naziv</label>
                    </span>
                    <small id="name-help" class="p-error">{{formErrors.name}}</small>
                </div>
                <div class="field flex flex-column">
                    <Dropdown v-model="form.parent_id" 
                        placeholder="Nadtip" 
                        inputId="parent_id"
                        optionLabel="name_parent_name" 
                        optionValue="id" 
                        :options="filteredRegulationTypes" 
                        :showClear="true"
                        :filter="true"  
                        :class="{'p-invalid': formErrors.parent_id}"
                        @filter="onFilterRegulationType"
                    />
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
    </div>
</template>

<script setup>
import { ref, toRefs, toRef, unref, reactive, computed, watch, onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useRegulationStore } from '@admin/stores/regulation'

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

const regulationStore = useRegulationStore();
const { regulationTypes, loading } = storeToRefs(regulationStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.formData && props.formData.id ? 'Izmeni tip propis' : 'Dodaj novi tip propis');
const formData = toRef(props, 'formData');
const timer = ref(null);
const filteredRegulationTypesInitial = ref([]);
const filteredRegulationTypes = ref([]);

const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.CONTAINS}
});

const sort = ref({
    sortField: "created_at",
    sortOrder: -1,
});

const form = reactive({
    name: "",
    parent_id: null
});
const formErrors = reactive({
    name: "",
    parent_id: ""
});

//init data
watch( regulationTypes, (newVal, oldVal) => {
    filteredRegulationTypes.value = [...unref(regulationTypes)]
    filteredRegulationTypesInitial.value = [...unref(regulationTypes)]
}, {deep: true});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
    //reopens empty form again (if prev had errors then clear form)
    if(!props.formData){
        clearForm();
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

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

onBeforeMount(() => {
    regulationStore.getFilterRegulationRootTypes({sort: sort.value, filters: filters.value})
        .then(responseData => {
            filteredRegulationTypesInitial.value = [...responseData.regulation_types.results];
            filteredRegulationTypes.value = responseData.regulation_types.results;
        })
});

onMounted(() => {   
});


const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (props.formData.hasOwnProperty(field)) {
                const formDataField = props.formData[field];
                form[field] = formDataField;
            }
        }
        if (formData.parent_relation) {
            filteredRegulationTypes.value.unshift(formData.parent_relation)
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
    formErrors.name = "";
    formErrors.parent_id = "";
    formErrors.default = "";
};

const save = async () => {
    //Update
    if(props.formData && props.formData.id)
    {
        form.id = props.formData.id;
        regulationStore.updateType(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Tip propis je ažuriran!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.name, life: 3000});
            })
    } 
    //Create
    else 
    {
        regulationStore.createType(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi tip propis!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
            })
    }
};

const onHide = () => {
    filteredRegulationTypes.value = [...unref(filteredRegulationTypesInitial)];
}

const onFilterRegulationType = (event) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        filters.value.name.value = event.value;
        regulationStore.getFilterRegulationRootTypes({sort: sort.value, filters: filters.value})
            .then(responseData => {
                filteredRegulationTypes.value = responseData.regulation_types.results;
            })
    },400);
}

</script>

<style>

</style>