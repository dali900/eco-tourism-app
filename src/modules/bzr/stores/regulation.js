
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '../../../util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
import { getAppNameFromUrl } from '@/util/general'
const env = import.meta.env.VITE_APP_ENV;

export const useRegulationStore = defineStore('regulation', {
    state: () => ({
        regulationType: null,
        regulationTypes: null,
        regulationTypesTotal: null,
        regulation: null,
        regulations: null,
        regulationsTotal: null,
        regulationRootTypes: null,
    }),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        },
        selectedApp(state){
            return getAppNameFromUrl();
        },
    },
    actions: {
        //get filtered and paginated resources
        async getRegulationTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/bzr/regulation-types', urlParams);
                this.regulationTypes = response.data.data.regulation_types.results;
                this.regulationTypesTotal = response.data.data.regulation_types.pagination.total;
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
        async getRegulationRootTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/regulation-types/roots', urlParams);
                this.regulationRootTypes = response.data.data.regulation_root_types;
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
        //get filtered and paginated resources
        async getRegulations(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            this.regulation = null;
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/bzr/regulations', urlParams);
                this.regulations = response.data.data.regulations.results;
                this.regulationsTotal = response.data.data.regulations.pagination.total;
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
        //get filtered and paginated resources
        async getRegulationTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/bzr/regulation-types', urlParams);
                this.regulationTypes = response.data.data.regulation_types.results;
                this.regulationTypesTotal = response.data.data.regulation_types.pagination.total;
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
        //fetch resource. Different resource form regulations. Needs to be fetched again if not selected
        async getRegulation(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/bzr/regulations/'+id);
                this.regulation = response.data.data.regulation;
                indexStore.setLoading(false);
                return this.regulation; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                indexStore.setLoading(false);
                throw error;
            }
        },
        //delete file
        async downloadFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                await downloadFile('/api/bzr/regulations/download-file/'+id);
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
