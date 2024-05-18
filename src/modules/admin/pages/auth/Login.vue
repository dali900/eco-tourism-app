<template>
    <div class="login">
        <Card class="login-card">
            <template #title>
                <div>
                    <small style="font-size: 16px">Admin panel</small>
                </div>
                <div>
                    Selo na 3 klika
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
                        <small class="p-error">{{loginFormErrors.default}}</small>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-content-between">
                    <Button type="button" :label="loginBtnLabel" :loading="loading || isAuthenticated" @click="login" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Password from 'primevue/password';
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useAppTracking } from '@/util/appTracking'

const appTracking = useAppTracking();
const authStore = useAuthStore();
const { user, isAuthenticated, redirectUrl, loading } = storeToRefs(authStore);
const router = useRouter();
const toast = useToast();
const form = ref({});
const loginBtnLabel = computed(() => isAuthenticated.value ? 'Redirektuje...' : 'Login');
const authUser = computed(() => authStore.user );
const redirectTimer = ref(null);
const routerPreviousUrl = ref(null);

//data and props ready, dom still not
onBeforeMount( () => {
    routerPreviousUrl.value = redirectUrl || router.options.history.state.back;
    if(isAuthenticated.value){
        //router.push({name: 'News'});
        if(routerPreviousUrl.value){
            router.push(routerPreviousUrl.value);
        } else {
            router.push({name: "AdminDashboard"});
        }
    } 
});

onMounted( () => {
    if(isAuthenticated.value){
        router.push({name: "AdminDashboard"});
    }
});

watch( () => isAuthenticated.value, (newVal, oldVal) => {
    if(newVal)
    {
        router.push({name: "AdminDashboard"});
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
    loginFormErrors.email = "";
    loginFormErrors.password = "";
    loginFormErrors.default = "";

    try {
        await authStore.login(loginForm, loginFormErrors);
        toast.add({severity:'success', summary: 'Uspešna prijava!', detail:'Zdravo '+user.value.name, life: 2000});
        appTracking.setUser(authStore.user);
            redirectTimer.value = setTimeout(() => {
                //Redirect to attempted page, if it exists
                let redirectUrl = authStore.redirectUrl || router.options.history.state.back;
                if(redirectUrl){
                    router.push(redirectUrl);
                    authStore.redirectUrl = null;
                    routerPreviousUrl.value = null;
                } else {
                    router.push({name: 'AdminDashboard'});
                }
            }, 2000);
        toast.add({severity:'info', summary: 'Redirektuje...', life: 2000});
    } catch (error) {
        console.log(error);
        console.log({error});
    }
}


</script>

<style scoped>
.login{
    max-width: 370px;
}
.login-form #email{
    width: 100%;
}
.login-card {
    background-color: #eeeeeed4;
}
.login-form{
    max-width: 370px;
    margin-top: 10px;
}
:deep(.p-password input) {
    width: 100%;
}
:deep(.p-password.p-inputwrapper) {
    width: 100%;
}
</style>