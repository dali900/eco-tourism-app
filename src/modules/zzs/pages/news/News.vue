<script setup>
    import { ref, computed, onBeforeMount } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useNewsStore } from '../../stores/news'
    import { useBannerStore } from '../../stores/banner'
    import { useAuthStore } from '@/stores/auth'
    import { useAppTracking } from '@/util/appTracking'
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
    const bannersSort = ref({
        sortField: "position"
    });

    newsStore.getNews({sort: sort.value});
    const bannerStore = useBannerStore();
    const { banners } = storeToRefs(bannerStore);

    onBeforeMount( () => {
        appTracking.mixpanelTrack('News visited');
    });

    bannerStore.getAllBanners({sort: bannersSort.value});

</script>

<template>
    <div class="user-news pt-0">
        <div class="header-baner">
            <CardBanners :banners="banners" :user="user"></CardBanners>
        </div>
        <div class="flex justify-content-center news-title">
            <img class="mr-3 align-self-center" src="/images/zzs_green_logo.svg">
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
                                            '/images/banners/ZZS_baner_VESTI.png'
                                        "
                                    />
                                    <div class="news-date">
                                        <div class="news-day">{{ n.publish_date_day_display }}</div>
                                        <div class="news-month-year">{{ n.publish_date_month_display }} {{ n.publish_date_year_display }}</div>
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
    font-family: Inter;
    width: 100%;
    min-height: calc(100vh - 300px);
    .header-baner {
        width: 100%;
        position: relative;
        background-image: url(/images/banners/ZZS_header_baner_01.png);
        background-size: cover;
        background-position: center; /* Center the image */
        background-repeat: no-repeat; /* Do not repeat the image */
        min-height: 390px;
        display: flex;
    }
    .news-cards {
        max-width: 1318px;
        margin: 0 auto;
    }
    .card-wrap {
        .card {
            display: flex;
            width: 305px;
            height: 449px;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
            flex-shrink: 0;
            border-radius: 8px;
            background: var(--gray-scale-white, #FFF);
            box-shadow: 0px 10px 80px 0px rgba(0, 0, 0, 0.20);
            .news-content {
               height: 100%; 
            }
            .news-card-body {
                padding-left: 18px;
                padding-right: 18px;
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
    :deep(.p-card-body) {
        width: 100%
    }
    .news-card-title p {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        font-size: 1.2rem;
        font-weight: bold;
    }
    .news-card-content p {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        font-size: 0.9rem;
        padding-top: 18px;
    }
    .p-dataview {
        height: auto;
    }
    .p-dataview-content {
        height: auto;
    }
    :deep(.p-grid) {
        background-color: var(--color-zzs-body-background);
        background-color: var(--color-zzs-body-background) !important;
    }
    :deep(.p-card) {
        background-color: var(--color-zzs-card-background-primary);
        color: var(--color-zzs-card-text-primary);
    }
    .p-card:hover {
        background-color: var(--color-zzs-card-hover-background-primary);
        color: var(--color-zzs-card-hover-color-primary);
    }
    .p-card-header img, .news-header {
        position: relative;
        display: flex;
        width: 305px;
        height: 206px;
        padding: 18px;
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
        flex-shrink: 0;
        img {
            width: 270px;
            height: 172.721px;
            flex-shrink: 0;
            border-radius: 4px;
        }
        .news-date {
            .news-day {
                color: #FFF;
                text-align: center;
                font-family: Inter;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
            }
            .news-month-year {
                color: #FFFDFD;
                text-align: center;
                font-family: Inter;
                font-size: 13px;
                font-style: normal;
                font-weight: 500;
                line-height: 100%; /* 13px */
                letter-spacing: 0.39px;
                text-transform: uppercase;
            }
            position: absolute;
            right: 17px;
            top: 18px;
            display: flex;
            width: 79px;
            height: 48px;
            padding: 5px 9px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            opacity: 0.9;
            background: var(--color-zzs-navbar-background-primary);
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
        margin-top: 40px;
        margin-bottom: 40px;
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