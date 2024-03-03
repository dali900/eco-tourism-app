<script setup>
import { ref, reactive, computed, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useIndexStore } from '../stores/index'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";

const authStore = useAuthStore();
const indexStore = useIndexStore();
const { user, isAuthenticated, loading } = storeToRefs(authStore);
const router = useRouter();
const toast = useToast();
const items = ref([
    {
        label: 'Administracija korisnika',
        items: [
            {
                label: 'Svi korisnici',
                to: '/users',
                visible: authStore.hasAdminAccess()
            },
            {
                label: 'Korisnički profili',
                to: '/user-profiles',
                visible: authStore.hasAdminAccess()
            },
            {
                label: 'Vrste planova',
                to: '/plans'
            },
        ]
    },
    {
        label: 'Propisi',
        items: [
            {
                label: 'Prikaz propisa',
                to: '/regulations',
            },
            {
                label: 'Tipovi',
                to: '/regulation-types',
            }
        ]
    },
    {
        label: 'Dokumentacija',
        items: [
            {
                label: 'Prikaz modela akata',
                to: '/documents',
            },
            {
                label: 'Tipovi',
                to: '/document-types',
            }
        ]
    },
    {
        label: 'Vesti',
        to: '/news'
    },
    {
        label: 'Članci',
        items: [
            {
                label: 'Prikaz članaka',
                to: '/articles',
            },
            {
                label: 'Kategorije',
                to: '/article-types',
            }
        ]
    },
    {
        label: 'Pitanja i odgovori',
        items: [
            {
                label: 'Prikaz pitanja',
                to: '/questions',
            },
            {
                label: 'Kategorije',
                to: '/question-types',
            }
        ]
    },
    {
        label: 'Video',
        to: '/videos'
    },
    {
        label: 'Baneri',
        to: '/banners'
    }
]);

const menu = ref(null); //Gets <Menu> component via ref="meni"
const toggleUserMenu = (event) => {
    menu.value.toggle(event);
}

const userMenuItems = ref([
    {
        label: "Korisnički panel BZR",
        command: () => {
            window.open(import.meta.env.VITE_BZR_URL, '_blank');
        }
    },
    {
        label: "Korisnički panel EXPORTINFO",
        command: () => {
            window.open(import.meta.env.VITE_EXPORTINFO_URL, '_blank');
        }
    },
    {
        label: "Korisnički panel ZŽS",
        command: () => {
            window.open(import.meta.env.VITE_ZZS_URL, '_blank');
        }
    },
    {
        label: "Izlogujte se",
        command: () => {
            logout();
        }
    }
]);

const appItems = ref([
    { name: "EXPORTINFO", id: 'exportinfo' },
    { name: "BZR", id: 'bzr' },
    { name: "ZZS", id: 'zzs' }
]);

const logout = async () => {
    await authStore.logout();
    router.push({name: 'Login'});
}

const onAppChange = (event) => {
    indexStore.setSelectedApp(event.value);
    indexStore.setLoading();
    window.location.reload();
}

</script>

<template>
    <div class="admin-navbar" :class="indexStore.selectedApp">
        <Menubar :model="items">
            <template #start>
                <template v-if="indexStore.selectedApp === 'bzr'">
                    <a class="logo">
                        <img alt="Logo" src="/images/bzr_white_logo.png" to="/">
                        <span><span>  BZR</span> PORTAL</span>
                    </a>
                </template>
                <template v-if="indexStore.selectedApp === 'exportinfo'">
                    <a class="logo">
                        <img alt="Logo" src="/images/exportinfo_white_logo.png" to="/">
                        <span><span>  EXPORT</span> INFO</span>
                    </a>
                </template>
            </template>
            <template #end>
                <!-- <InputText placeholder="Pretražite" type="text" /> -->
                <Dropdown 
                    v-model="indexStore.selectedApp" 
                    placeholder="" 
                    :options="appItems" 
                    optionLabel="name" 
                    optionValue="id" 
                    @change="onAppChange"
                />
                <Button
                    type="button"
                    v-if="user"
                    @click="toggleUserMenu"
                    aria-haspopup="true"
                    aria-controls="user-menu"
                    icon="pi pi-user"
                    class="p-button-rounded p-link user-btn"
                    :title="user.name"
                >
                </Button>
                <Menu
                    id="user-menu"
                    ref="menu"
                    :model="userMenuItems"
                    :popup="true"
                />
            </template>
        </Menubar>
    </div>
    <div class="container admin-layout">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
