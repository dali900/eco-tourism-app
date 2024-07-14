<template>
    <div class="app-card">
        <div class="grid h-full">
            <div class="col-12 md:col-3 lg:col-4">
                <div v-if="props.ad.thumbnail" class="img-wrapper h-full">
                    <img alt="content-img" :src="apiBaseUrl + props.ad.thumbnail.file_url" />
                </div>
                <div v-else class="default-img-wrapper">
                    <img class="default-img" alt="content-img" src="/images/app-logo3-fade.png" />
                </div>
            </div>
            <div class="col-12 md:col-9 lg:col-8">
                <div class="card-content h-full">
                    <h2 class="title">
                        {{ props.ad.title }}
                    </h2>
                    <div class="description">
                        {{ props.ad.description }}
                    </div>
                    <div class="description">
                        {{ props.ad.price }}
                    </div>
                    <div class="card-footer">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const props = defineProps({
    ad: {
        default: false
    },
});
</script>

<style lang="scss" scoped>
.app-card {
    display: flex;
    flex-direction: column;
    /* padding-bottom: 8px; */
    height: 300px;
    width: 100%;
    -webkit-box-shadow: 1px 8px 19px -12px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 8px 19px -12px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 8px 19px -12px rgba(0, 0, 0, 0.75);
    box-sizing: border-box;
    border-radius: 15px;
    overflow: hidden;
    transition: 0.1s linear;
    &:hover {
        box-shadow: 1px 5px 19px -3px rgba(15, 49, 53, 0.75);
    }
    .img-wrapper {
        overflow: hidden;
        text-align: center;
        img {
            max-width: 360px;
            height: auto;
        }
        .default-img {
            height: 150px;
        }
    }
    .default-img-wrapper {
        overflow: hidden;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            align-self: center;
            max-width: 360px;
            height: auto;
        }
        .default-img {
            height: 150px;
        }
    }
    .card-content {
        padding: 8px;
        flex: 1;
        .title {
            font-size: var(--font-size-content);
            font-weight: 600;
            margin-top: 4px;
            margin-bottom: 8px;
        }
        .description {
            max-width: 360px;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }
    .card-footer {
        padding: 8px 8px 4px 8px;
    }
}
</style>
