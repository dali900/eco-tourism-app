<template>
    <div class="home">

        <!-- Header imag -->
        <div class="header">
            <img src="/images/app-logo3.png">
            <div class="msg">{{ t('home.headerMsg') }}</div>
            <div class="small-msg">{{ t('home.headerSmallMsg') }}</div>
        </div>

        <div class="page-body">
            <!-- Banners -->
            <div class="banners grid">
                <router-link to="/eco-categories" class="col-12 md:col-6 lg:col-4 banner-link">
                    <div class="banner tourism">
                        <div class="msg">{{ t('home.tourism') }}</div>
                    </div>
                </router-link>
                <router-link to="/ads" class="col-12 md:col-6 lg:col-4 banner-link">
                    <div class="banner ad">
                        <div class="msg">{{ t('home.ad') }}</div>
                    </div>
                </router-link>
                <router-link to="/news" class="col-12 md:col-6 lg:col-4 banner-link">
                    <div class="banner news">
                        <div class="msg">{{ t('home.news') }}</div>
                    </div>
                </router-link>
            </div>
    
            <!-- Latest content -->
            <div class="latest-content" v-if="attractions || news">
                <div class="title">
                    <div>
                        {{ t('home.latestContentTitle') }}
                    </div>
                </div>
                <div class="items grid">
                    <div class="col-12 md:col-6 lg:col-4 flex-justify-center" v-for="(item, key) in attractions">
                        <div class="item first-row">
                            <router-link :to="{name:'attraction', params:{id:item.id}}" class="text-link">
                                <AppCard>
                                    <template #image>
                                        <img v-if="item.thumbnail" alt="content-img" :src="apiBaseUrl+item.thumbnail.file_url">
                                        <img v-else alt="content-img" src="/images/thumbnails/attraction.jpg" >
                                    </template>
                                    <template #title>
                                        {{ item.t.name }}
                                    </template>
                                    <template #content>
                                        <div class="latest-content-card-content-attraction">
                                            {{ item.t.summary }}
                                        </div>
                                    </template>
                                </AppCard>
                            </router-link>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-4 flex-justify-center" v-for="(item, key) in news">
                        <div class="item">
                            <router-link :to="{name:'news-overview', params:{id:item.id}}" class="text-link">
                                <AppCard>
                                    <template #image>
                                        <img v-if="item.thumbnail" alt="content-img" :src="apiBaseUrl+item.thumbnail.file_url">
                                        <img v-else alt="content-img" src="/images/thumbnails/news-thumb.png" >
                                    </template>
                                    <template #title>
                                        {{ item.title }}
                                    </template>
                                    <template #content>
                                        <div class="latest-content-card-content-news">
                                            <div class="small-section">
                                                <span v-if="item.publish_date_formated">
                                                    <i class="pi pi-clock"></i> 
                                                    {{ item.publish_date_formated }}
                                                </span>
                                            </div>
                                            <div>
                                                {{ item.summary }}
                                            </div>
                                        </div>
                                    </template>
                                </AppCard>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics -->
            <div class="statistics" :class="{hidden: loading}">
                <div class="title flex-justify-center">
                    <div>
                        {{ t('home.statisticsTitle') }}
                    </div>
                </div>
                <div class="data-points grid">
                    <div class="col-12 md:col-6 lg:col-4 flex-justify-center">
                        <div class="data-wrapper">
                            <div class="number flex-justify-center">
                                <div class=""><span :key="currentCountA">{{ currentCountA }}</span></div>
                            </div>
                            <div class="number-title">{{ t('home.attractions') }}</div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-4 flex-justify-center">
                        <div class="data-wrapper">
                            <div class="number flex-justify-center">
                                <div class=""><span :key="currentCountB">{{ currentCountB }}</span></div>
                            </div>
                            <div class="number-title">{{ t('home.newsStatistics') }}</div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-4 flex-justify-center">
                        <div class="data-wrapper">
                            <div class="number flex-justify-center">
                                <div class=""><span :key="currentCountC">{{ currentCountC }}</span></div>
                            </div>
                            <div class="number-title">{{ t('home.places') }}</div>
                        </div>
                    </div>
                </div>
            </div>
    
            <!-- Suggestions -->
            <div class="suggestions" v-if="suggestedAttractions && suggestedAttractions.length">
                <div class="title flex-justify-center">
                    <div>
                        {{ t('home.suggestionTitle') }}
                    </div>
                </div>
                <div class="list">
                    <div class="grid" v-if="suggestedAttractions[0]">
                        <div class="col-12 md:col-6 lg:col-6 left-column">
                            <div class="suggestion-img-wrapper" v-if="suggestedAttractions[0].thumbnail">
                                <img class="header-img" :src="apiBaseUrl+suggestedAttractions[0].thumbnail.file_url">
                                <img class="header-img-shadow" :src="apiBaseUrl+suggestedAttractions[0].thumbnail.file_url">
                            </div>
                            <div class="suggestion-img-wrapper" v-else>
                                <img class="header-img" src="/images/thumbnails/new11.png">
                                <img class="header-img-shadow" src="/images/thumbnails/new11.png">
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-6 right-column right-content">
                            <div class="suggestion-content">
                                <div class="suggestion-title">
                                    {{ suggestedAttractions[0].t.name }}
                                </div>
                                <div class="suggestion-text">
                                    {{ suggestedAttractions[0].t.summary }}
                                </div>
                                <div class="btn right">
                                    <router-link :to="{ name: 'attraction', params: {id: suggestedAttractions[0].id} }">
                                        <Button class="btn-d">{{t('common.more')}}</Button>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid" v-if="suggestedAttractions[1]">
                        <div class="col-12 md:col-6 lg:col-6 left-column move-right left-content">
                            <div class="suggestion-content">
                                <div class="suggestion-title">
                                    {{ suggestedAttractions[1].t.name }}
                                </div>
                                <div class="suggestion-text">
                                    {{ suggestedAttractions[1].t.summary }}
                                </div>
                                <div class="btn">
                                    <router-link :to="{ name: 'attraction', params: {id: suggestedAttractions[1].id} }">
                                        <Button class="btn-d">{{t('common.more')}}</Button>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-6 right-column">
                            <div class="suggestion-img-wrapper" v-if="suggestedAttractions[1].thumbnail">
                                <img class="header-img" :src="apiBaseUrl+suggestedAttractions[1].thumbnail.file_url">
                                <img class="header-img-shadow" :src="apiBaseUrl+suggestedAttractions[1].thumbnail.file_url">
                            </div>
                            <div class="suggestion-img-wrapper" v-else>
                                <img class="header-img" src="/images/thumbnails/new11.png">
                                <img class="header-img-shadow" src="/images/thumbnails/new11.png">
                            </div>
                        </div>
                    </div>
                    <div class="grid" v-if="suggestedAttractions[2]">
                        <div class="col-12 md:col-6 lg:col-6 left-column">
                            <div class="suggestion-img-wrapper" v-if="suggestedAttractions[2].thumbnail">
                                <img class="header-img" :src="apiBaseUrl+suggestedAttractions[2].thumbnail.file_url">
                                <img class="header-img-shadow" :src="apiBaseUrl+suggestedAttractions[2].thumbnail.file_url">
                            </div>
                            <div class="suggestion-img-wrapper" v-else>
                                <img class="header-img" src="/images/thumbnails/new11.png">
                                <img class="header-img-shadow" src="/images/thumbnails/new11.png">
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-6 right-column right-content">
                            <div class="suggestion-content">
                                <div class="suggestion-title">
                                    {{ suggestedAttractions[2].t.name }}
                                </div>
                                <div class="suggestion-text">
                                    {{ suggestedAttractions[2].t.summary }}
                                </div>
                                <div class="btn right">
                                    <router-link :to="{ name: 'attraction', params: {id: suggestedAttractions[2].id} }">
                                        <Button class="btn-d">{{t('common.more')}}</Button>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Friends and partners -->
            <div class="partners">
                <div class="title flex-justify-center">
                    <div>
                        {{ t('home.partnersTitle') }}
                    </div>
                </div>
                <div class="list">
                    <div class="grid flex-justify-center partner-row">
                        <div class="col-12 md:col-6 lg:col-2">
                            <div class="partner">
                                {{ t('home.partnersList.p1') }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-2">
                            <div class="partner">
                                {{ t('home.partnersList.p2') }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-2">
                            <div class="partner">
                                {{ t('home.partnersList.p3') }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-2">
                            <div class="partner">
                                {{ t('home.partnersList.p4') }}
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-2">
                            <div class="partner">
                                {{ t('home.partnersList.p5') }}
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
import { ref, unref, reactive, computed, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import AppButton from "@/components/Button/Button.vue"
import { useAttractionStore } from '@/stores/attraction'
import { useGlobalStore } from '@/stores/global'
import { FilterMatchMode } from 'primevue/api';
import AppCard from '@/components/appCard/AppCard.vue';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const perPage = ref(20);
const sort = ref({
    sortField: "id",
    sortOrder: -1,
});
const pagination = ref({
    page: 1,
    perPage: perPage.value,
});

const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'name': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'content': {value: null, matchMode: FilterMatchMode.CONTAINS},
    'approved': {value: null, matchMode: FilterMatchMode.EQUALS}
});

const attractionStore = useAttractionStore();
/* attractionStore.getAttractions({sort: sort.value, pagination: pagination.value, filters: filters.value});
const { attractions, attractionsTotal, loading } = storeToRefs(attractionStore); */

const globalStore = useGlobalStore();

const { attractions, news, counts, suggestedAttractions, loading } = storeToRefs(globalStore);

const { t, locale } = useI18n();

const countingA = ref(false);
const countingB = ref(false);
const countingC = ref(false);
const targetCountA = ref(0);
const targetCountB = ref(0);
const targetCountC = ref(0);
const currentCountA = ref(0);
const currentCountB = ref(0);
const currentCountC = ref(0);

onBeforeMount(() => {
    globalStore.getHomePageData()
        .then(responseData => {
            if (responseData.counts) {
                targetCountA.value = responseData.counts.attractions;
                targetCountB.value = responseData.counts.news;
                targetCountC.value = responseData.counts.places;
            }
        })
});
onMounted(() => {
  observeVisibility();
});

watch(locale, (newVal) => {
    globalStore.getHomePageData();
})

const startCounting = () => {
    countingA.value = true;
    countingB.value = true;
    countingC.value = true;
    let duration = 1000;
    let intervalA = duration / targetCountA.value;
    let intervalB = duration / targetCountB.value;
    let intervalC = duration / targetCountC.value;

    let timerA = setInterval(() => {
        /* if ( (currentCountA.value + 5) < targetCountA.value ) {
            currentCountA.value += 5;
        } else {
            currentCountA.value++;
        } */
        currentCountA.value++;
        if (currentCountA.value >= targetCountA.value) {
            clearInterval(timerA);
            countingA.value = false;
        }
    }, intervalA);

    let timerB = setInterval(() => {
        /* if ( (currentCountB.value + 5) < targetCountB.value ) {
            currentCountB.value += 5;
        } else {
            currentCountB.value++;
        } */
        currentCountB.value++;
        if (currentCountB.value >= targetCountB.value) {
            clearInterval(timerB);
            countingB.value = false;
        }
    }, intervalB);

    let timerC = setInterval(() => {
        /* if ( (currentCountC.value + 5) < targetCountC.value ) {
            currentCountC.value += 5;
        } else {
            currentCountC.value++;
        } */
        currentCountC.value++;
        if (currentCountC.value >= targetCountC.value) {
            clearInterval(timerC);
            countingC.value = false;
        }
    }, intervalC);
};

const observeVisibility = () => {
    const options = {
      threshold: 0.8
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        startCounting(); // Start counting when the element is 50% visible
        observer.disconnect(); // Disconnect observer after the animation starts
      }
    }, options);

    observer.observe(document.querySelector('.statistics')); // Adjust selector as needed
};

