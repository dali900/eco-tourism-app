<template>
    <div class="contact p-3">
        <div class="banner flex align-content-center">
            <img class="mr-3" src="/images/zzs_green_logo.svg"> 
            <div class="title">PRIJAVA NA ONLINE ZŽŠ Panel - 27.2.2024.</div>
        </div>
        <div class="form flex align-items-center justify-content-center pt-3">
            <Card class="card-form">
                <template #content>
                    <div class="grid">
                        <div class="field col-12 md:col-12 lg:col-12">
                            <label for="question" :class="{'p-error': formErrors.question}">Molimo vas da prilikom postavljanja pitanja za Online ZŽŠ panel date i informaciju o vašem zvanju i zanimanju kao i dosadašnjem iskustvu u izveštavanju o otpadu? *</label>
                            <div>
                                <Textarea id="question" type="textarea" v-model="form.question" :class="{'p-invalid': formErrors.question}" @keyup.enter="sendMail"/>
                            </div>
                            <small class="p-error">{{formErrors.question}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="first_name" :class="{'p-error': formErrors.first_name}">Ime *</label>
                            <div>
                                <InputText id="first_name" type="text" v-model="form.first_name" :class="{'p-invalid': formErrors.first_name}" @keyup.enter="sendMail"/>
                            </div>
                            <small class="p-error">{{formErrors.first_name}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="last_name" :class="{'p-error': formErrors.last_name}">Prezime *</label>
                            <div>
                                <InputText id="last_name" type="text" v-model="form.last_name" :class="{'p-invalid': formErrors.last_name}" @keyup.enter="sendMail"/>
                            </div>
                            <small class="p-error">{{formErrors.last_name}}</small>
                        </div>
                        <div class="field col-12">
                            <label for="email" :class="{'p-error': formErrors.email}">Email *</label>
                            <div>
                                <InputText id="email" type="text" v-model="form.email" :class="{'p-invalid': formErrors.email}" @keyup.enter="sendMail"/>
                            </div>
                            <small class="p-error">{{formErrors.email}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="company_name" :class="{'p-error': formErrors.company_name}">Kompanija</label>
                            <div>
                                <InputText id="company_name" type="text" v-model="form.company_name" :class="{'p-invalid': formErrors.company_name}" @keyup.enter="sendMail"/>
                            </div>
                            <small class="p-error">{{formErrors.company_name}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="phone_number" :class="{'p-error': formErrors.phone_number}">Kontakt telefon</label>
                            <div>
                                <InputText id="phone_number" type="text" v-model="form.phone_number" :class="{'p-invalid': formErrors.phone_number}" @keyup.enter="sendMail"/>
                            </div>
                            <small class="p-error">{{formErrors.phone_number}}</small>
                        </div>
                        <div class="col-12 flex justify-content-end">
                            <Button @click="sendMail" :loading="loading" :disabled="loading">{{loading ? "Šalje se..." : "Kontaktirajte nas"}}</Button>
                        </div>
                    </div>
                </template>
            </Card>
            
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useAppTracking } from '@/util/appTracking'
import { useUserStore } from '../stores/user'

const appTracking = useAppTracking();
const authStore = useAuthStore();
const userStore = useUserStore();
const { isAuthenticated, loading } = storeToRefs(authStore);
const router = useRouter();
const toast = useToast();
const redirectTimer = ref(null);

onBeforeMount( () => {
    appTracking.mixpanelTrack('Cotact page visited');
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(redirectTimer.value);
    redirectTimer.value = null;
});

const form = reactive({
    question: "",
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone_number: "",
});
const formErrors = reactive({
    question: "",
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone_number: "",
    default: "",
});


const sendMail = async () => {
    userStore.contact(form, formErrors)
        .then(() => {
            toast.add({severity:'success', summary: 'Uspešno ste kontaktirali EXPORT INFO portal!', life: 7000});
            router.push({name: 'News'});
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom kontaktiranja.', detail: form.name, life: 3000});
        })
}


</script>

<style lang="scss" scoped>
.contact .card-form{
    width: 600px;
}
.field div {
    width: 100%;
}
.field .p-inputtext {
    width: 100%;
}
:deep(.contact-password) {
    width: 100%;
}
:deep(.contact-password_confirmation) {
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
</style>