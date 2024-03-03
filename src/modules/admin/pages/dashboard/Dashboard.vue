<template>
    <div class="dashboard p-3">
        <h2>Admin dashboard</h2>
        <div class="list grid" v-if="rowCounts">
            <div class="col-12 md:col-6 lg:col-4 p-2">
                <router-link :to="{ name: 'AdminNews'}" class="btn-link">
                    <div class="stat-card p-2 p-card">
                        <div>Vesti: {{ rowCounts.news_row_count }}</div>
                    </div>
                </router-link>
            </div>
            <div class="col-12 md:col-6 lg:col-4 p-2">
                <router-link :to="{ name: 'AdminRegulations'}" class="btn-link">
                    <div class="stat-card p-2 p-card">
                        <div>Propisi: {{ rowCounts.regulations_row_count }}</div>
                    </div>
                </router-link>
            </div>
            <div class="col-12 md:col-6 lg:col-4 p-2">
                <router-link :to="{ name: 'AdminDocuments'}" class="btn-link">
                    <div class="stat-card p-2 p-card">
                        <div>Dokumentacija: {{ rowCounts.documents_row_count }}</div>
                    </div>
                </router-link>
            </div>
            <div class="col-12 md:col-6 lg:col-4 p-2">
                <router-link :to="{ name: 'AdminArticles'}" class="btn-link">
                    <div class="stat-card p-2 p-card">
                        <div>Članci: {{ rowCounts.articles_row_count }}</div>
                    </div>
                </router-link>
            </div>
            <div class="col-12 md:col-6 lg:col-4 p-2">
                <router-link :to="{ name: 'AdminQuestions'}" class="btn-link">
                    <div class="stat-card p-2 p-card">
                        <div>Pitanja: {{ rowCounts.questions_row_count }}</div>
                    </div>
                </router-link>
            </div>
            <div class="col-12 md:col-6 lg:col-4 p-2">
                <router-link :to="{ name: 'AdminUserProfiles'}" class="btn-link">
                    <div class="stat-card p-2 p-card">
                        <div>Korisnici: {{ rowCounts.users_row_count }}</div>
                        <div>Placeni: {{ rowCounts.subscriptions_row_count }}</div>
                        <div>Free trial: {{ rowCounts.free_trials_row_count }}</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@admin/stores/dashboard'

const dashboardStore = useDashboardStore();
const { rowCounts, loading } = storeToRefs(dashboardStore);

onBeforeMount( () => {
    dashboardStore.getRowCounts();
});


</script>

<style lang="scss" scoped>
.dashboard {
    margin-top: 60px;
    .list {
        max-width: 800px;
        margin: 0 auto;
    }
    .stat-card {
        min-height: 100px;
    }
}
</style>