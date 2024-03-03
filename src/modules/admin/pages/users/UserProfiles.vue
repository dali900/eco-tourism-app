<template>
    <div v-if="authStore.hasAdminAccess()" class="user-profiles p-3">
        <UserForm v-model="showForm"></UserForm>
        <div class="header mb-3 flex justify-content-between">
            <div>
                <span class="title">Korisnici</span>&nbsp;
                <Button @click="openForm" icon="pi pi-plus" class="p-button-sm" v-tooltip="'Dodaj novog korisnika'"></Button>
            </div>
            <div>
                <InputText v-model="filters.global.value" @keyup="onFilter" class="mr-3 search-field" placeholder="Pretraži"/>
                <SplitButton label="" :model="sortItems" :icon="sortIcon" :loading="loading" @click="toggleSort" class="p-button-raised"></SplitButton>
            </div>
        </div>
        <div class="card-list grid">
            <div v-for="profile in profiles" class="col-12 md:col-6 lg:col-4 p-2">
                <UserProfileCard :profile="profile"></UserProfileCard>
            </div>
        </div>
        <Paginator @page="onPage" :rows="30" :totalRecords="profilesTotal" :rowsPerPageOptions="[30, 60, 120]"></Paginator>
        <div>Ukupno: {{ profilesTotal }}</div>
    </div>
    <div v-else class="grid">
        <div class="field">
            <NoAccess/>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import Paginator from 'primevue/paginator';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import UserForm from './components/UserForm.vue'
import UserProfileCard from './components/UserProfileCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@admin/stores/user'
import NoAccess from '../noAccess/NoAccess.vue'

const authStore = useAuthStore();
const userStore = useUserStore();
const { profiles, profilesTotal, loading } = storeToRefs(userStore)

const timer = ref(null);
const showForm = ref(false);
const perPage = ref(21);
const sort = ref({
    sortField: "user_created_at",
    sortOrder: -1,
});

const sortItems = [
    {
        label: "Datum kreiranje naloga",
        command: () => {
            sort.value.sortField = "user_created_at";
            onSort(sort.value);
        }
    },
    {
        label: "Ime korisnika",
        command: () => {
            sort.value.sortField = "user_name";
            onSort(sort.value);
        }
    },
    {
        label: "Datum početka plaćenog plana",
        command: () => {
            sort.value.sortField = "subscription_start_date";
            onSort(sort.value);
        }
    },
    {
        label: "Datum završetka plaćenog plana",
        command: () => {
            sort.value.sortField = "subscription_end_date";
            onSort(sort.value);
        }
    },
    {
        label: "Datum početka probnog perioda",
        command: () => {
            sort.value.sortField = "free_trial_start_date";
            onSort(sort.value);
        }
    },
    {
        label: "Datum završetka probnog perioda",
        command: () => {
            sort.value.sortField = "free_trial_end_date";
            onSort(sort.value);
        }
    },
];
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});

const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

userStore.getUserProfiles({sort: sort.value, pagination: pagination.value, filters: filters.value});

const sortIcon = computed(() => { 
    if(sort.value.sortOrder == -1) return "pi pi-sort-amount-down";
    if(sort.value.sortOrder == 1) return "pi pi-sort-amount-up-alt";
    return "pi pi-sort-alt";
 });

 onUnmounted( () => {
    clearTimeout(timer.value);
    timer.value = null;
});

const onSort = (event) => {
    sort.value.sortField = event.sortField;
    sort.value.sortOrder = event.sortOrder;
    userStore.getUserProfiles({sort: sort.value, pagination: pagination.value, filters: filters.value});
};

const onPage = (event) => {
    pagination.value.page = event.page + 1;
    if(perPage.value != event.rows){
        pagination.value.perPage = event.rows;
    }
    userStore.getUserProfiles({sort: sort.value, pagination: pagination.value, filters: filters.value});
}

const onFilter = (event, e) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        userStore.getUserProfiles({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const toggleSort = () => {
    if(sort.value.sortOrder == -1){
        sort.value.sortOrder = 1;
    } else {
        sort.value.sortOrder = -1;
    }
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
        userStore.getUserProfiles({sort: sort.value, pagination: pagination.value, filters: filters.value});
    },400);
}

const openForm = () => {
    showForm.value = true;
}

</script>

<style lang="scss" >
.container {
    padding-bottom: 0 !important;
}
.user-profiles {
    height: calc( 100vh - 60px );
    max-width: 1200px;
    margin: 0 auto;
   /*  padding-bottom: 150px !important; */
   background-color: var(--color-background-soft);
   .header {
        .title {
            font-size: 24px;
        }
    }
    .card-list {
        height: calc(100vh - 198px);
        overflow-y: scroll;
    }
    
}

</style>