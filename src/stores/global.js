
import axios from 'axios';
import { http } from '@/util/apiClient';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getAppNameFromUrl } from '@/util/general'
const env = import.meta.env.VITE_APP_ENV;

export const useGlobalStore = defineStore('global', {
    state: () => ({
        loading: false,
        latestConent: null,
        suggestedAttractions: null,
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
                return response.data.data;
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
                this.latestConent = response.data.attractions;
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
    }
});
