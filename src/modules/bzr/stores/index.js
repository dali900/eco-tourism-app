
import axios from 'axios';
import { http } from '@/util/apiClient';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
const env = import.meta.env.VITE_APP_ENV;

export const useIndexStore = defineStore('index', {
    state: () => ({
        loading: false,
        appIsOpen: env == 'local' ? true : false,
        newAppVersion: null,
        loadedAppVersion: null,
        app: "bzr"
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
        async getAppVersion(){
            try {
                if(env !== 'local2'){           
                    const response = await axios.get('/version.json');
                    this.loadedAppVersion = response.data.app;
                    return response.data;
                }
                return null;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                throw error;
            }
        },
        async trackAppVersion(){
            try {
                if(env !== 'local2'){           
                    const response = await axios.get('/version.json');
                    this.newAppVersion = response.data.app;
                    return response.data;
                }
                return null;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                throw error;
            }
        }
    }
});
