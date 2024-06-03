
import axios from 'axios';
import { http } from '@/util/apiClient';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getAppNameFromUrl } from '@/util/general'
const env = import.meta.env.VITE_APP_ENV;

export const useGlobalStore = defineStore('global', {
    state: () => ({
        loading: false,
        attractions: null,
        news: null,
        counts: null,
        suggestedAttractions: null,
        languages: null
    }),
    getters: {
        appName(){
            return getAppNameFromUrl();
        }
    },
    actions: {
        async getMenuItems(data, formErrors){
            this.loading = true;
            try {
                const response = await http.get('/api/menu');
                this.loading = false;
                return response.data;
            } catch (error) {
                this.loading = false;
                console.log(error);
                const response = error.response;
                throw error;
            }
        },
        async getHomePageData(){
            this.loading = true;
            try {
                const response = await http.get('/api/home-page-data');
                this.attractions = response.data.attractions;
                this.news = response.data.news;
                this.counts = response.data.counts;
                this.suggestedAttractions = response.data.suggested_attractions;
                this.loading = false;
                return response.data;
            } catch (error) {
                this.loading = false;
                console.log(error);
                const response = error.response;
                throw error;
            }
        },
        async getLanguages(){
            if (this.languages) {
                return this.languages;
            }
            this.loading = true;
            try {
                const response = await http.get('/api/languages/');
                this.languages = response.data;
                this.loading = false;
                return this.languages; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                this.loading = false;
                throw error;
            }
        },
    }
});
