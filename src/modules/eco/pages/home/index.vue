<template>
    <div class="home">

        <!-- Header imag -->
        <div class="header-img">
            <div class="msg">{{ t('home.headerMsg') }}</div>
            <img alt="header-img" src="/images/watter.png">
        </div>

        <!-- Banners -->
        <div class="banners grid">
            <router-link to="/" class="col-12 md:col-6 lg:col-4 banner-link">
                <div class="banner tourism">
                    <div class="msg">{{ t('home.tourism') }}</div>
                </div>
            </router-link>
            <router-link to="/" class="col-12 md:col-6 lg:col-4 banner-link">
                <div class="banner market">
                    <div class="msg">{{ t('home.market') }}</div>
                </div>
            </router-link>
            <router-link to="/" class="col-12 md:col-6 lg:col-4 banner-link">
                <div class="banner news">
                    <div class="msg">{{ t('home.news') }}</div>
                </div>
            </router-link>
        </div>

        <!-- Latest content -->
        <div class="latest-content">
            <div class="title">
                <div>
                    {{ t('home.latestContentTitle') }}
                </div>
            </div>
            <div class="items grid">
                <div class="col-12 md:col-6 lg:col-4" v-for="(item, key) in latestConent">
                    <div class="item">
                        <div>
                            <div class="img-wrapper" :key="key">
                                <img v-if="item.image_url" alt="content-img" :src="item.image_url">
                            </div>
                            <div class="text">{{ item.text }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics -->
        <div class="statistics">
            <div class="title flex-justify-center">
                <div>
                    {{ t('home.statisticsTitle') }}
                </div>
            </div>
            <div class="data-points grid">
                <div class="col-12 md:col-6 lg:col-4 flex-justify-center">
                    <div class="data-wrapper">
                        <div class="number flex-justify-center">
                            <div class="">123.456</div>
                        </div>
                        <div class="number-title">Despotovac</div>
                    </div>
                </div>
                <div class="col-12 md:col-6 lg:col-4 flex-justify-center">
                    <div class="data-wrapper">
                        <div class="number flex-justify-center">
                            <div class="">123.456</div>
                        </div>
                        <div class="number-title">Petrovac na Mlavi</div>
                    </div>
                </div>
                <div class="col-12 md:col-6 lg:col-4 flex-justify-center">
                    <div class="data-wrapper">
                        <div class="number flex-justify-center">
                            <div class="">123.456</div>
                        </div>
                        <div class="number-title">Zagubica</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Suggestions -->
        <div class="suggestions">
            <div class="title flex-justify-center">
                <div>
                    {{ t('home.suggestionTitle') }}
                </div>
            </div>
            <div class="list">
                <div class="grid">
                    <div class="col-12 md:col-6 lg:col-6">
                        <div class="suggestion-img-wrapper">
                            <img alt="header-img" src="/images/thumbnails/new1.png">
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-6 flex-justify-center">
                        <div class="suggestion-content">
                            <div class="suggestion-title">
                                Priroda kao iz bajke
                            </div>
                            <div class="suggestion-text">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since theorem. 

                                LIpsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                            </div>
                            <div class="btn">
                                <AppButton>Vise</AppButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12 md:col-6 lg:col-6 flex-justify-center">
                        <div class="suggestion-content">
                            <div class="suggestion-title">
                                Priroda kao iz bajke
                            </div>
                            <div class="suggestion-text">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since theorem. 

                                LIpsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                            </div>
                            <div class="btn">
                                <Button class="btn-d">Vise</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-6 flex-justify-center">
                        <div class="suggestion-img-wrapper">
                            <img alt="header-img" src="/images/thumbnails/new1.png">
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="col-12 md:col-6 lg:col-6 ">
                        <div class="suggestion-img-wrapper">
                            <img alt="header-img" src="/images/thumbnails/new1.png">
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-6 ">
                        <div class="suggestion-content">
                            <div class="suggestion-title">
                                Priroda kao iz bajke
                            </div>
                            <div class="suggestion-text">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since theorem. 

                                LIpsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                            </div>
                            <div class="btn">
                                <Button class="btn-d">Vise</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="partners">

        </div>
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import AppButton from "@/components/Button/Button.vue"

const { t } = useI18n();
const latestConent = ref([
    {
        image_url: "/images/thumbnails/t1.png",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley "
    },
    {
        image_url: "/images/thumbnails/t2.png",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley "
    },
    {
        image_url: "/images/thumbnails/t3.png",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley "
    },
    {
        image_url: "/images/thumbnails/n1.png",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley "
    },
    {
        image_url: "/images/thumbnails/t4.png",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley "
    },
    {
        image_url: "/images/thumbnails/t5.png",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley "
    },
]);

</script>

<style scoped>
.home {
    .header-img {
        position: relative;
        max-width: var(--container-width);
        height: 300px;
        overflow: hidden;
        .msg {
            position: absolute;
            right: 16px;
            top: 170px;
            color: var(--color-white);
            font-size: 45px;
            width: 401px;
            height: auto;
        }
        margin-bottom: 64px;
    }
    .title {
        font-size: 45px;
        font-weight: 600;
    }
    .banners {
        /* display: flex;
        flex-wrap: wrap;
        justify-content: space-between; */
        justify-content: center;
        .banner-link {
            text-decoration: none;
            display: flex;
            justify-content: center;
            .msg:hover {
                color: var(--color-turquoise);
            }
        }
        .banner {
            height: 108px;
            width: 360px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-position: center; 
            background-repeat: no-repeat;
        }
        .msg {
            color: var(--color-white);
            font-size: 45px;
        }
        .tourism {
            background-image: url("/images/tourism.png");
        }
        .market {
            background-image: url("/images/market.png");
        }
        .news {
            background-image: url("/images/news.png");
        }
        margin-bottom: 64px;
    }
    .latest-content {
        .title {
            display: flex;
            justify-content: center;
            div {
                border-bottom: 2px solid var(--color-black);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .items {
            .item {
                display: flex;
                justify-content: center;
                .img-wrapper {
                    max-width: 360px;
                    overflow: hidden;
                }
                .text {
                    max-width: 360px;
                }
                margin-bottom: 8px;
            }
        }
        margin-bottom: 64px;
    }
    .statistics {
        .title {
            display: flex;
            justify-content: center;
            div {
                border-bottom: 2px solid var(--color-black);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .data-wrapper {
            .number {
                margin: 0 auto;
                border-radius: 20px;
                background-color: var(--color-blue);
                color: var(--color-white);
                font-size: 30px;
                height: 170px;
                width: 170px;
                align-items: center;
            }
            .number-title {
                font-size: 30px;
                text-align: center;
            }
        }
        margin-bottom: 64px;
    }
    .suggestions {
        .title {
            display: flex;
            justify-content: center;
            div {
                border-bottom: 2px solid var(--color-black);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .suggestion-title {
            font-size: 30px;
            margin-bottom: 16px;
        }
        .suggestion-text {
            margin-bottom: 16px;
        }
    }
}
</style>