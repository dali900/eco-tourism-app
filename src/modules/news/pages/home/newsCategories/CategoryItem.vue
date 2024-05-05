<template>
    <div class="category-item" v-if="props.item">
        <router-link :to="{ name: 'news-overview', params: { id: props.item.id } }" class="text-link">
            <AppCard>
                <template #image>
                    <img
                        v-if="props.item.default_image"
                        alt="content-img"
                        :src="apiBaseUrl + props.item.default_image.file_url"
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
                        <div>
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
    .text {
        max-width: 370px;
    }
    margin-bottom: 16px;
}
</style>
