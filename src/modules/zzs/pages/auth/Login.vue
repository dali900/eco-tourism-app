<template>
    <div class="login">
        <!-- <img alt="Login" src="/images/LOGIN_background_ZZS.png"> -->
        <Card class="login-card">
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
            </template>
            <template #content>
                <div class="login-form flex flex-column">
                    <form class="form" id="auth.login">
                        <div class="field flex flex-column">
                            <span class="p-float-label">
                                <InputText id="email" type="text" v-model="loginForm.email" :class="{'p-invalid': loginFormErrors.email}" @keyup.enter="login"/>
                                <label for="email">Mejl</label>
                            </span>
                            <small id="email-help" class="p-error">{{loginFormErrors.email}}</small>
                        </div>
                        <div class="field flex flex-column">
                            <span class="p-float-label">
                                <Password id="password" v-model="loginForm.password" :class="{'p-invalid': loginFormErrors.password}" :feedback="false" :toggleMask="true" @keyup.enter="login"/>
                                <label for="password">Lozinka</label>
                            </span>
                            <small id="password-help" class="p-error">{{loginFormErrors.password}}</small>
                        </div>
                    </form>
                    <div>
                        <small class="p-error">{{loginFormErrors.default}}</small><br>
                        <samll v-if="showContactLink">Molimo vas kontaktirajte nas za obnovu licence. </samll>
                        <div v-if="showContactLink">
                            <router-link :to="{name: 'Contact'}">Kontakt</router-link>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="login-footer">
                    <Button type="button" :label="loginBtnLabel" :loading="loading || isAuthenticated" @click="login" />
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
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useAppTracking } from '@/util/appTracking'
import { http } from "../../../../util/apiClient"

const appTracking = useAppTracking();
const authStore = useAuthStore();
const { user, isAuthenticated, loading } = storeToRefs(authStore);
const router = useRouter();
const toast = useToast();
const form = ref({});
const loginBtnLabel = computed(() => isAuthenticated.value ? 'Redirektuje...' : 'Ulogujte se');
const authUser = computed(() => authStore.user );
const redirectTimer = ref(null);
const routerPreviousUrl = ref(null);
const showContactLink = ref(false);

//data and props ready, dom still not
onBeforeMount( () => {
    routerPreviousUrl.value = authStore.redirectUrl || router.options.history.state.back;
    if(isAuthenticated.value){
        //router.push({name: 'News'});
        console.log({routerPreviousUrl: routerPreviousUrl.value, routerState: router.options.history.state});
        if(routerPreviousUrl.value){
            router.push(routerPreviousUrl.value);
        } else {
            router.push({name: "News"});
            //router.go(-1);
        }
    } 
});

watch( isAuthenticated, (newVal, oldVal) => {
    if(newVal)
    {
        if(routerPreviousUrl.value){
            router.push(routerPreviousUrl.value);
        } else {
            router.push({name: "News"});
        }
    }
});
//clean up manually created timers, DOM event listeners or server connections
onUnmounted( () => {
    clearTimeout(redirectTimer.value);
    redirectTimer.value = null;
});

const loginForm = reactive({
    email: "",
    password: ""
});
const loginFormErrors = reactive({
    email: "",
    password: "",
    default: ""
});

const login = async () => {
    showContactLink.value = false;
    loginFormErrors.email = "";
    loginFormErrors.password = "";
    loginFormErrors.default = "";
    
    try {
        const responseData = await authStore.login(loginForm, loginFormErrors);
        toast.add({severity:'success', summary: 'Uspešna prijava!', detail:'Zdravo '+user.value.name, life: 2000});
        toast.add({severity:'info', summary: 'Redirektuje...', life: 2000});
        appTracking.setUser(authStore.user);
        if (responseData.plan_expired == false) {
            toast.add({severity:'warn', summary: responseData.message, detail:'Za obnovu kontaktirajte redakciju.', life: 15000});
        }
        redirectTimer.value = setTimeout(() => {
            //Redirect to attempted page, if it exists
            let redirectUrl = authStore.redirectUrl || router.options.history.state.back;
            if(redirectUrl){
                router.push(redirectUrl);
                authStore.redirectUrl = null;
                routerPreviousUrl.value = null;
            } else {
                router.push({name: 'News'});
            }
        }, 2000);
    } catch (error) {
        console.log(error);
        console.log({error});
        if (error.response && error.response.data.data && error.response.data.data.plan_expired) {
            showContactLink.value = true;
        }
        http.post('api/report-error', {
            msg: error.message, 
            stack: error.stack, 
            url: window.location.href
        });
    }
}


</script>

<style lang="scss" >

.login {
    background-image: url("/images/LOGIN_background_ZZS.png");
    background-position: center;
    display: flex;
    overflow: hidden;
    height: 610px;
    .welcome {
        padding-bottom: 10px;
        padding-top: 30px;
        text-align: center;
    }
    .left-grid {
        text-align: right;
        width: 35%;
    }
    .right-grid {
        text-align: left;
        width: 65%;
        padding-bottom: 50px;
        padding-left: 10px;
    }
    .form {
        .field {
            padding: 10px;
        }
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
    .login-card {
        width: 300px;
        height: auto;
        flex-shrink: 0;
        border-radius: 9px;
        background: rgba(204, 216, 201, 0.47);
        top: 93px;
        right: 50px;
        position: absolute;
        color: var(--color-zzs-navbar-background-primary);
    }
    @media screen and (min-width: 730px){
        .login-card {
            width: 729px;
            height: 520px;
            right: 116px;
        }
    }
    .app-title {
        font-size: 40px;
    }
    .app-name {
        font-size: 17px;
        bottom: 10px;
    }
    .login-footer {
        text-align: center;
        .p-button {
            display: inline;
            width: 50%;
            border-radius: 10px;
        }
    }
}
</style>