<template>
    <div class="user-profile mt-3">
        <div class="user-profile-container grid m-0">
            <div class="col-12 md:col-12 lg:col-3 pt-0 pb-2 pl-2 pr-2">
                <div class="side-bar">
                    <div class="user-logo flex align-items-center justify-content-center">
                        <div class="logo-container flex align-items-center justify-content-center">
                            <i class="pi pi-user" style="font-size: 1.2rem"></i>
                        </div>
                        <div v-if="user" class="user-name ml-2">
                            {{ user.first_name }}
                        </div>
                    </div>
                    <div class="menu-container mt-3">
                        <div class="subscription-menu">
                            <Menu :model="userProfileMenuItems" class="user-profile-menu">
                                <template #submenuheader="{ item }">
                                    <span class="font-bold">{{ item.label }}</span>
                                </template>
                                <template #item="{ item, props }">
                                    <router-link :to="item.route" class="resource-link" >
                                        <div class="flex" :class="{'active-menu-item': item.route.name === route.name}">
                                            <div class="menu-link pb-2 pt-2">
                                                <span :class="item.icon" class="ml-3"/>
                                                <span class="ml-3">{{ item.label }}</span>
                                            </div>
                                            <Badge v-if="item.count" class="ml-auto link-badge" severity="secondary" :value="item.count" v-tooltip="'Na svim portalima ukupno: '+item.count"/>
                                        </div>
                                    </router-link>
                                </template>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main col-12 md:col-12 lg:col-9 pt-0 pb-2 pl-2 pr-2">          
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import Badge from 'primevue/badge';
import { storeToRefs } from 'pinia';
import Menu from 'primevue/menu';
import { useUserStore } from '@admin/stores/user'

const userStore = useUserStore();
const { user, loading } = storeToRefs(userStore);
const router = useRouter();
const route = useRoute();


const props = defineProps({
    id: {
        default: null
    }
});

const userProfileMenuItems = computed( () => [
    { 
        label: 'Profil', 
        icon: 'pi pi-user',
        to: 'user-overview',
        active: true,
        route: {
            name: 'UserOverview',
            params: {userId: user.value?.id}
        },
        key: 'UserOverview'
    },
    { 
        label: 'Pretplate',
        visible: true,
        icon: 'pi pi-money-bill',
        to: 'subscriptions',
        route: {
            name: 'UserSubscriptions',
            params: {userId: user.value?.id}
        },
        count: user.value?.subscriptions_count,
        key: 'UserSubscriptions'
    },
    { 
        label: 'Probni period', 
        visible: true,
        icon: 'pi pi-stopwatch',
        to: 'free-trials',
        route: {
            name: 'UserFreeTrials',
            params: {userId: user.value?.id}
        },
        key: 'UserFreeTrials',
        count: user.value?.free_trials_count,
    },
]);


onBeforeMount( () => {
    if(route.params.userId){
        userStore.getUserProfile(route.params.userId);
    }
});

</script>

<style lang="scss" scoped>
.user-profile {
    max-width: 1200px;
    margin: 0 auto;
    .side-bar {
        background-color: var(--color-background-soft);
        border-right: 1px solid var(--gray-300);
        height: 100%;
        .user-logo {
            height: 50px;
            border-bottom: 2px solid var(--gray-300);
            .logo-container {
                background-color: white;
                border-radius: 5px;
                //box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px -2px;
                border: 1px solid var(--gray-300);
                width: 35px;
                height: 35px;
            }
            .user-name {
                
            }
        }
        .menu-title {
            font-weight: 600;
            margin-left: 1rem;
        }
        .active-menu-item {
            background-color: var(--surface-300);
        }
        .active-menu-item:hover {
            background-color: #e9ecef;
        }
        :deep(.user-profile-menu) {
            width: 100%;
            background-color: var(--color-background-soft);
            border: none;
        }
        :deep(.menu-item) {
            color: var(--text-primary-color) !important;
        }
        :deep(.p-submenu-header) {
            background-color: var(--color-background-soft);
        }
        :deep(.p-menuitem-link) {
            padding: 0.7rem 1rem;
            font-size: 16px;
        }
        :deep(.link-badge) {
            align-self: center;
            margin-right: 5px;
            background-color: var(--surface-400);
        }
    }
    .main {
        :deep(.p-tabview),
        :deep(.p-tabview-nav),
        :deep(.p-tabview-panel),
        :deep(.p-tabview-panels),
        :deep(.p-tabview-selected),
        :deep(.p-tabview-header a)
        {
            background-color: var(--color-background-soft);
        }
    }
}
:deep(.p-tabview-panels) {
    min-height: 620px;
}
</style>