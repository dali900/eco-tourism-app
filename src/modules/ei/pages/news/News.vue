<script setup>
    import { ref, computed, onBeforeMount } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useNewsStore } from '../../stores/news'
    import { useBannerStore } from '../../stores/banner'
    import { useAuthStore } from '@/stores/auth'
    import { useAppTracking } from '@/util/appTracking'
    import TitleBanner from '@ei/components/TitleBanner.vue'
    import CardBanners from './components/CardBanners.vue'

    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    const appTracking = useAppTracking();
    const newsStore = useNewsStore();
    const autoStore = useAuthStore();
    const { news } = storeToRefs(newsStore);
    const { user } = storeToRefs(autoStore);

    const sort = ref({
        sortField: "created_at",
        sortOrder: -1,
    });

    newsStore.getNews({sort: sort.value});
    const bannerStore = useBannerStore();
    const { banners } = storeToRefs(bannerStore);

    onBeforeMount( () => {
        appTracking.mixpanelTrack('News visited');
    });

    bannerStore.getAllBanners();

</script>

<template>
    <div class="user-news pt-0">
        <div class="header-baner flex justify-content-center">
            <img alt="news" src="/images/banners/EXPORTINFO_header_baner.png"/>
        </div>
        <CardBanners :banners="banners" :user="user"></CardBanners>
        <div class="flex justify-content-center news-title">
            <img class="mr-3 align-self-center" src="/images/exportinfo_red_logo.png">
            <div class="news-title-text">Vesti</div>
        </div>
        <div class="flex flex-wrap justify-content-center news-cards" >
            <div v-for="n in news" style="padding: 0.5em" class="card-wrap">
                <router-link :to="{ name: 'NewsOverview', params: { newsId: n.id, newsTitle: n.url_title }}" class="btn-link">
                    <Card class="card">
                        <template #content>
                            <div class="news-content flex flex-column">
                                <div class="news-header flex justify-content-center">
                                    <img alt="news" :src="
                                        n.image ? 
                                            baseUrl + n.image.file_url :
                                            '/images/banners/EXPORTINFO_baner_VESTI.png'
                                        "
                                    />
                                    <div class="news-date">
                                        {{ n.publish_date_display }}
                                    </div>
                                </div>
                                <div class="news-card-body flex flex-column justify-content-between">
                                    <div class="news-card-title">
                                        <p :title="n.title">{{ n.title }}</p>
                                    </div>
                                    <div class="news-card-content">
                                        <p v-html="n.summary"></p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Card>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.user-news {
    width: 100%;
    min-height: calc(100vh - 300px);
    .header-baner {
        width: 100%;
        max-height: 350px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .news-cards {
        max-width: 1200px;
        margin: 0 auto;
    }
    .card-wrap {
        width: 270px;
        height: 405px;
        .card {
            width: 100%;
            height: 100%;
            .news-content {
               height: 100%; 
            }
            .news-card-body {
                height: 100%;
                padding: 0.5rem;
            }
            .news-card-footer {
                color: var(--text-color-secondary);
            }
            :deep(.p-card-body) {
                padding: 0;
                height: 100%;
                .p-card-content{
                    padding: 0 !important;
                    height: 100%;
                }
            }
        }
    }
    :deep(.p-card .news-card-title) {
        margin-bottom: 0;
    }
    .news-card-title p {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        font-size: 1.2rem;
    }
    .news-card-content p {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        font-size: 0.9rem;
    }
    .p-dataview {
        height: auto;
    }
    .p-dataview-content {
        height: auto;
    }
    :deep(.p-grid) {
        background-color: var(--color-exportinfo-body-background);
        background-color: var(--color-exportinfo-body-background) !important;
    }
    :deep(.p-card) {
        background-color: var(--color-exportinfo-card-background-primary);
        color: var(--color-exportinfo-card-text-primary);
    }
    .p-card:hover {
        background-color: var(--color-exportinfo-card-hover-background-primary);
        color: var(--color-exportinfo-card-hover-color-primary);
    }
    :deep(.p-card-header), .news-header {
        max-height: 163px;
    }
    .p-card-header img, .news-header {
        position: relative;
        img {
            height: 100%;
            max-width: 254px;
            padding: 5px;
        }
        .news-date {
            position: absolute;
            width: 50px;
            height: 31px;
            right: 5px;
            top: 5px;
            background-color: var(--color-exportinfo-navbar-background-primary);
            color: white;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
        }
    }
    .right-side-banners {
        height: 800px;
        a {
            padding-top: 30px;
            padding-right: 80px;
            img {border-radius: 10px;}
        }
    }
    .news-title {
        margin-top: 65px;
        img {
            height: 35px;
        }
        .news-title-text {
            font-size: 30px;
            font-weight: 700;
        }
    }   
}
</style>