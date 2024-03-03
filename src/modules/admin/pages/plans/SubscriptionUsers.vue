<template>
    <div>
        users
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import { useConfirm } from "primevue/useconfirm";
import { useSubscriptionStore } from '@admin/stores/subscription'

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const subscriptionStore = useSubscriptionStore();
const { subscriptionPlans, subscriptionPlansTotal, loading } = storeToRefs(subscriptionStore);

const timer = ref(null);
const showForm = ref(false);
const showUpdateForm = ref(false);
const windowWidth = ref("");
const resourceId = ref(null);
const perPage = ref(20);
const sort = ref({
    sortField: "sortField" in route.query ? route.query.sortField : "created_at",
    sortOrder: "sortOrder" in route.query ? route.query.sortOrder : -1,
});
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'messenger': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const mainColumnsWidth = computed(() => { return {'min-width': (90/3).toFixed(2)+'%'} });

//data and props ready, dom still not
onBeforeMount( () => {
    subscriptionStore.getSubscriptions({sort: sort.value, pagination: pagination.value, filters: filters.value});
});
</script>

<style lang="scss" scoped>

</style>