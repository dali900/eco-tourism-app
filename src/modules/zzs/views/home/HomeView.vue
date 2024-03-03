<script setup>
    import { ref, reactive, computed, watch } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useAuthStore } from '../../stores/auth'
    import { useRouter} from 'vue-router'
    import  Footer  from './Footer.vue'
    import { useDocumentStore } from '../../stores/document'
    import { useRegulationStore } from '../../stores/regulation'
    import { useArticleStore } from '../../stores/article'
    import { useQuestionStore } from '../../stores/question'

    const authStore = useAuthStore();
    const { user, isAuthenticated, hasUserAdminAccess} = storeToRefs(authStore);
    const router = useRouter();

    const regulationStore = useRegulationStore();
    const documentStore = useDocumentStore();
    const articleStore = useArticleStore();
    const questionStore = useQuestionStore();

    const items = ref([
        {
            label: 'Vesti',
            to: '/news'
        },
        {
            label: 'Propisi',
            items: [
                {
                    label: 'Prikaži sve',
                    to: '/regulations',
                },
                {
                    label: 'Spoljnotrgovinsko poslovanje',
                    to: '/regulations/foreign_trade_business',
                    items: []
                },
                {
                    label: 'Devizno poslovanje',
                    to: '/regulations/foreign_exchange_business',
                    items: []
                },
                {
                    label: 'Carinsko poslovanje',
                    to: '/regulations/foreign_customs_business',
                    items: []
                }
            ]
        },
        {
            label: 'Dokumentacija i objašnjenja',
            items: [{
                label: 'Prikaži sve',
                to: '/documents',
            }]
        },
        {
            label: 'Članci',
            items: [{
                label: 'Prikaži sve',
                to: '/articles',
            }]
        },
        {
            label: 'Službena mišljenja i odgovori na pitanja',
            items: [{
                label: 'Prikaži sve',
                to: '/questions',
            }]
        },
        {
            label: 'Video',
            to: '/videos'
        }
    ]);

    //Fetch and add document types in document menu items
    documentStore.getDocumentTypes()
        .then( responseData => {
            if(responseData.document_types && responseData.document_types.results) {
                for (const key in responseData.document_types.results) {
                    const documentType = responseData.document_types.results[key];
                    items.value[2].items.push({
                        label: documentType.name,
                        to: "/documents/" + documentType.id
                    });
                }
            };
        });

    //Fetch and add regulations types in document menu items
    regulationStore.getRegulationTypes()
        .then( responseData => {
            if(responseData.regulation_types && responseData.regulation_types.results) {
                for (const key in responseData.regulation_types.results) {
                    const regulationType = responseData.regulation_types.results[key];
                    items.value[1].items[1].items.push({
                        label: regulationType.name,
                        to: "/regulations/foreign_trade_business/" + regulationType.id
                    });
                    items.value[1].items[2].items.push({
                        label: regulationType.name,
                        to: "/regulations/foreign_exchange_business/" + regulationType.id
                    });
                    items.value[1].items[3].items.push({
                        label: regulationType.name,
                        to: "/regulations/foreign_customs_business/" + regulationType.id
                    });
                }
            };
        });

    //Fetch and add articles types in document menu items
    articleStore.getArticleTypes()
        .then( responseData => {
            if(responseData.article_types && responseData.article_types.results) {
                for (const key in responseData.article_types.results) {
                    const articleType = responseData.article_types.results[key];
                    items.value[3].items.push({
                        label: articleType.name,
                        to: "/articles/" + articleType.id
                    });
                }
            };
        });

    //Fetch and add questions types in document menu items
    questionStore.getQuestionTypes()
        .then( responseData => {
            if(responseData.question_types && responseData.question_types.results) {
                for (const key in responseData.question_types.results) {
                    const questionType = responseData.question_types.results[key];
                    items.value[4].items.push({
                        label: questionType.name,
                        to: "/questions/" + questionType.id
                    });
                }
            };
        });

    const menuItems = computed(() => {
        let menuItems = [];
        if(user.value){
            if(hasUserAdminAccess.value) {
                menuItems.push({
                    label: "Admin panel",
                    to: "/admin"
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
        //indexStore.openApp(false);
    }
    
    const userMenuItems = ref(menuItems);
</script>

<template>
    <Menubar :model="items">
        <template #start>
            <a href="/" class="logo">
                <img alt="Logo" src="/images/zzs_white_logo.svg" to="/">
                <span><span>  EXPORT</span> INFO</span>
            </a>
        </template>
        <template #end>
            <a href="/Narudzbenica_ExportInfo.pdf" target= “_blank” class="purchase-order">
                NARUDŽBENICA
            </a>
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
    <div class="container">
        <div class="content">
            <router-view></router-view>
        </div>
        <Footer></Footer>
    </div>
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
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        background-color: var(--color-zzs-navbar-background-primary);
        height: 60px;
        width: 100%;
        position: fixed;
        z-index: 2;
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
    .container {
        height: auto;
        min-height: 100%;
        position: relative;
        background-color: var(--color-zzs-body-background);
        padding-top: 60px;
        padding-bottom: 280px;
        /* color: rgb(209, 213, 219); */
    }
    .content {
        margin: 0 auto;
    }
    .content > div:not(.user-news) {
        margin: 0 auto;
        max-width: 1200px;
    }
    .user-btn {
        background: #ffffff !important;
        color: var(--color-zzs-card-text-primary) !important;
        border-radius: 5px !important;
    }
    .user-btn:enabled:hover {
        background: var(--color-zzs-navbar-hover-background-primary) !important;
        border-color: var(--color-zzs-navbar-hover-background-primary) !important;
    }
    #user-menu {
        z-index: 1;
    }
    .purchase-order {
        color: white;
        font-size: 20px;
        text-decoration: none;
        padding-right: 10px;
        text-decoration: underline;
    }
</style>