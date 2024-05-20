<template>
    <div class="category-item" v-if="props.item">
        <router-link :to="{ name: 'news-overview', params: { id: props.item.id } }" class="text-link">
            <AppCard>
                <template #image>
                    <img
                        v-if="props.item.thumbnail"
                        alt="content-img"
                        :src="apiBaseUrl + props.item.thumbnail.file_url"
                    />
                    <img v-else alt="content-img" src="/images/thumbnails/news-thumb.png" />
                </template>
                <template #title>
                    {{ props.item.title }}
                </template>
                <template #content>
                    <div>
                        <div class="small-section">
                            <span v-if="item.publish_date_formated">
                                <i class="pi pi-clock"></i> 
                                {{ item.publish_date_formated }}
                            </span>
                        </div>
                        <div class="content">
                            {{ props.item.summary }}
                        </div>
                    </div>
                </template>
            </AppCard>
        </router-link>
    </div>
</template>

<script setup>
import AppCard from '@/components/appCard/AppCard.vue';

const props = defineProps({
    item: {
        default: null
    },
});

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;

</script>

<style scoped>
.category-item {
    .img-wrapper {
        height: 200px;
        overflow: hidden;
        margin-bottom: 16px;
        img {
            max-width: 360px;
            height: auto;
        }
    }
    .small-section {
        color: var(--text-light-color) !important;
        font-size: 14px;
        margin-bottom: 8px;
    }
    .content {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;  
        /* overflow: hidden;
        white-space: wrap; 
        text-overflow: ellipsis; */
        overflow: hidden;
    }
    margin-bottom: 16px;
}
</style>
