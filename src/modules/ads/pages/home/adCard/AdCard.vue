<template>
    <div class="app-card">
        <div class="price-mobile">
            {{ props.ad.price_formated }} <span class="currency">{{ props.ad.currency }}</span>
        </div>
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
                    <div class="header">
                        <h2 class="title">
                            {{ props.ad.t.title }}
                        </h2>
                        <div class="price-wrapper">
                            <div class="price">
                                {{ props.ad.price_formated }} <span class="currency">{{ props.ad.currency }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="grid mb-3">
                        <div class="col-12 md:col-4 lg:col-4" v-if="props.ad.category.ancestorsAndSelf">
                            <div class="item">
                                <div class="data">
                                    {{ props.ad.category.ancestorsAndSelf[0].t.name }}
                                </div>
                                <div class="label">{{ t('ads.category') }}</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-4 lg:col-4" v-if="props.ad.category.ancestorsAndSelf && props.ad.category.ancestorsAndSelf.length > 1">
                            <div class="item">
                                <div class="data">
                                    {{ props.ad.category.ancestorsAndSelf[1].t.name }}
                                </div>
                                <div class="label">{{ t('ads.subCategory') }}</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-4 lg:col-4">
                            <div class="item">
                                <div class="data">
                                    {{ props.ad.place.t.name }}
                                </div>
                                <div class="label">{{ t('ads.place') }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="description">
                        {{ props.ad.t.description }}
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
import { useI18n } from 'vue-i18n';
const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const { t } = useI18n();
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
    border: 1px solid var(--color-black-mute);
    border-bottom: none;
    overflow: hidden;
    transition: 0.1s linear;
    position: relative;
    &:hover {
        box-shadow: 1px 5px 19px -3px rgba(15, 49, 53, 0.75);
    }
    @media screen and (max-width: 768px) {
        height: auto;
    }
    .price-mobile {
        display: none;
        position: absolute;
        right: 0;
        padding: 16px;
        background-color: #6CDF8C;
        font-size: 16px;
        font-weight: 600;
        color: #4d4d4d;
        border-bottom-left-radius: 15px;
        @media screen and (max-width: 768px) {
            display: block;
        }
    }
    .img-wrapper {
        overflow: hidden;
        text-align: center;
        margin-left: -6px;
        img {
            max-width: 405px;
            height: auto;
        }
        .default-img {
            height: 150px;
        }
    }
    .default-img-wrapper {
        overflow: hidden;
        text-align: center;
        padding: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
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
        text-align: left;
        .header {
            display: flex;
            justify-content: space-between;
            .title {
                font-size: var(--font-size-content);
                font-weight: 600;
                margin-top: 4px;
                margin-bottom: 32px;
            }
            .price-wrapper {
                flex: 0 0 auto;
                display: block;
                @media screen and (max-width: 768px) {
                display: none;
            }
            }
            .price {
                padding: 16px;
                background-color: #6CDF8C;
                font-size: 16px;
                font-weight: 600;
                color: #4d4d4d;
                border-bottom-left-radius: 15px;
                margin-top: -8px;
                margin-right: -8px;
            }
            .currency {
                font-size: 14px;
            }
        }
        .data {
            margin-bottom: 4px;
        }
        .label {
            font-size: 10px;
            color: var(--text-secondary-color);
            text-transform: uppercase;
        }
        .description {
            display: -webkit-box;
            line-clamp: 7;
            -webkit-line-clamp: 7;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        @media screen and (max-width: 768px) {
            .description {
                line-clamp: 4;
                -webkit-line-clamp: 4;
            }
        }
    }
    .card-footer {
        padding: 8px 8px 4px 8px;
    }
}
</style>
