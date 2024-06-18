<script setup>
import { computed, onBeforeMount, onMounted, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useGlobalStore } from './stores/global'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

//import { useAppUpdateManager } from '@/util/appUpdateManager'
const env = import.meta.env.VITE_APP_ENV;

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const { user, loading } = storeToRefs(authStore);

//const { appIsOpen } = storeToRefs(indexStore);

//useAppUpdateManager();
//Fetch auth user
if(!user.value){
    authStore.getAuthUser();
}
/* watch( user, (newVal, oldVal) => {
    //click on update form 
    if(user.value)
    {
        indexStore.openApp();
    }
}); */

/* onMounted( () => {
    let uri = window.location.search.substring(1); 
    let params = new URLSearchParams(uri);

    if(params.get("open-app")){
        indexStore.openApp();
        router.push({to: 'Login' });
    }
}); */

</script>

<template>
    <div class="wrapper">
        <Toast position="top-right"/>
        <RouterView />
        <ConfirmDialog class="confirm-dialog"></ConfirmDialog>
    </div>
</template>

<style>
/* body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    background-color: #bdbdbd;
    font-family: var(--font-family);
    font-weight: 400;
    color: var(--text-color);
}
#app {
    height: 100%;
}
.layout {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}
.p-dialog-mask.p-component-overlay {
    z-index: 3 !important;
} */
html,
body {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  color: var(--text-primary-color);
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.p-toast) {
    z-index: 9999;
}
</style>