</script>

<style scoped>
.home {
    .header {
        position: relative;
        max-width: var(--container-width);
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
            height: 150px;
            width: 150px;
            align-self: center;
        }
        .msg {
            font-size: 40px;
            text-align: center;
            text-transform: uppercase;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        }
        .small-msg {
            font-size: 14px;
            text-align: center;
            text-transform: uppercase;
        }
        padding-top: 16px;
        margin-bottom: 64px;
    }
    .separator {
        background-color: var(--color-white);
        height: 14px;
        width: 100%;
    }
    .page-body {
        padding: 0 16px;
    }
    @media screen and (min-width: 992px) {
        .page-body {
            padding: 0 64px;
        }
    }
    .title {
        font-size: 40px;
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
            .msg {
                text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
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
            transition: 0.1s linear;
            box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
            &:hover {
                transform: scale(1.1);
                box-shadow: 1px 8px 19px -2px rgba(0,0,0,0.75);
            }
        }
        .msg {
            color: var(--color-white);
            font-size: 40px;
        }
        .tourism {
            background-image: url("/images/tourism.png");
        }
        .ad {
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
                border-bottom: 1px solid var(--text-secondary-color);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .items {
            .first-row {
                margin-bottom: 32px;
            }
            .flex-item {

            }
            .item {
                .latest-content-card-content-news {
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                }
                .latest-content-card-content-attraction {
                    display: -webkit-box;
                    -webkit-line-clamp: 6;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                }
                .small-section {
                    color: var(--text-light-color) !important;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                /** Moze da se brise, premesteno u AppCard */
                /* display: flex;
                justify-content: center;
                padding-bottom: 8px;
                height: 400px;
                width: 360px;
                -webkit-box-shadow: 1px 8px 19px -12px rgba(0,0,0,0.75);
                -moz-box-shadow: 1px 8px 19px -12px rgba(0,0,0,0.75);
                box-shadow: 1px 8px 19px -12px rgba(0,0,0,0.75);
                box-sizing: border-box;
                border-radius: 31px;
                overflow: hidden;
                transition: 0.1s linear;
                &:hover {
                    box-shadow: 1px 5px 19px -3px rgba(15, 49, 53, 0.75);
                }
                a {
                    text-decoration: none;
                    color: inherit;
                }
                .img-wrapper {
                    height: 200px;
                    overflow: hidden;
                    img {
                        max-width: 360px;
                        height: auto;
                    }
                }
                .item-card-body {
                    padding: 8px;
                    .item-title {
                        font-size: var(--font-size-content);
                        font-weight: 600;
                        margin-top: 4px;
                        margin-bottom: 8px;
                    }
                    .text {
                        max-width: 360px;
                        display: -webkit-box;
                        -webkit-line-clamp: 8;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }*/
            }
        }
        margin-bottom: 64px;
    }
    .statistics {
        .title {
            display: flex;
            justify-content: center;
            div {
                border-bottom: 1px solid var(--text-secondary-color);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .data-wrapper {
            .number {
                margin: 0 auto;
                border-radius: 15px;
                background-color: var(--color-blue);
                color: var(--color-white);
                font-size: 30px;
                height: 170px;
                width: 170px;
                align-items: center;
            }
            .number-title {
                margin-top: 32px;
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
                border-bottom: 1px solid var(--text-secondary-color);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .list {
            .grid {
               margin-bottom: 64px; 
            }
            .suggestion-img-wrapper {
                text-align: center;
                width: 440px;
                height: 330px;
                /* width: 360px;
                height: 270px; */
                /* border-radius: 31px;
                overflow: hidden; */
                position: relative;
                
                img {
                   /*  margin: -60px 0 0px -5px; */
                   border-radius: 31px;
                   max-height: 330px;
                }
                .header-img {
                    position: absolute;
                    right: 0px;
                    bottom: 0px;
                    z-index: 1;
                }
                .header-img-shadow {
                    position: absolute;
                    right: -9px;
                    bottom: -9px;
                    filter: blur(11px);
                    border-radius: 31px;
                }
            }
            .left-column {
                display: flex;
                justify-content: right;               
            }
            .right-column {
                display: flex;
                justify-content: left;
                padding-left: 16px;
            }
            .right-content {
                padding-left: 50px;
            }
            .left-content {
                padding-right: 50px;
            }
            @media screen and (max-width: 768px) {
                .left-column {
                    justify-content: center;
                }
                .right-column {
                    justify-content: center;
                    padding-left: 0;
                }
                .move-right {
                    order: 1;
                }
            }
            .suggestion-content {
                max-width: 400px;
                .suggestion-title {
                    font-size: 30px;
                    margin-bottom: 16px;
                }
                .suggestion-text {
                    text-align: justify;
                    margin-bottom: 16px;
                }
                .btn.right {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
        margin-bottom: 64px;
    }
    .partners {
        .title {
            display: flex;
            justify-content: center;
            div {
                border-bottom: 1px solid var(--text-secondary-color);
                padding: 16px;
            }
            margin-bottom: 64px;
        }
        .partner-row {
            margin-bottom: 16px
        }
        .partner {
            font-size: 20px;
            background-color: var(--color-blue);
            color: var(--color-white);
            padding: 24px;
            text-align: center;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        margin-bottom: 64px;
    }
    .hidden {
        visibility: hidden;
    }
}

</style>