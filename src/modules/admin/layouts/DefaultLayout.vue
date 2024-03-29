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
                route: '/admin/users/',
                visible: authStore.hasAdminAccess()
            },
            {
                label: 'Korisnički profili',
                route: '/user-profiles',
                visible: authStore.hasAdminAccess()
            },
            {
                label: 'Vrste planova',
                route: '/plans'
            },
        ]
    },
    {
        label: 'Vesti',
        route: '/admin/news/'
    },
    {
        label: 'Članci',
        items: [
            {
                label: 'Prikaz članaka',
                route: '/articles',
            },
            {
                label: 'Kategorije',
                route: '/article-types',
            }
        ]
    },
]);

const menu = ref(null); //Gets <Menu> component via ref="meni"
const toggleUserMenu = (event) => {
    menu.value.toggle(event);
}

const userMenuItems = ref([
    /* {
        label: "Korisnički panel BZR",
        command: () => {
            window.open(import.meta.env.VITE_BZR_URL, '_blank');
        }
    }, */
    {
        label: "Izlogujte se",
        command: () => {
            logout();
        }
    }
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
                <a class="logo">
                    <img alt="Logo" src="/images/app-logo.svg" to="/">
                    <span>Selo na 3 klika</span>
                </a>
            </template>
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2 p-menuitem-text">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2 p-menuitem-text">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                </a>
            </template>
            <template #end>
                <!-- <InputText placeholder="Pretražite" type="text" /> -->
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
    display: flex;
    align-items: center;
    img {
        max-height: 36px;
        margin-right: 4px;
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
    background-color: var(--color-black);
    .p-menuitem-text {
        color: var(--color-white);
    }
    /* .p-menuitem-link {
        color: var(--color-white);
    } */
    .p-menuitem.p-highlight > .p-menuitem-content {
        background-color: var(--color-black-soft);
    }
    .p-menuitem.p-focus > .p-menuitem-content {
        background-color: var(--color-dark-grey);
    }
    .p-menuitem-content:hover {
        /* background-color: inherit; */
        background-color: var(--color-dark-grey);
        .p-menuitem-text {
            /* color: var(--link-hover-color); */
        }
    }
    .p-submenu-list {
        background-color: var(--color-black-soft);
    }
}

.p-datatable-scrollable .p-datatable-thead {
    z-index: 1 !important;
}
</style>