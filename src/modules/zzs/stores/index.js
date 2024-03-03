
import axios from 'axios';
import { http } from '@/util/apiClient';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getAppNameFromUrl } from '../../../util/general'
const env = import.meta.env.VITE_APP_ENV;

export const useIndexStore = defineStore('index', {
    state: () => ({
        loading: false,
        appIsOpen: env == 'local' ? true : false,
        app: getAppNameFromUrl(),
    }),
    getters: {
        isLoading(state){
            return !!state.loading;
        }
    },
    actions: {
        setLoading(loading = true){
            this.loading = loading;
        },
        openApp(status = true){
            this.appIsOpen = status;
        },

    }
});
