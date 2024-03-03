<template>
    <div class="create-account">
        <img alt="Login" src="/images/LOGIN_background_ZZS.png" class="login-image">
        <Card class="create-account-card">
            <template #title>
                <div class="welcome">Dobrodošli na</div>
                <div class="grid">
                    <div class="left-grid">
                        <img loading="lazy" src="/images/zzs_green_logo.svg" alt="" class="logo-app"/>
                    </div>
                    <div class="right-grid">
                        <span class="app-title"><b>ZŽS</b> PORTAL</span><br/>
                        <span class="app-name">Portal za zaštitu životne sredine</span>
                    </div>
                </div>
                <div class="form-header mb-3 card-body">
                    <div class="mb-1">
                        Kreiranjem novog naloga pristupate pretplatničkom delu Portala ZŽS. <br>
                        Pristup je vremenski ograničen. <br>
                    </div>
                    <div class="mb-3">
                        <small>
                            Kontaktirajte nas za više informacija <br>
                            exportinfo@actamedia.rs <br>
                            060/140-6880
                        </small>
                    </div>
                </div>
            </template>
            <template #content>
                <div class="grid card-body">
                    <div class="field col-12 md:col-6 lg:col-6">
                        <label for="first_name" :class="{'p-error': formErrors.first_name}">Ime *</label>
                        <div>
                            <InputText id="first_name" type="text" v-model="form.first_name" :class="{'p-invalid': formErrors.first_name}" @keyup.enter="createAccount"/>
                        </div>
                        <small class="p-error">{{formErrors.first_name}}</small>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-6">
                        <label for="last_name" :class="{'p-error': formErrors.last_name}">Prezime *</label>
                        <div>
                            <InputText id="last_name" type="text" v-model="form.last_name" :class="{'p-invalid': formErrors.last_name}" @keyup.enter="createAccount"/>
                        </div>
                        <small class="p-error">{{formErrors.last_name}}</small>
                    </div>
                    <div class="field col-12">
                        <label for="email" :class="{'p-error': formErrors.email}">Email *</label>
                        <div>
                            <InputText id="email" type="text" v-model="form.email" :class="{'p-invalid': formErrors.email}" @keyup.enter="createAccount"/>
                        </div>
                        <small class="p-error">{{formErrors.email}}</small>
                    </div>
                    <div class="field col-12">
                        <label for="company_name" :class="{'p-error': formErrors.company_name}">Naziv kompanije *</label>
                        <div>
                            <InputText id="company_name" type="text" v-model="form.company_name" :class="{'p-invalid': formErrors.company_name}" @keyup.enter="createAccount"/>
                        </div>
                        <small class="p-error">{{formErrors.company_name}}</small>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-6">
                        <label for="phone_number" :class="{'p-error': formErrors.phone_number}">Broj telefona *</label>
                        <div>
                            <InputText id="phone_number" type="text" v-model="form.phone_number" :class="{'p-invalid': formErrors.phone_number}" @keyup.enter="createAccount"/>
                        </div>
                        <small class="p-error">{{formErrors.phone_number}}</small>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-6">
                        <label for="position" :class="{'p-error': formErrors.position}">Pozicija *</label>
                        <div>
                            <InputText id="position" type="text" v-model="form.position" :class="{'p-invalid': formErrors.position}" @keyup.enter="createAccount"/>
                        </div>
                        <small class="p-error">{{formErrors.position}}</small>
                    </div>
                    <div class="field col-12 md:col-6 lg:col-6">
                        <label for="password" :class="{'p-error': formErrors.password}">Šifra *</label>
                        <div>
                            <Password id="password" type="text" 
                                v-model="form.password" 
                                inputClass="create-account-password"
                                :class="{'p-invalid': formErrors.password}" 
                                @keyup.enter="createAccount"
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
                    <div class="col-12 create-account-footer">
                        <Button @click="createAccount">Kreiraj nalog</Button>
                    </div>
                    <div class="col-12">
                        <small class="p-error">{{formErrors.default}}</small>
                    </div>
                </div>
            </template>
        </Card>
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
    phone_number: "",
    position: "",
    password: "",
    password_confirmation: "",
});
const formErrors = reactive({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone_number: "",
    position: "",
    password: "",
    password_confirmation: "",
    default: "",
});

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
    userStore.create(form, formErrors)
        .then(() => {
            appTracking.mixpanelTrack('Account created', {
                "First name": form.first_name,
                "Last name": form.last_name,
                "Email": form.email,
                "Company name": form.company_name,
                "Phone number": form.phone_number,
                "Position": form.position
            });
            toast.add({severity:'success', summary: 'Uspešno ste kreirali nalog!', detail: 'Sada možete da se prijavite na EXPORT INFO portal.', life: 7000});
            router.push({name: 'Login'});
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.name, life: 3000});
        })
}


</script>

<style lang="scss" scoped>
.create-account {
    overflow: hidden;
    .welcome {
        text-align: center;
    }
    .left-grid {
        text-align: right;
        width: 35%;
    }
    .right-grid {
        text-align: left;
        width: 65%;
        padding-left: 10px;
    }
    .form {
        .p-float-label {
            text-align: center;
            label {
                color: var(--color-zzs-navbar-background-primary);
            }
        }
        .p-inputtext {
            width: 100%;
        }
        .p-password {
            width: 100%;
            .p-inputtext{
                width: 100%;
            }
        }
    }
    .create-account-card {
        width: 300px;
        height: auto;
        flex-shrink: 0;
        border-radius: 9px;
        background: rgba(204, 216, 201, 0.47);
        top: 0px;
        position: relative;
        color: var(--color-zzs-navbar-background-primary);
    }
    @media screen and (min-width: 730px) {
        .create-account-card {
            width: 729px;
            min-height: 720px;
            top: 30px;
            position: absolute;
            right: 50px;
        }
        .card-body {
            padding-left: 50px !important;
            padding-right: 50px !important;
        }
    }
    @media screen and (max-width: 730px) {
        .login-image {
            display: none;
        }
    }
    .app-title {
        font-size: 40px;
    }
    .app-name {
        font-size: 17px;
        bottom: 10px;
    }
    .create-account-footer {
        text-align: center;
        .p-button {
            display: inline;
            width: 50%;
            border-radius: 10px;
        }
    }
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
.form-header {
    color: #1E1E1E;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 144%; /* 20.16px */
    letter-spacing: 0.14px;
    padding-right: 30px;
}
</style>