<template>
    <div class="user-subscriptions">
        <TabView :activeIndex="activeTabIndex">
            <TabPanel header="Pregled">
                <SubscriptionListTab/>
            </TabPanel>
        </TabView>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import SubscriptionListTab from './tabs/SubscriptionListTab.vue'

const activeTabIndex = ref(0);

</script>

<style lang="scss" scoped>
:deep(.p-tabview-panels) {
    padding: 0;
}
</style>