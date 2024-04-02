<template>
    <div class="user-form">
        <Dialog v-model:visible="openDialog" :modal="true" :style="{top: '0px'}" @hide="onCloseForm">
            <template #header>
                <h3>{{formName}}</h3>
            </template>

            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="first_name">Ime *</label>
                    <InputText id="first_name" type="text" v-model="form.first_name" :class="{'p-invalid': formErrors.first_name}" @keyup.enter="save"/>
                    <small id="first_name-help" class="p-error">{{formErrors.first_name}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="last_name">Prezime *</label>
                    <InputText id="last_name" type="text" v-model="form.last_name" :class="{'p-invalid': formErrors.last_name}" @keyup.enter="save"/>
                    <small id="last_name-help" class="p-error">{{formErrors.last_name}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="email">E-mail *</label>
                    <InputText id="email" type="text" v-model="form.email" :class="{'p-invalid': formErrors.email}" @keyup.enter="save"/>
                    <small id="email-help" class="p-error">{{formErrors.email}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="phone_number">Broj telefona *</label>
                    <InputText id="phone_number" type="text" v-model="form.phone_number" :class="{'p-invalid': formErrors.phone_number}" @keyup.enter="save"/>
                    <small id="phone_number-help" class="p-error">{{formErrors.phone_number}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="role" :class="{'p-error': formErrors.role}">Rola</label>
                    <div>
                        <Dropdown v-model="form.role" 
                            placeholder="" 
                            inputId="role"
                            :options="roles" 
                            optionLabel="name" 
                            optionValue="value" 
                            :showClear="true" 
                            :class="{'p-invalid': formErrors.role}"
                        />
                    </div>
                    <small class="p-error">{{formErrors.role}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="password">Šifra *</label>
                    <Password id="password" type="text" v-model="form.password" :class="{'p-invalid': formErrors.password}" @keyup.enter="save"/>
                    <small id="password-help" class="p-error">{{formErrors.password}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="password_confirmation">Potvrda šifre *</label>
                    <Password id="password_confirmation" type="text" v-model="form.password_confirmation" :class="{'p-invalid': formErrors.password_confirmation}" @keyup.enter="save"/>
                    <small id="password_confirmation-help" class="p-error">{{formErrors.password_confirmation}}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <div>
                        <Checkbox inputId="active" v-model="form.active" :trueValue="1" :falseValue="0" :binary="true" :class="{'p-invalid': formErrors.active}"/>&nbsp;
                        <label for="active">Aktivan</label>
                    </div>
                    <small id="active-help" class="p-error">{{formErrors.active}}</small>
                </div>
            </div>
            <div>
                <small class="p-error">{{formErrors.default}}</small>
            </div>

            <template #footer>
                <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
                <Button :label="props.id ? 'Ažuriraj' : 'Sačuvaj'" :loading="loading" @click="save" icon="pi pi-save" autofocus />
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
import Password from 'primevue/password';
import { useUserStore } from '@admin/stores/user'

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

const userStore = useUserStore();
const { user, roles, loading } = storeToRefs(userStore)
const openDialog = ref(false);
const toast = useToast();
const formName = computed(() => props.id ? 'Izmeni korisnika' : 'Dodaj novog korisnika');
const form = reactive({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: null,
    status: "",
    active: 1,
    company_name: "",
    phone_number: "",
    position: ""
});
const formErrors = reactive({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    status: "",
    active: "",
    company_name: "",
    phone_number: "",
    position: "",
    default: ""
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
});

//select user in userStore
watch( () => props.id, (newVal, oldVal) => {
    //click on update form 
    if(newVal)
    {
        userStore.getUserProfile(props.id);
    } else {
        userStore.user = null;
    }
});

//fill or empty form
watch( user, (newVal, oldVal) => {
    //click on update form 
    if(user.value)
    {
        setFormData(user.value);
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

onMounted(() => {
    
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
    openDialog.value = false;
    clearFormErrors();
};

// @hide Dialog event
const onCloseForm = () => {
    clearFormErrors();
}

// @show Dialog event
/* const onOpenForm = () => {

} */

const clearForm = () => {
    form.first_name = "";
    form.last_name = "";
    form.email = "";
    form.password = "";
    form.password_confirmation = "";
    form.role = null;
    form.status = "";
    form.active = 1;
    form.company_name = "";
    form.phone_number = "";
    form.position = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.first_name = "";
    formErrors.last_name = "";
    formErrors.email = "";
    formErrors.password = "";
    formErrors.password_confirmation = "";
    formErrors.role = "";
    formErrors.status = "";
    formErrors.active = "";
    formErrors.company_name = "";
    formErrors.phone_number = "";
    formErrors.position = "";
    formErrors.default = "";
}

const save = async () => {
    //Update
    if(props.id)
    {
        userStore.update(props.id, form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kornički nalog je ažuriran!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch(() => {
            })
    } 
    //Create
    else 
    {
        userStore.create(form, formErrors)
            .then(() => {
                toast.add({severity:'success', summary: 'Kreiran novi korisnik!', detail: form.name, life: 3000});
                closeForm();
            })
            .catch((e) => {
                const message = e.response.data.message;
                toast.add({
                    severity:'error', 
                    summary: (message === 'Korisnik već postoji') ? message : 'Greška tokom kreiranja.', 
                    detail: form.name, 
                    life: 3000
                });
            })
    }
};

</script>

<style scoped>
    .field label {
        margin-bottom: 2px;
    }
    .field .p-dropdown{
        width: 100%;
    }
</style>