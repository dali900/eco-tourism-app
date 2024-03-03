<template>
    <div class="password-form">
        <Dialog v-model:visible="openDialog" appendTo="self" :modal="true" :style="{top: '0px'}" @hide="onFormClose">
            <template #header>
                <h3>Izmena šifre</h3>
            </template>

            <div class="app-form flex flex-column">
                <div class="flex flex-column">
                    <div class="field flex flex-column">
                        <label for="password">Šifra *</label>
                        <Password
                            id="password"
                            v-model="form.password"
                            inputClass="user-password"
                            :inputProps="{autocomplete: 'off'}"
                            :class="{ 'p-invalid': formErrors.password }"
                            @keyup.enter="save"
                        />
                        <small id="password-help" class="p-error">{{
                            formErrors.password
                        }}</small>
                    </div>
                </div>
                <div class="flex flex-column">
                    <div class="field flex flex-column">
                        <label for="password_confirmation"
                            >Potvrda šifre *</label
                        >
                        <Password
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            inputClass="user-password"
                            :inputProps="{autocomplete: 'off'}"
                            :class="{ 'p-invalid':formErrors.password_confirmation }"
                            @keyup.enter="save"
                        />
                        <small
                            id="password_confirmation-help"
                            class="p-error"
                            >{{ formErrors.password_confirmation }}</small
                        >
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Otkaži" @click="closeForm" icon="pi pi-times" class="p-button-text" />
                <Button label="Ažuriraj" :loading="loading" @click="save" icon="pi pi-save" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";
import { useUserStore } from '@admin/stores/user'
import Password from "primevue/password";

const props = defineProps({
    modelValue: {
        default: false
    },
    userId: {
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const userStore = useUserStore();
const { loading} = storeToRefs(useUserStore);
const openDialog = ref(false);
const toast = useToast();
const form = reactive({
    password: "",
    password_confirmation: ""
});

//modelValue
watch( () => props.modelValue, (newVal, oldVal) => {
    openDialog.value = newVal;
});

//handle showForm changes
watch( openDialog, (newVal, oldVal) => {
    emit('update:modelValue', newVal);
});

const formErrors = reactive({
    password: "",
    password_confirmation: "",
});

const closeForm = () => {
    clearForm();
    openDialog.value = false;
};

const onFormClose = () => {
    clearForm();
}

const clearForm = () => {
    form.password = "";
    form.password_confirmation = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.password = "";
    formErrors.password_confirmation = "";
};

const save = async () => {
    userStore.updatePassword(props.userId, form, formErrors)
        .then(() => {
            toast.add({severity:'success', summary: 'Šifra je ažurirana!', detail: form.title, life: 3000});
            closeForm();
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
        })
};


</script>

<style lang="scss" scoped>

.p-dialog {
    .field {
        width: 100%;
        margin-top: 1.2rem;
        margin-bottom: 0px;
    }
}
</style>