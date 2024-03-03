<template>
    <div class="user-overview">
        <TabView :activeIndex="activeTabIndex" unstyled>
            <TabPanel header="Pregled">
                <DefaultTab/>
            </TabPanel>
            <!-- <TabPanel header="Lista">
                <FreeTrialListTab/>
            </TabPanel> -->
        </TabView>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DefaultTab from './tabs/DefaultTab.vue'
import FreeTrialListTab from './tabs/FreeTrialListTab.vue'

const activeTabIndex = ref(0);

</script>

<style lang="scss" scoped>
:deep(.p-tabview-panels) {
    padding: 0;
}
</style>