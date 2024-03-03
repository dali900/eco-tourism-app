<script setup>
    import {onBeforeMount} from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useNewsStore } from '../../stores/news'
    const router = useRouter();
    const route = useRoute();
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    const newsStore = useNewsStore();
    const { one_news } = storeToRefs(newsStore);

    onBeforeMount( () => {
        if(route.params.newsId){
            newsStore.getOneNews(route.params.newsId);
        }
    });
</script>

<template>
    <div class="user-news">
        <div class="row" v-if="one_news">
            <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 pull-right">
                <div class="full">
                    <div class="blog_section margin_bottom_0">
                        <div class="blog_feature_img">
                            <img alt="news" :src="
                                one_news.image ? 
                                    baseUrl + one_news.image.file_url :
                                    '/images/banners/BZR_baner1_VESTI.png'
                                "
                            />
                        </div>
                        <div class="blog_feature_cantant">
                            <p class="blog-title">{{one_news.title}}</p>
                            <p class="blog-subtitle">{{one_news.subtitle}}</p>
                            <p class="blog-date">{{one_news.publish_date}}</p>
                            <p class="blog-content" v-html="one_news.text"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-left">
                <div>
                    <div class="blog-summary-title">Sažetak</div>
                    <p class="blog-summary" v-html="one_news.summary"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.user-news {
    width: 100%;
    min-height: calc(100vh - 300px);
    .card-wrap {
        max-width: 500px;
        .card {
            width: auto;
            height: 100%;
        }
    }
    .p-card-title {
        cursor: pointer;
    }
    .row {
        display: flex;
    }
    .pull-right {
        width: 70%;
        position: relative;
        min-height: 1px;
        padding-top: 15px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .pull-left {
        width: 30%;
        padding-right: 15px;
        padding-top: 15px;
    }
    .blog_feature_img {
        width: 100%;
        max-width: 100%;
        text-align: center;
        img {
            max-width: 600px;
            height: auto;
        }
    }
    .blog_section p {
        line-height: 24px;
        float: left;
        width: 100%;
    }
    .blog_feature_cantant {
        padding: 30px;
        float: left;
        width: 100%;
        p {
            line-height: 24px;
            float: left;
            width: 100%;
        }
        .blog-title {
            text-align: center;
            font-size: 18px;
            color: black;
            font-weight: 600;
            width: 100%;
        }
        .blog-subtitle {
            text-align: center;
            font-size: 16px;
            color: black;
            font-weight: 400;
            padding-top: 20px;
            width: 100%;
        }
        .blog-date {
            font-size: 16px;
            color: black;
            font-weight: 600;
            padding-top: 20px;
            padding-bottom: 20px;
        }
        .blog-content {
            padding-top: 15px;
            width: 100%;
        }
    }
    .blog-summary-title {
        font-size: 14px;
        color: black;
        font-weight: 600;
    }
    .blog-summary {
        width: 100%;
        padding-top: 15px;
    }
}
</style>