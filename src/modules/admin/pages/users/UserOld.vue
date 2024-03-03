<template>
    <div class="user-profile mt-3">
        <div class="user-profile-container grid m-0">
            <div class="side-bar col-12 md:col-12 lg:col-3 p-0">
                <BasicInfo @onOpenTab="onOpenTab"></BasicInfo>
            </div>
            <div class="main col-12 md:col-12 lg:col-9 p-0">
                <TabView :activeIndex="activeTabIndex">
                    <TabPanel header="Osnovno">
                        <DefaultTab @onOpenTab="onOpenTab"></DefaultTab>
                    </TabPanel>
                    <TabPanel header="Pretplata">
                        <SubscriptionTab></SubscriptionTab>
                    </TabPanel>
                    <TabPanel header="Free trial">
                        <FreeTrialTab></FreeTrialTab>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useUserStore } from '@admin/stores/user'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import BasicInfo from './components/BasicInfo.vue'
import DefaultTab from './components/tabs/defaultTab/DeafaultTab.vue'
import SubscriptionTab from './components/tabs/subscriptionTab/SubscriptionTab.vue'
import FreeTrialTab from './components/tabs/freeTrialTab/FreeTrialTab.vue'

const userStore = useUserStore();
const { user, loading } = storeToRefs(userStore);
const router = useRouter();
const route = useRoute();
const activeTabIndex = ref(0);


const props = defineProps({
    id: {
        default: null
    }
});

onBeforeMount( () => {
    if(route.params.userId){
        userStore.getUserProfile(route.params.userId);
    }
});

const onOpenTab = (index) => {
    activeTabIndex.value = index;
}

</script>

<style lang="scss" scoped>
.user-profile {
    max-width: 1200px;
    margin: 0 auto;
    background-color: var(--color-background-soft);
    .side-bar {
        border-right: 1px solid var(--gray-300);
    }
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
:deep(.p-tabview-panels) {
    min-height: 620px;
}
</style>