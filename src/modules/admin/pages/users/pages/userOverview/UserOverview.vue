<template>
    <div class="user-overview">
        <TabView :activeIndex="activeTabIndex">
            <TabPanel header="Pregled">
                <DefaultTab/>
            </TabPanel>
            <TabPanel header="Notifikacije">

            </TabPanel>
            <TabPanel header="Aktivnosti">
                
            </TabPanel>
        </TabView>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DefaultTab from './tabs/DefaultTab.vue'

const activeTabIndex = ref(0);

</script>

<style lang="scss" scoped>

</style>