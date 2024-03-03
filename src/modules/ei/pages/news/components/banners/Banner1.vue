<template>
    <div class="contact p-3">
        <div class="banner flex justify-content-center">
            <img class="mr-3" src="/images/app-logo.png"> 
            <div class="title">{{ banner ? banner.title : 'Prijava' }}</div>
        </div>
        <div class="form flex align-items-center justify-content-center pt-3">
            <Card class="card-form">
                <template #content>
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
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="company_name" :class="{'p-error': formErrors.company}">Kompanija *</label>
                            <div>
                                <InputText id="company_name" type="text" v-model="form.company_name" :class="{'p-invalid': formErrors.company_name}"/>
                            </div>
                            <small class="p-error">{{formErrors.company_name}}</small>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-6">
                            <label for="phone_number" :class="{'p-error': formErrors.phone_number}">Kontakt telefon *</label>
                            <div>
                                <InputText id="phone_number" type="text" v-model="form.phone_number" :class="{'p-invalid': formErrors.phone_number}"/>
                            </div>
                            <small class="p-error">{{formErrors.phone_number}}</small>
                        </div>
                        <!-- <div class="flex col-12 md:col-12 lg:col-12">
                            <Checkbox inputId="paid" v-model="form.paid" :trueValue="1" :falseValue="0" :binary="true"/>&nbsp;&nbsp;
                            <label for="paid" :class="{'p-error': formErrors.paid}">Pretplatnik na Export Info portalu</label>
                        </div> -->
                        <!-- <div class="flex col-12 md:col-12 lg:col-12">
                            <Checkbox inputId="participation_live" v-model="form.participation_live" :trueValue="1" :falseValue="0" :binary="true"/>&nbsp;&nbsp;
                            <label for="participation_live" :class="{'p-error': formErrors.participation_live}">Hotel Moskva</label>
                        </div> -->
                        <!-- <div class="flex col-12 md:col-12 lg:col-12">
                            <Checkbox inputId="participation_online" v-model="form.participation_online" :trueValue="1" :falseValue="0" :binary="true"/>&nbsp;&nbsp;
                            <label for="participation_online" :class="{'p-error': formErrors.participation_online}">Online</label>
                        </div> -->
                        <!--<div class="field col-12 md:col-12 lg:col-12">
                            <small>1 pretplatnička licenca = 1 povlašćena cena kotizacije</small>
                        </div> -->
                        <div class="field col-12 md:col-12 lg:col-12">
                            <label for="question" :class="{'p-error': formErrors.question}">
                                {{ banner && banner.question_label ? banner.question_label : 'Napomena'}}
                            </label>
                            <div>
                                <Textarea id="question" type="textarea" v-model="form.question" :class="{'p-invalid': formErrors.question}"/>
                            </div>
                            <small class="p-error">{{formErrors.question}}</small>
                        </div>
                        <div class="field col-12 md:col-12 lg:col-12">
                            {{ banner && banner.message }}
                        </div>
                        <div class="col-12 flex justify-content-end">
                            <Button @click="sendMail" :loading="loading" :disabled="loading" :label="loading ? 'Šalje se...' : 'Kontaktirajte nas'"/>
                        </div>
                    </div>
                </template>
            </Card>
            
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@ei/stores/user'
import { useBannerStore } from '@ei/stores/banner'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const authStore = useAuthStore();
const userStore = useUserStore();
const bannerStore = useBannerStore();
const { banner } = storeToRefs(bannerStore);
const { user, isAuthenticated } = storeToRefs(authStore);
const { loading } = storeToRefs(userStore);
const router = useRouter();
const route = useRoute();
const toast = useToast();
const redirectTimer = ref(null);

onBeforeMount( () => {
    appTracking.mixpanelTrack('Banner 1 page visited');
    if(route.params.bannerSlug){
        bannerStore.getBannerBySlug(route.params.bannerSlug).
            catch(err => {
                console.log({err});
                if (err.response.status && err.response.status === 404) {
                    router.push({name: 'PageNotFound'});
                }
            });
    }
});

onMounted( () => {
    if (user.value) {
        setFormData(user.value);
    }
});

//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(redirectTimer.value);
    redirectTimer.value = null;
});

watch (user, (newVal, odlVal) => {
    if (newVal) {
        setFormData(newVal);
    } else {
        clearForm();
    }
})

const form = reactive({
    question: "",
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone_number: "",
    check_in_for_panel: 0,
    paid: 0,
    participation_live: 0,
    participation_online: 0,
    banner1_link: 1,
});
const formErrors = reactive({
    question: "",
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone_number: "",
    check_in_for_panel: "",
    paid: 0,
    participation_live: 0,
    participation_online: 0,
    default: "",
});

const setFormData = (data) => {
    if(data){
        for (const field in form) {
            if (data.hasOwnProperty(field)) {
                const dataField = data[field];
                form[field] = dataField;
            } 
        }
        if (authStore.hasActivePlan()){
            form.paid = 1;
        }
    } 
}

const clearForm = () => {
    form.question = "";
    form.first_name = "";
    form.last_name = "";
    form.email = "";
    form.company_name = "";
    form.phone_number = "";
    form.paid = null;
    form.participation_online = null;
    form.participation_live = null;
    form.default = "";
    clearFormErrors();
};

const clearFormErrors = () => {
    formErrors.question = "";
    formErrors.first_name = "";
    formErrors.last_name = "";
    formErrors.email = "";
    formErrors.company_name = "";
    formErrors.phone_number = "";
    formErrors.paid = "";
    formErrors.participation_online = "";
    formErrors.participation_live = "";
    formErrors.default = "";
}


const sendMail = async () => {
    clearFormErrors();
    bannerStore.banner1Contact(form, formErrors)
        .then(() => {
            toast.add({severity:'success', summary: 'Prijava poslata!', life: 7000});
            router.push({name: 'News'});
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška. Molimo vas pokušajte kasnije ponovo.', detail: form.name, life: 3000});
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
.p-togglebutton {
    width: 75px !important;
    height: 20px;
    margin-left: 20px;
}
.contact-price-table{
    border-collapse: collapse;
}
.contact-price-table, 
.contact-price-table td, 
.contact-price-table th{
    border: 1px solid black;
    padding: 5px;
}

</style>