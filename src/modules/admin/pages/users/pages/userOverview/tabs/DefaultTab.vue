<template>
    <div class="default-tab">
        <SubscriptionForm v-model="showSubscriptionForm" :userId="user?.id" @saved="savedSubscription"></SubscriptionForm>
        <ChagePasswordForm v-model="showChagePasswordForm" :userId="user?.id"></ChagePasswordForm>
        <div class="flex flex-column justify-content-between">
            <h4 class="mt-0">Osnovne informacije</h4>
            <Card>
                <template #content>
                    <div v-if="showUserForm" class="user-form">
                        <div class="grid">
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <label
                                    for="first_name"
                                    :class="{ 'p-error': formErrors.first_name }">
                                    Ime *
                                </label>
                                <div>
                                    <InputText
                                        id="first_name"
                                        type="text"
                                        v-model="form.first_name"
                                        :class="{ 'p-invalid': formErrors.first_name }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.first_name }}</small>
                            </div>
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <label
                                    for="last_name"
                                    :class="{ 'p-error': formErrors.last_name }">
                                    Prezime *
                                </label>
                                <div>
                                    <InputText
                                        id="last_name"
                                        type="text"
                                        v-model="form.last_name"
                                        :class="{ 'p-invalid': formErrors.last_name }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.last_name }}</small>
                            </div>
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <label
                                    for="email"
                                    :class="{ 'p-error': formErrors.email }">
                                    Email *
                                </label>
                                <div>
                                    <InputText
                                        id="email"
                                        type="text"
                                        v-model="form.email"
                                        :class="{ 'p-invalid': formErrors.email }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.email }}</small>
                            </div>
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <label
                                    for="company_name"
                                    :class="{ 'p-error': formErrors.company_name }">
                                    Naziv kompanije
                                </label>
                                <div>
                                    <InputText
                                        id="company_name"
                                        type="text"
                                        v-model="form.company_name"
                                        :class="{ 'p-invalid': formErrors.company_name }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.company_name }}</small>
                            </div>
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <label
                                    for="phone_number"
                                    :class="{ 'p-error': formErrors.phone_number }">
                                    Broj telefona
                                </label>
                                <div>
                                    <InputText
                                        id="phone_number"
                                        type="text"
                                        v-model="form.phone_number"
                                        :class="{ 'p-invalid': formErrors.phone_number }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.phone_number }}</small>
                            </div>
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <label
                                    for="position"
                                    :class="{ 'p-error': formErrors.position }">
                                    Pozicija
                                </label>
                                <div>
                                    <InputText
                                        id="position"
                                        type="text"
                                        v-model="form.position"
                                        :class="{ 'p-invalid': formErrors.position }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.position }}</small>
                            </div>
                            <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                                <div class="mb-2">
                                    <label
                                        for="role"
                                        :class="{ 'p-error': formErrors.role }">
                                        Rola
                                    </label>
                                </div>
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
                            <div class="col-12 sm:col-12 md:col-6 lg:col-6 field">
                                <label
                                    for="note"
                                    :class="{ 'p-error': formErrors.note }">
                                    Napomena
                                </label>
                                <div>
                                    <Textarea
                                        id="note"
                                        rows="4"
                                        v-model="form.note"
                                        :class="{ 'p-invalid': formErrors.note }"
                                        @keyup.enter="save"
                                    />
                                </div>
                                <small class="p-error">{{ formErrors.note }}</small>
                            </div>
                            <div class="col-12">
                                <div class="mb-2">
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
                                <div class="">
                                    <Button label="Izmeni šifru" class="p-button-text" @click="openChagePasswordForm"/>
                                </div>
                            </div>
                        </div>
                        <div class="options flex justify-content-end">
                            <div class="mr-2">
                                <Button
                                    label="Nazad"
                                    :loading="loading"
                                    @click="setShowUserForm(false)"
                                    icon="pi pi-arrow-left"
                                />
                            </div>
                            <div class="mr-2">
                                <Button
                                    label="Ažuriraj"
                                    :loading="loading"
                                    @click="save"
                                    icon="pi pi-save"
                                />
                            </div>
                            <div>
                                <Button class="delete-btn" icon="pi pi-trash" severity="warning" aria-label="Notification" @click="confirmDeleteResource(user.id)"/>
                            </div>
                            
                        </div>
                    </div>
                    <div v-else-if="user" class="user-preview grid">                         
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Ime:</label>
                            <div class="data">{{ user.first_name }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Prezime:</label>
                            <div class="data">{{ user.last_name }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Email:</label>
                            <div class="data">{{ user.email }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Naziv kompanije:</label>
                            <div class="data">{{ user.company_name }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Broj telefona:</label>
                            <div class="data">{{ user.phone_number }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Pozicija:</label>
                            <div class="data">{{ user.position }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Rola:</label>
                            <div class="data">{{ user.role_name }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Napomena:</label>
                            <div class="data">{{ user.note }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Aktivan:</label>
                            <div class="data">{{ user.active ? 'Da' : 'Ne' }}</div>
                        </div>
                        <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                            <label>Poslednji login:</label>
                            <div class="data">{{ user.last_login_formated }}</div>
                        </div>
                        <div class="col-12">
                            <Button label="Izmeni" icon="pi pi-pencil" outlined severity="info" @click="setShowUserForm(true)"/>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <div class="last-subscription" v-if="user">
        <h4>Poslednja pretplata</h4>
        <Card v-if="user.last_subscription">
            <template #content>
                <div class="grid">
                    <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                        <label>Datum početka:</label>
                        <div class="data">
                            {{ user.last_subscription.start_date_formated }}
                        </div>
                    </div>
                    <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                        <label>Datum završetka:</label>
                        <div class="data">
                            {{ user.last_subscription.end_date_formated }}
                        </div>
                    </div>
                    <div class="col-12 sm:col-12 md:col-6 lg:col-4 field">
                        <label>Aktivan:</label>
                        <div class="data">
                            <div :class="{'success': user.last_subscription.active, 'error': !user.last_subscription.active}">
                                {{ user.last_subscription.active ? 'Da' : 'Ne' }}
                            </div>
                        </div>
                    </div>
                </div>
                
            </template>
        </Card>
        <div v-else>
            <p>Kornisk nema pretplate</p><br>
            <Button label="Kreiraj pretplatu" icon="pi pi-plus" outlined severity="info" @click="setShowSubscriptionForm(true)"/>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Divider from 'primevue/divider';
import ChagePasswordForm from "../../../components/ChagePasswordForm.vue"
import SubscriptionForm from "../../userSubscriptions/SubscriptionForm.vue"
import { useUserStore } from "@admin/stores/user";

const userStore = useUserStore();
const { user, roles, loading } = storeToRefs(userStore);
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const showChagePasswordForm = ref(false);
const showUserForm = ref(false);
const showSubscriptionForm = ref(false);

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
    position: "",
    note: "",
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
    note: "",
    default: ""
});

const setShowUserForm = (value) => {
    showUserForm.value = value;
};

const setShowSubscriptionForm = (value) => {
    showSubscriptionForm.value = value;
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
    formErrors.note = "";
    formErrors.default = "";
}

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
    setShowUserForm(false);
};

const savedSubscription = (subscription) => {
    if (subscription) {
        router.push({name: "UserSubscriptions"});
    }
}

const confirmDeleteResource = (id) => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteUser(id);
        },
        //no
        reject: () => {},
        //dialog closed
        onHide: () => {}
    });
};

const deleteUser = (id) => {
    userStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Korisnički nalog obrisan.', life: 3000});
            router.push({name: 'AdminUserProfiles'});
        })
        .catch((err) => {
            console.log(err);
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
    }
</script>

<style lang="scss" scoped>
.default-tab {
    .user-preview {
    }
    :deep(.p-inputtext),
    :deep(.p-dropdown) {
        width: 100%;
    }
}
:deep(.field) {
    margin-bottom: 4px;
    label {
        font-size: 14px;
        color: var(--text-light-color);
    }
    .data {
        color: var(--text-primary-color);
    }
}
:deep(.success) { color: var(--success-color) !important }
:deep(.error) { color: var(--error-color) !important}
</style>
