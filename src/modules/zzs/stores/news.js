
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
import { useGlobalStore } from '@/stores/global'
const env = import.meta.env.VITE_APP_ENV;

export const useNewsStore = defineStore('news', {
    state: () => ({news: [], one_news: null, newsTotal: 0}),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        },
        appName(){
            return useGlobalStore().appName;
        }
    },
    actions: {
        async getNews(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get(`/api/${this.appName}/news`, urlParams);
                this.news = response.data.data.news.results;
                this.newsTotal = response.data.data.news.pagination.total;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                console.log(error);
                indexStore.setLoading(false);
                throw error;
            }
        },
        async getOneNews(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/'+indexStore.app+'/news/'+id);
                this.one_news = response.data.data.news;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                indexStore.setLoading(false);
                throw error;
            }
        },
    }
});
