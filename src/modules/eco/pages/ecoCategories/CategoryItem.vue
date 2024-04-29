<template>
    <div class="category-item" v-if="props.attraction">
        <router-link :to="{ name: 'attraction', params: { id: props.attraction.id } }" class="link-text">
            <div class="img-wrapper" :key="attraction.id">
                <img
                    v-if="props.attraction.default_image"
                    alt="content-img"
                    :src="apiBaseUrl + props.attraction.default_image.file_url"
                />
                <img v-else alt="content-img" src="/images/thumbnails/t1.png" />
            </div>
            <div class="text">{{ props.attraction.summary }}</div>
        </router-link>
    </div>
</template>

<script setup>

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
