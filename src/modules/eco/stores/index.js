
import axios from 'axios';
import { http } from '@/util/apiClient';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
const env = import.meta.env.VITE_APP_ENV;

export const useIndexStore = defineStore('index', {
    state: () => ({
        loading: false,
        appIsOpen: env == 'local' ? true : false,
        selectedApp: localStorage.getItem("selectedApp") ? localStorage.getItem("selectedApp") : "exportinfo"
    }),
    getters: {
        isLoading(state){
            return !!state.loading;
        },
        getSelectedApp(state){
            return state.app;
        }
    },
    actions: {
        setLoading(loading = true){
            this.loading = loading;
        },
        openApp(status = true){
            this.appIsOpen = status;
        },
        setSelectedApp(app){
            this.selectedApp = app;
            localStorage.setItem("selectedApp", app);
        },

    }
});
