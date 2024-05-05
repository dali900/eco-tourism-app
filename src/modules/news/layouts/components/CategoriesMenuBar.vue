<template>
    <div class="categories-">
        <Menubar :model="items">
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom :key="item.label">
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                </a>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref } from "vue";


const items = ref([
    {
        label: '',
        route: '/news/',
        icon: 'pi pi-home',
    },
    {
        label: 'Despotovac',
        route: {name: 'news-category', params: {id: 1}}
        //icon: 'pi pi-palette',
    },
    {
        label: 'Politika',
        route: {name: 'news-category', params: {id: 2}}
    },
    {
        label: 'INFO',
        //url: '/news/news-category/3',
        items: [
            {
                label: 'Sve',
                route: '/news/news-category/3'
            },
            {
                label: 'Saopštenja',
                route: '/news/news-category/4'
            },
        ]
    },
    {
        label: 'Društvo',
        route: '/news'
    },
    {
        label: 'Ekonomija',
        route: '/news/news-category/6'
    },
    {
        label: 'Sport',
        route: '/news/news-category/7'
    },
    {
        label: 'Kultura',
        route: '/news/news-category/8'
    },
    {
        label: 'Kultura',
        route: '/news/news-category/8'
    },
    {
        label: 'Događaji',
        route: '/news/news-category/9'
    },
]);
</script>