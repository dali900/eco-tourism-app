<template>
    <div class="categories-">
        <Menubar :model="menuItems">
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"/>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"/>
                </a>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global';
import { useBuildMenuRecursively } from '@/composables/useBuildMenuRecursively'

const { t, locale } = useI18n();
const globalStore = useGlobalStore();
const { loading } = storeToRefs(globalStore);
const { insertMenuItems } = useBuildMenuRecursively(); 
const menuItems = ref(null);

watch(locale, (newVal) => {
    //Fetch and insert menu items
    menuItems.value = [
        {
            label: '',
            route: '/news/',
            icon: 'pi pi-home',
        }
    ]
    globalStore.getMenuItems()
        .then(responseData => {
            insertMenuItems(menuItems.value, responseData, 'news-category');
        })
}, {immediate: true})

</script>