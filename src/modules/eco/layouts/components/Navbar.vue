<script setup>
    import { ref, computed, onBeforeMount } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useAuthStore } from '@/stores/auth'
    import { useGlobalStore } from '@/stores/global'
    import { useBuildMenuRecursively } from '@/composables/useBuildMenuRecursively'
    import { useI18n } from "vue-i18n";
    import Listbox from 'primevue/listbox';
    import { getLang, storeLang } from '@/util/general';

    const { t, locale } = useI18n();
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    const { user, hasUserAdminAccess } = storeToRefs(authStore);
    const { languages } = storeToRefs(globalStore);
    const { insertMenuItems } = useBuildMenuRecursively();
    const selectedLang = ref(false);

    globalStore.getLanguages();

    onBeforeMount( () => {
        selectedLang.value = getLang();
    })

    //Needs to be computed when language changes
    const menuItems = computed(() => {
        return [
            /* {
                label: 'Vesti',
                to: '/news'
            },
            {
                label: 'Propisi',
                items: [{
                    label: 'Prikaži sve',
                    to: '/regulations',
                }]
            }, */
            {
                label: t('nav.home'),
                route: '/',
            },
            {
                label: t('nav.about'),
                route: '/about',
            },
            {
                label: t('nav.municipality'),
                route: '/videos'
            },
            {
                label: t('nav.places'),
                route: '/places',
            },
        ]
    });

    //Fetch and insert menu items
    /* globalStore.getMenuItems()
        .then(responseData => {
            insertMenuItems(menuItems.value[1].items, responseData.regulation_menu, 'regulations');
            insertMenuItems(menuItems.value[2].items, responseData.document_menu, 'documents');
            insertMenuItems(menuItems.value[3].items, responseData.article_menu, 'articles');
            insertMenuItems(menuItems.value[4].items, responseData.question_menu, 'questions');
        }) */

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

    const onLangChange = (event, popoverSlotProps) => {
        if (event.value) {
            storeLang(event.value);
            popoverSlotProps.close();
            locale.value = event.value.lang_code;
            //location.reload();
        }
    }

</script>

<template>
    <Menubar :model="menuItems">
        <template #start>
            <a href="/" class="logo-link">
                <div class="app-logo-wrapper">
                    <img alt="Logo" src="/images/app-logo3.png" to="/">
                </div>
            </a>
        </template>
        <template #item="{ item, props, hasSubmenu }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
            </a>
        </template>
        <template #end>
            <div class="language">
                <Popper>
                    <Button severity="secondary" text>
                        <img v-if="selectedLang"
                            :alt="selectedLang.translated_name" 
                            :src="'/images/langs/'+selectedLang.lang_code+'.png'" 
                            style="width: 18px"/>
                        <i v-else class="pi pi-globe" />
                    </Button>
                    <template #content="popoverSlotProps">
                        <Listbox v-model="selectedLang" 
                            optionLabel="translated_name" 
                            class="w-full md:w-14rem" 
                            listStyle="max-height:250px"
                            :options="languages" 
                            @change="onLangChange($event, popoverSlotProps)"
                            >
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <img :alt="slotProps.option.translated_name" 
                                        :src="'/images/langs/'+slotProps.option.lang_code+'.png'" 
                                        class="mr-2"
                                        style="width: 18px"/>
                                    <div>{{ slotProps.option.translated_name }}</div>
                                </div>
                            </template>
                        </Listbox>
                    </template>
                </Popper>
            </div>
            <!-- <Button
                type="button"
                @click="toggleUserMenu"
                aria-haspopup="true"
                aria-controls="user-menu"
                icon="pi pi-user"
                :label="user ? user.name : ''"
                rounded
                outlined
                class="user-btn"
                :title="user ? user.name : ''"
            >
            </Button>
            <Menu
                id="user-menu"
                ref="menu"
                :model="userMenuItems"
                :popup="true"
                to="/login"
            /> -->
        </template>
    </Menubar>
</template>

<style scoped lang="scss">
    .logo-link {
        width: auto;
        color: white;
        margin-right: 50px;
        text-decoration: none;
        .app-logo-wrapper {
            background-color: white;
            border-radius: 50%;
            display: flex;
            margin-top: 22px;
            height: 40px;
            width: 39px;
            position: relative;
            img {
                height: 50px;
                position: absolute;
                top: -6px;
                left: -5px;
            }
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
        background-color: var(--color-black);
        height: 60px;
        width: 100%;
        position: fixed;
        z-index: 2;

        :deep(.p-menubar-start, .p-menubar-button) {
            flex: 0 0 auto;
        }
        :deep(.p-menubar-root-list) {
            flex: 1 0 auto;
            justify-content: flex-end;
        }
        :deep(.p-menubar-end) {
            flex: 0;
        }
        @media screen and (min-width: 960px){
            :deep(.p-menuitem-text) {
                color: var(--color-white) !important;
            }
        }

        :deep(.p-menuitem-content:hover) {
            background-color: inherit;
            .p-menuitem-link {
                color: var(--link-hover-color);
            }
        }
        :deep(.p-menuitem-link) {
            color: var(--color-white);
        }
        :deep(.p-menuitem-active > .p-menuitem-content) {
            background: var(--color-blue) !important;
        }
        :deep(.p-focus > .p-menuitem-content) {
            background: transparent;
        }
        :deep(.p-submenu-list) {
            background-color: var(--vt-c-black-soft);
        }
    }
    :deep(.p-menubar-root-list) {
        background: var(--color-black);
    }
    .user-btn {
        color: var(--color-white) !important;
        padding: 5px;
    }
    .user-btn:hover {
        border-color: var(--link-hover-color);
        background: var(--link-hover-color);
    }
    #user-menu {
        z-index: 1;
    }
</style>