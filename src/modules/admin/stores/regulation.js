
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
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
        regulationSubtypes: null,
        tree: null,
        treeCount: null
    }),
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
        //get filtered and paginated resources
        async getRegulationTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/regulation-types', urlParams);
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
        async getRegulationTypeTree(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/regulation-types/tree', urlParams);
                this.tree = response.data.data.tree;
                this.treeCount = response.data.data.count;
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
        async getFilterRegulationRootTypes(params){
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/regulation-types', urlParams);
                return response.data.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
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
                const response = await http.get('/api/'+this.selectedApp+'/regulations', urlParams);
                this.regulations = response.data.data.regulations.results;
                this.regulationsTotal = response.data.data.regulations.pagination.total;
                this.regulationSubtypes = response.data.data.subtypes;
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
                const response = await http.get('/api/'+this.selectedApp+'/regulations/'+id);
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
        //create new resource
        async create(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/regulations', data);
                const regulation = response.data.data.regulation;
                //regulations are not loaded when regulation form is opened directly
                if(this.regulations && this.regulations.length){
                    //adds the object data to the beginning of the array
                    this.regulations.unshift(regulation);
                }
                //set selected resource
                this.regulation = regulation;
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
        //update response
        async update(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/regulations/'+data.id, data);
                const regulation = response.data.data.regulation;
                if(this.regulations && this.regulations.length){
                    //replace the existing resource
                    const regulationIndex = this.regulations.findIndex( el => el.id == data.id);
                    this.regulations[regulationIndex] = regulation;
                }
                //if selected regulation in form, update it
                if(this.regulation){
                    this.regulation = regulation;
                }
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
        //delete response
        async delete(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/regulations/'+id);
                this.regulations = this.regulations.filter(el => el.id != id); 
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
        //create new regulationType
        async createType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/regulation-types', data);
                const regulationType = response.data.data.regulation_type;
                //adds the object data to the beginning of the array
                this.regulationTypes.unshift(regulationType);
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
        //update regulationType
        async updateType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/regulation-types/'+data.id, data);
                const regulationType = response.data.data.regulation_type;
                //replace the existing resource
                const regulationIndex = this.regulationTypes.findIndex( el => el.id == data.id);
                this.regulationTypes[regulationIndex] = regulationType;
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
        //delete regulationType
        async deleteType(id, params){
            const urlParams = parseFilterParams(params);
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/regulation-types/'+id, urlParams);
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
        //delete file
        async deleteFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/regulations/file/'+id);
                const regulation = response.data.data.regulation;
                //delete file path from store
                if(this.regulations && this.regulations.length){
                    const regulationIndex = this.regulations.findIndex( el => el.id == id);
                    this.regulations[regulationIndex].file_path = null;
                }
                //update resource
                if(this.regulation){
                    this.regulation = regulation;
                }
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
        //delete preview file
        async deletePreviewFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try { 
                const response = await http.delete('/api/'+this.selectedApp+'/regulations/preview-file/'+id);
                const regulation = response.data.data.regulation;
                //delete file path from store
                if(this.regulations && this.regulations.length){
                    const regulationIndex = this.regulations.findIndex( el => el.id == id);
                    this.regulations[regulationIndex].preview_file_path = null;
                }
                //update resource
                if(this.regulation){
                    this.regulation = regulation;
                }
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
        //delete file
        async downloadFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                await downloadFile('/api/'+this.selectedApp+'/regulations/download-file/'+id);
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
