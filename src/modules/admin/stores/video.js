
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
        },
        selectedApp(state){
            const indexStore = useIndexStore();
            return indexStore.selectedApp;
        },
    },
    actions: {
        async getVideos(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/videos', urlParams);
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
                const response = await http.get('/api/'+this.selectedApp+'/videos/'+id);
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
        //create new video
        async create(data, errorFields){
            const indexStore = useIndexStore(); 
            indexStore.setLoading();
            try {
                const response = await http.post('/api/'+this.selectedApp+'/videos', data);
                const video = response.data.data.video;
                //adds the object data to the beginning of the array
                this.videos.unshift(video);
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                indexStore.setLoading(false);
                throw error;
            }
        },
        //update video
        async update(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/videos/'+data.id, data);
                const video = response.data.data.video;
                //replace the existing resource
                const videoIndex = this.videos.findIndex( el => el.id == data.id);
                this.videos[videoIndex] = video;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                indexStore.setLoading(false);
                throw error;
            }
        },
        //delete video
        async delete(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/videos/'+id);
                this.video = this.videos.filter(el => el.id != id); 
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
                await downloadFile('/api/'+this.selectedApp+'/videos/download-file/'+id);
                indexStore.setLoading(false);
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                indexStore.setLoading(false);
                throw error;
            }
        },
        setUploadLoading(loading = true){
            this.uploadLoading = loading;
        }
    }
});
