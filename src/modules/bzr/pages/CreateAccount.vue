<template>
    <div class="create-account p-3">
        <div class="banner flex align-content-center">
            <img class="mr-3" src="/images/bzr_icon.png"> 
            <div class="title">NOVI NALOG</div>
        </div>
        <div class="form flex align-items-center justify-content-center pt-3">
            <Card class="card-form">
                <template #content>
                    <div class="form-header mb-3">
                        <div class="mb-1">
                            Kreiranjem novog naloga pristupate pretplatničkom delu Portala BZR. <br>
                            Pristup je vremenski ograničen. <br>
                        </div>
                        <div class="mb-3">
                            <small>
                                Kontaktirajte nas za više informacija <br>
                                bzrportal@actamedia.rs <br>
                                060 140 6880
                            </small>
                        </div>
                    </div>
                    <div class="grid">
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="first_name" :class="{'p-error': formErrors.first_name}">Ime *</label>
                            <div>
                                <InputText id="first_name" type="text" v-model="form.first_name" :class="{'p-invalid': formErrors.first_name}"/>
                            </div>
                            <small class="p-error">{{formErrors.first_name}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="last_name" :class="{'p-error': formErrors.last_name}">Prezime *</label>
                            <div>
                                <InputText id="last_name" type="text" v-model="form.last_name" :class="{'p-invalid': formErrors.last_name}"/>
                            </div>
                            <small class="p-error">{{formErrors.last_name}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="email" :class="{'p-error': formErrors.email}">Email *</label>
                            <div>
                                <InputText id="email" type="text" v-model="form.email" :class="{'p-invalid': formErrors.email}"/>
                            </div>
                            <small class="p-error">{{formErrors.email}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="company_name" :class="{'p-error': formErrors.company_name}">Kompanija *</label>
                            <div>
                                <InputText id="company_name" type="text" v-model="form.company_name" :class="{'p-invalid': formErrors.company_name}"/>
                            </div>
                            <small class="p-error">{{formErrors.company_name}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="position" :class="{'p-error': formErrors.position}">Pozicija *</label>
                            <div>
                                <InputText id="position" type="text" v-model="form.position" :class="{'p-invalid': formErrors.position}"/>
                            </div>
                            <small class="p-error">{{formErrors.position}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="phone_number" :class="{'p-error': formErrors.phone_number}">Kontakt telefon *</label>
                            <div>
                                <InputText id="phone_number" type="text" v-model="form.phone_number" :class="{'p-invalid': formErrors.phone_number}"/>
                            </div>
                            <small class="p-error">{{formErrors.phone_number}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="password" :class="{'p-error': formErrors.password}">Šifra *</label>
                            <div>
                                <Password id="password" type="text" 
                                    v-model="form.password" 
                                    inputClass="create-account-password"
                                    :class="{'p-invalid': formErrors.password}" 
                                    :toggleMask="true"
                                />
                            </div>
                            <small class="p-error">{{formErrors.password}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="password_confirmation" :class="{'p-error': formErrors.password_confirmation}">Potvrda šifre *</label>
                            <div>
                                <Password id="password_confirmation" type="text" 
                                    v-model="form.password_confirmation" 
                                    inputClass="create-account-password_confirmation"
                                    :class="{'p-invalid': formErrors.password_confirmation}" 
                                    @keyup.enter="createAccount"
                                    :toggleMask="true"
                                />
                            </div>
                            <small class="p-error">{{formErrors.password_confirmation}}</small>
                        </div>
                        <div class="col-12 flex justify-content-between">
                            <div>
                                <small class="p-error">{{formErrors.default}}</small>
                            </div>
                            <Button @click="createAccount">Kreiraj nalog</Button>
                        </div>
                    </div>
                </template>
            </Card>
            
        </div>
    </div>
</template>

<script setup>
import Password from 'primevue/password';
import { ref, reactive, computed, watch, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const authStore = useAuthStore();
const userStore = useUserStore();
const { user, isAuthenticated, loading } = storeToRefs(authStore);
const router = useRouter();
const toast = useToast();
const loginBtnLabel = computed(() => isAuthenticated.value ? 'Redirektuje...' : 'Login');
const authUser = computed(() => authStore.user );
const redirectTimer = ref(null);

//data and props ready, dom still not
onBeforeMount( () => {
    if(isAuthenticated.value){
        router.push({name: 'News'});
    }
    appTracking.mixpanelTrack('Create account page visited');
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(redirectTimer.value);
    redirectTimer.value = null;
});

const form = reactive({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    position: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
});
const formErrors = reactive({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    position: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    default: "",
});

const clearFormErrors = () => {
    formErrors.first_name = "";
    formErrors.last_name = "";
    formErrors.email = "";
    formErrors.company_name = "";
    formErrors.position = "";
    formErrors.phone_number = "";
    formErrors.password = "";
    formErrors.password_confirmation = "";
    formErrors.default = "";
}

//password validation
watch( () => [form.password, form.password_confirmation], ([newValA, oldValA], [newValB, oldValB]) => {
    if(newValA !== form.password_confirmation){
        formErrors.password_confirmation = "Šifra i potvrda šifre moraju biti isti.";
    } else {
        formErrors.password = "";
        formErrors.password_confirmation = "";
    }
});

const createAccount = async () => {
    clearFormErrors();
    userStore.create(form, formErrors)
        .then(() => {
            appTracking.mixpanelTrack('Account created', {
                "First name": form.first_name,
                "Last name": form.last_name,
                "Email": form.email,
            });
            toast.add({severity:'success', summary: 'Uspešno ste kreirali nalog!', detail: 'Sada možete da se prijavite na BZR portal.', life: 7000});
            router.push({name: 'Login'});
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
        })
}


</script>

<style lang="scss" scoped>
.create-account .card-form{
    width: 600px;
}
.field div {
    width: 100%;
}
.field .p-inputtext {
    width: 100%;
}
:deep(.create-account-password) {
    width: 100%;
}
:deep(.create-account-password_confirmation) {
    width: 100%;
}
.banner img{
    height: 30px;
    align-self: center;
}
.banner .title{
    font-size: 35px;
    align-self: center;
    font-weight: bold;
    font-family: system-ui;
}
.form-header {
   border-bottom: 1px solid lightgrey;
}
</style>