@import "../../../assets/base.css";
@import "../assets/base.css";
.container {
    margin-top: 60px;
}
.user-btn {
    background: #ffffff !important;
    color: grey;
    margin-left: 5px !important;
    padding: 5px !important;
    
}
.logo {
    width: auto;
    color: white;
    padding-right: 30px;
    text-decoration: none;
    img {
        max-height: 36px;
    }
    span {
        bottom: 8px;
        span {
            font-weight: bold;
            bottom: 0px;
        }
    }
}
.p-menubar {
    font-size: 18px;
    border: none;
    border-radius: 0;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    height: 60px;
    width: 100%;
    position: fixed;
    z-index: 2;
}
.exportinfo {
    .p-menubar {
        background-color: var(--color-exportinfo-navbar-background-primary);
        @media screen and (min-width: 960px){
            .p-menuitem-text {
                color: var(--color-exportinfo-navbar-text-primary) !important;
            }
        }
        .p-submenu-list {
            background-color: var(--color-exportinfo-navbar-background-primary);
        }
        .p-menuitem-link:hover {
            background-color: var(--color-exportinfo-navbar-hover-background-primary) !important;
        }
        .p-menuitem-active > .p-menuitem-link {
            background: var(--color-exportinfo-navbar-hover-background-primary) !important;
        }
        .p-menuitem-active > .p-menuitem-content {
            background: var(--color-exportinfo-navbar-hover-background-primary) !important;
        }
        .p-focus > .p-menuitem-content {
            background: var(--color-exportinfo-navbar-hover-background-primary) !important;
        }
    }
}
.bzr {
    .p-menubar {
        background-color: var(--color-bzr-navbar-background-primary);
        @media screen and (min-width: 960px){
            .p-menuitem-text {
                color: var(--color-bzr-navbar-text-primary) !important;
            }
        }
        .p-submenu-list {
            background-color: var(--color-bzr-navbar-background-primary);
        }
        .p-menuitem-link:hover {
            background-color: var(--color-bzr-navbar-hover-background-primary) !important;
        }
        .p-menuitem-active > .p-menuitem-link {
            background: var(--color-bzr-navbar-hover-background-primary) !important;
        }
        .p-menuitem-active > .p-menuitem-content {
            background: var(--color-bzr-navbar-hover-background-primary) !important;
        }
        .p-focus > .p-menuitem-content {
            background: var(--color-bzr-navbar-hover-background-primary) !important;
        }
    }
}
.zzs {
    .p-menubar {
        background-color: var(--color-zzs-navbar-background-primary);
        @media screen and (min-width: 960px){
            .p-menuitem-text {
                color: var(--color-zzs-navbar-text-primary) !important;
            }
        }
        .p-submenu-list {
            background-color: var(--color-zzs-navbar-background-primary);
        }
        .p-menuitem-link:hover {
            background-color: var(--color-zzs-navbar-hover-background-primary) !important;
        }
        .p-menuitem-active > .p-menuitem-link {
            background: var(--color-zzs-navbar-hover-background-primary) !important;
        }
        .p-menuitem-active > .p-menuitem-content {
            background: var(--color-zzs-navbar-hover-background-primary) !important;
        }
        .p-focus > .p-menuitem-content {
            background: var(--color-zzs-navbar-hover-background-primary) !important;
        }
    }
}
.container {
    background-color: var(--color-body-background);
}
.p-datatable-scrollable .p-datatable-thead {
    z-index: 1 !important;
}
</style>