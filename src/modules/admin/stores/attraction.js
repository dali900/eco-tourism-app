
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useAttractionStore = defineStore('attraction', {
    state: () => ({
        category: null,
        categories: null,
        categoriesTotal: null,
        attraction: null,
        attractions: null,
        attractionsTotal: null,
        attractionRootCategory: null,
        attractionSubcategories: null,
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
        async getAttractionCategories(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/attraction-types', urlParams);
                this.categories = response.data.data.regulation_types.results;
                this.categoriesTotal = response.data.data.regulation_types.pagination.total;
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
                const response = await http.get('/api/'+this.selectedApp+'/attraction-types/roots', urlParams);
                this.attractionRootCategory = response.data.data.regulation_root_types;
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
                const response = await http.get('/api/'+this.selectedApp+'/attraction-types/tree', urlParams);
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
                const response = await http.get('/api/'+this.selectedApp+'/attraction-types', urlParams);
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
            this.attraction = null;
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/'+this.selectedApp+'/attractions', urlParams);
                this.attractions = response.data.data.attractions.results;
                this.attractionsTotal = response.data.data.attractions.pagination.total;
                this.attractionSubcategories = response.data.data.subtypes;
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
        //fetch resource. Different resource form attractions. Needs to be fetched again if not selected
        async getRegulation(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/'+this.selectedApp+'/attractions/'+id);
                this.attraction = response.data.data.attraction;
                indexStore.setLoading(false);
                return this.attraction; 
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
                const response = await http.post('/api/'+this.selectedApp+'/attractions', data);
                const attraction = response.data.data.attraction;
                //attractions are not loaded when attraction form is opened directly
                if(this.attractions && this.attractions.length){
                    //adds the object data to the beginning of the array
                    this.attractions.unshift(attraction);
                }
                //set selected resource
                this.attraction = attraction;
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
                const response = await http.put('/api/'+this.selectedApp+'/attractions/'+data.id, data);
                const attraction = response.data.data.attraction;
                if(this.attractions && this.attractions.length){
                    //replace the existing resource
                    const regulationIndex = this.attractions.findIndex( el => el.id == data.id);
                    this.attractions[regulationIndex] = attraction;
                }
                //if selected attraction in form, update it
                if(this.attraction){
                    this.attraction = attraction;
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
                const response = await http.delete('/api/'+this.selectedApp+'/attractions/'+id);
                this.attractions = this.attractions.filter(el => el.id != id); 
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
        //create new category
        async createType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/attraction-types', data);
                const category = response.data.data.regulation_type;
                //adds the object data to the beginning of the array
                this.categories.unshift(category);
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
        //update category
        async updateType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/attraction-types/'+data.id, data);
                const category = response.data.data.regulation_type;
                //replace the existing resource
                const regulationIndex = this.categories.findIndex( el => el.id == data.id);
                this.categories[regulationIndex] = category;
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
        //delete category
        async deleteType(id, params){
            const urlParams = parseFilterParams(params);
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/attraction-types/'+id, urlParams);
                this.categories = response.data.data.regulation_types.results;
                this.categoriesTotal = response.data.data.regulation_types.pagination.total;
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
                const response = await http.delete('/api/'+this.selectedApp+'/attractions/file/'+id);
                const attraction = response.data.data.attraction;
                //delete file path from store
                if(this.attractions && this.attractions.length){
                    const regulationIndex = this.attractions.findIndex( el => el.id == id);
                    this.attractions[regulationIndex].file_path = null;
                }
                //update resource
                if(this.attraction){
                    this.attraction = attraction;
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
                const response = await http.delete('/api/'+this.selectedApp+'/attractions/preview-file/'+id);
                const attraction = response.data.data.attraction;
                //delete file path from store
                if(this.attractions && this.attractions.length){
                    const regulationIndex = this.attractions.findIndex( el => el.id == id);
                    this.attractions[regulationIndex].preview_file_path = null;
                }
                //update resource
                if(this.attraction){
                    this.attraction = attraction;
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
                await downloadFile('/api/'+this.selectedApp+'/attractions/download-file/'+id);
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
