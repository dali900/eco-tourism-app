<template>
    <div class="category-item" v-if="props.attraction">
        <router-link :to="{ name: 'attraction', params: { id: props.attraction.id } }" class="text-link">
            <AppCard>
                <template #image>
                    <img
                        v-if="props.attraction.thumbnail"
                        alt="content-img"
                        :src="apiBaseUrl + props.attraction.thumbnail.file_url"
                    />
                    <img v-else alt="content-img" src="/images/thumbnails/attraction.jpg" />
                </template>
                <template #title>
                    {{ props.attraction.t.name }}
                </template>
                <template #content>
                    {{ props.attraction.t.summary }}
                </template>
            </AppCard>
        </router-link>
    </div>
</template>

<script setup>
import AppCard from '@/components/appCard/AppCard.vue';

const props = defineProps({
    attraction: {
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
    .text {
        max-width: 370px;
    }
    margin-bottom: 16px;
}
</style>
