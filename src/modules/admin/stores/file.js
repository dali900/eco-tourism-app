
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore } from 'pinia'
const env = import.meta.env.VITE_APP_ENV;

export const useFileStore = defineStore('file', {
    state: () => ({
        loading: false
    }),
    actions: {
        //delete file
        async delete(filePath){
            this.loading = true;
            try {            
                const response = await http.post('/api/files/delete', {file_path: filePath});
                this.loading = false;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                this.loading = false;
                throw error;
            }
        },
        //delete temp file
        async deleteTmpFile(filePath){
            this.loading = true;
            try {            
                const response = await http.post('/api/files/delete-tmp-file', {file_path: filePath});
                this.loading = false;
                return response.data;
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
