<script setup>
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useAuthStore } from '@/stores/auth'
    import { useGlobalStore } from '@/stores/global'
    import { useBuildMenuRecursively } from '@/composables/useBuildMenuRecursively'

    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    const { user, hasUserAdminAccess} = storeToRefs(authStore);
    const { insertMenuItems } = useBuildMenuRecursively();

    const menuItems = ref([
        {
            label: 'Vesti',
            to: '/news'
        },
        {
            label: 'Propisi',
            items: [{
                label: 'Prikaži sve',
                to: '/regulations',
            }]
        },
        {
            label: 'Dokumenti',
            items: [{
                label: 'Prikaži sve',
                to: '/documents',
            }]
        },
        {
            label: 'Članci',
            to: '/articles',
        },
        {
            label: 'Pitanja i odgovori',
            to: '/questions'
        },
        {
            label: 'Video',
            to: '/videos'
        }
    ]);
    
    //Fetch and insert menu items
    globalStore.getMenuItems()
        .then(responseData => {
            insertMenuItems(menuItems.value[1].items, responseData.regulation_menu, 'regulations');
            insertMenuItems(menuItems.value[2].items, responseData.document_menu, 'documents');
            insertMenuItems(menuItems.value[3].items, responseData.article_menu, 'articles');
            insertMenuItems(menuItems.value[4].items, responseData.question_menu, 'questions');
        })

    const userMenuItemsComputed = computed(() => {
        let menuItems = [];
        if(user.value){
            if(hasUserAdminAccess.value) {
                menuItems.push({
                    label: "Admin panel",
                    command: () => {
                        window.location.href = import.meta.env.VITE_ADMIN_URL;
                    }
                });
            }
            menuItems.push({
                label: "Izlogujte se",
                command: () => {
                    logout();
                }
            });
        } else {
            menuItems = [
                {
                    label: "Prijavi se",
                    to: "/login"
                },
                {
                    label: "Kreiraj nalog",
                    to: "/create-account"
                }
            ];
        }
        return menuItems;
    });

    const menu = ref(null); //Gets <Menu> component via ref="meni"
    const toggleUserMenu = (event) => {
        menu.value.toggle(event);
    }

    const logout = async () => {
        await authStore.logout();
        //router.push({name: 'News'});
    }
    
    const userMenuItems = ref(userMenuItemsComputed);

</script>

<template>
    <Menubar :model="menuItems">
        <template #start>
            <a href="/" class="logo">
                <!-- <img alt="Logo" src="/images/bzr_white_logo.png" to="/"> -->
                <span>Selo na 3 klika</span>
            </a>
        </template>
        <template #end>            
            <Button
                type="button"
                @click="toggleUserMenu"
                aria-haspopup="true"
                aria-controls="user-menu"
                :icon="user ? 'pi pi-user' : ''"
                :label="user ? user.name : 'PRIJAVA'"
                class="p-button-rounded p-link user-btn"
                :title="user ? user.name : ''"
            >
            </Button>
            <Menu
                id="user-menu"
                ref="menu"
                :model="userMenuItems"
                :popup="true"
                to="/login"
            />
        </template>
    </Menubar>
</template>

<style lang="scss">
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
        border-bottom: 1px solid white !important;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        background-color: var(--color-bzr-navbar-background-primary);
        height: 60px;
        width: 100%;
        position: fixed;
        z-index: 2;
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
    .user-btn {
        background: #ffffff;
        color: var(--color-bzr-navbar-text-primary) !important;
        border-radius: 5px !important;
        padding: 5px;
    }
    .user-btn:enabled:hover {
        background: var(--color-bzr-navbar-hover-background-primary);
        border-color: var(--color-bzr-navbar-hover-background-primary);
    }
    #user-menu {
        z-index: 1;
    }
    .portal-2023 {
        color: red;
        font-size: 20px;
        text-decoration: none;
        padding-right: 10px;
    }
</style>