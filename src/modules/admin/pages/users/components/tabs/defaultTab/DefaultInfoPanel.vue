<template>
    <ChagePasswordForm v-model="showChagePasswordForm" :userId="user?.id"></ChagePasswordForm>
    <Panel class="user-plan-card a-shadow" header="Osnovne informacije">
        <div class="user-form">
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="udf-first_name">Ime *</label>
                    <InputText
                        id="udt-first_name"
                        type="text"
                        v-model="form.first_name"
                        :class="{ 'p-invalid': formErrors.first_name }"
                        @keyup.enter="save"
                    />
                    <small id="first_name-help" class="p-error">{{
                        formErrors.first_name
                    }}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="udt-last_name">Prezime *</label>
                    <InputText
                        id="udt-last_name"
                        type="text"
                        v-model="form.last_name"
                        :class="{ 'p-invalid': formErrors.last_name }"
                        @keyup.enter="save"
                    />
                    <small id="last_name-help" class="p-error">{{
                        formErrors.last_name
                    }}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label for="udt-email">E-mail *</label>
                    <InputText
                        id="udt-email"
                        type="text"
                        v-model="form.email"
                        :class="{ 'p-invalid': formErrors.email }"
                        @keyup.enter="save"
                    />
                    <small id="email-help" class="p-error">{{
                        formErrors.email
                    }}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <label
                        for="role"
                        :class="{ 'p-error': formErrors.role }"
                        >Rola</label
                    >
                    <Dropdown
                        v-model="form.role"
                        class="roles-dropdown"
                        placeholder=""
                        inputId="role"
                        optionLabel="name"
                        optionValue="value"
                        :options="roles"
                        :showClear="true"
                        :class="{ 'p-invalid': formErrors.role }"
                    />
                    <small class="p-error">{{ formErrors.role }}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <div>
                        <Checkbox
                            inputId="active"
                            v-model="form.active"
                            :trueValue="1"
                            :falseValue="0"
                            :binary="true"
                            :class="{ 'p-invalid': formErrors.active }"
                        />&nbsp;
                        <label for="active">Aktivan</label>
                    </div>
                    <small id="active-help" class="p-error">{{
                        formErrors.active
                    }}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <div>Portali</div>
                    <div class="user-apps">
                        <div class="user-app" v-for="userApp in userApps">
                            <Checkbox
                                name="apps"
                                v-model="form.apps"
                                :inputId="userApp.appName"
                                :value="userApp.appName"
                                :class="{ 'p-invalid': formErrors.apps }"
                            />
                            &nbsp;
                            <label :for="userApp.appName">{{ userApp.title }}</label>
                        </div>
                    </div>
                    <small id="active-help" class="p-error">{{
                        formErrors.apps
                    }}</small>
                </div>
            </div>
            <div class="flex flex-column">
                <div class="field">
                    <Button label="Izmeni šifru" class="p-button-text" @click="openChagePasswordForm"/>
                </div>
            </div>
            <div>
                <small class="p-error">{{ formErrors.default }}</small>
            </div>

            <div>
                <div class="flex justify-content-between">
                <div>
                    <Button
                        label="Ažuriraj"
                        :loading="loading"
                        @click="save"
                        icon="pi pi-save"
                    />
                </div>
                <!-- <div>
                    <div>
                        <small>Kreiran: {{ user?.created_at_date_formated }}</small>
                    </div>
                    <div>
                        <small>Ažuriran: {{ user?.updated_at_date_formated }}</small>
                    </div>
                </div> -->
            </div>
            </div>
        </div>
    </Panel>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "@admin/stores/user";
import ChagePasswordForm from "../../ChagePasswordForm.vue"
import Panel from 'primevue/panel';
import { getUserApps } from '@/util/general'

const userApps = getUserApps();
const userStore = useUserStore();
const { user, roles, loading } = storeToRefs(userStore);
const confirm = useConfirm();
const toast = useToast();
const showChagePasswordForm = ref(false);

const form = reactive({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: null,
    status: "",
    apps: [],
    active: 1,
});
const formErrors = reactive({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    status: "",
    apps: "",
    active: "",
    default: "",
});

watch( user, (newVal, oldVal) => {
    //update form
    if (user.value) {
        setFormData(user.value);
    }
});

onMounted( () => {
    if (user.value) {
        setFormData(user.value);
    }
})

const setFormData = (formData) => {
    if (formData) {
        for (const field in form) {
            if (formData.hasOwnProperty(field)) {
                const formDataField = formData[field];
                form[field] = formDataField;
            }
        }
    }
};

const clearForm = () => {
    form.first_name = "";
    form.last_name = "";
    form.email = "";
    form.password = "";
    form.password_confirmation = "";
    form.role = null;
    form.status = "";
    form.apps = [];
    form.active = 1;
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
    formErrors.apps = "";
    formErrors.active = "";
    formErrors.default = "";
};

const openChagePasswordForm = () => {
    showChagePasswordForm.value = true;
}

const save = async () => {
    clearFormErrors();
    //Update
    if (user && user.value.id) {
        userStore.update(user.value.id, form, formErrors)
            .then(() => {
                toast.add({
                    severity: "success",
                    summary: "Kornički nalog je ažuriran!",
                    detail: form.name,
                    life: 3000,
                });
            })
            .catch(() => {
                toast.add({
                    severity: "error",
                    summary: "Greška tokom ažuriranja.",
                    detail: form.name,
                    life: 3000,
                });
            });
    }
    //Create
    else {
        userStore.create(form, formErrors)
            .then(() => {
                toast.add({
                    severity: "success",
                    summary: "Kreiran novi korisnik!",
                    detail: form.name,
                    life: 3000,
                });
            })
            .catch(() => {
                toast.add({
                    severity: "error",
                    summary: "Greška tokom kreiranja.",
                    detail: form.name,
                    life: 3000,
                });
            });
    }
};
</script>

<style lang="scss" scoped>
:deep(.user-password) {
    width: 100%;
}
.user-app {
    margin-bottom: 4px;
}
</style>