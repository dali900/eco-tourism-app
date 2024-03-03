
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useVideoStore = defineStore('video', {
    state: () => ({videos: [], video: null, videosTotal: 0, uploadLoading: false}),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        }
    },
    actions: {
        async getVideos(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/exportinfo/videos', urlParams);
                this.videos = response.data.data.videos.results;
                this.videosTotal = response.data.data.videos.pagination.total;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                console.log(error);
                indexStore.setLoading(false);
                throw error;
            }
        },
        async getVideo(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/exportinfo/videos/'+id);
                this.video = response.data.data.video;
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
        //download video file
        async downloadFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                await downloadFile('/api/exportinfo/videos/download-file/'+id);
                indexStore.setLoading(false);
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
