
import axios from 'axios';
import { http } from '@/util/apiClient';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getAppNameFromUrl } from '@/util/general'
const env = import.meta.env.VITE_APP_ENV;

export const useGlobalStore = defineStore('global', {
    state: () => ({
        loading: false,
        appIsOpen: env == 'local' ? true : false,
    }),
    getters: {
        isLoading(state){
            return !!state.loading;
        },
        appName(){
            return getAppNameFromUrl();
        }
    },
    actions: {
        setLoading(loading = true){
            this.loading = loading;
        },
        openApp(status = true){
            this.appIsOpen = status;
        },
        async getMenuItems(data, formErrors){
            this.loading = true;
            try {
                const response = await http.get('/api/'+getAppNameFromUrl()+'/menu');
                this.loading = false;
                return response.data.data;
            } catch (error) {
                this.loading = false;
                console.log(error);
                const response = error.response;
                throw error;
            }
        },
    }
});
