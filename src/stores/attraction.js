
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
const env = import.meta.env.VITE_APP_ENV;

export const useAttractionStore = defineStore('attraction', {
    state: () => ({
        loading: false,
        category: null,
        categories: null,
        categoriesTotal: null,
        attraction: null,
        attractions: null,
        attractionsTotal: null,
        attractionRootCategories: null,
        attractionSubcategories: null,
        tree: null,
        treeCount: null
    }),
    getters: {
        /* loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        }, */
    },
    actions: {
        //get filtered and paginated resources
        async getAttractionCategories(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/attraction-categories', urlParams);
                this.categories = response.data.results;
                this.categoriesTotal = response.data.pagination.total;
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
        async getAttractionRootCategories(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/attraction-categories/roots', urlParams);
                this.attractionRootCategories = response.data;
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
        async getAttractionCategoryTree(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/attraction-categories/tree', urlParams);
                this.tree = response.data.tree;
                this.treeCount = response.data.count;
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
        async getFilterAttractionRootCategories(params){
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/attraction-categories', urlParams);
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                throw error;
            }
        },
        //get filtered and paginated resources
        async getAttractions(params){
            this.loading = true;
            this.attraction = null;
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/attractions', urlParams);
                console.log(response.data);
                this.attractions = response.data.results;
                this.attractionsTotal = response.data.pagination.total;
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
        //fetch resource. Different resource form attractions. Needs to be fetched again if not selected
        async getAttraction(id){
            this.loading = true;
            try {
                const response = await http.get('/api/attractions/'+id);
                this.attraction = response.data;
                this.loading = false;
                return this.attraction; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                this.loading = false;
                throw error;
            }
        },
        //create new resource
        async create(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.post('/api/attractions', data);
                const attraction = response.data;
                //attractions are not loaded when attraction form is opened directly
                if(this.attractions && this.attractions.length){
                    //adds the object data to the beginning of the array
                    this.attractions.unshift(attraction);
                }
                //set selected resource
                this.attraction = attraction;
                this.loading = false;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                this.loading = false;
                throw error;
            }
        },
        //update response
        async update(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.put('/api/attractions/'+data.id, data);
                const attraction = response.data;
                if(this.attractions && this.attractions.length){
                    //replace the existing resource
                    const index = this.attractions.findIndex( el => el.id == data.id);
                    this.attractions[index] = attraction;
                }
                //if selected attraction in form, update it
                if(this.attraction){
                    this.attraction = attraction;
                }
                this.loading = false;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                this.loading = false;
                throw error;
            }
        },
        //delete response
        async delete(id){
            this.loading = true;
            try {            
                const response = await http.delete('/api/attractions/'+id);
                this.attractions = this.attractions.filter(el => el.id != id); 
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
        //create new category
        async createType(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.post('/api/attraction-types', data);
                const category = response.data;
                //adds the object data to the beginning of the array
                this.categories.unshift(category);
                this.loading = false;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                this.loading = false;
                throw error;
            }
        },
        //update category
        async updateType(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.put('/api/attraction-types/'+data.id, data);
                const category = response.data;
                //replace the existing resource
                const index = this.categories.findIndex( el => el.id == data.id);
                this.categories[index] = category;
                this.loading = false;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                this.loading = false;
                throw error;
            }
        },
        //delete category
        async deleteType(id, params){
            const urlParams = parseFilterParams(params);
            this.loading = true;
            try {            
                const response = await http.delete('/api/attraction-types/'+id, urlParams);
                this.categories = response.data.results;
                this.categoriesTotal = response.data.pagination.total;
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
        //delete file
        async deleteFile(id){
            this.loading = true;
            try {            
                const response = await http.delete('/api/attractions/file/'+id);
                const attraction = response.data;
                //delete file path from store
                if(this.attractions && this.attractions.length){
                    const index = this.attractions.findIndex( el => el.id == id);
                    this.attractions[index].file_path = null;
                }
                //update resource
                if(this.attraction){
                    this.attraction = attraction;
                }
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
        //delete preview file
        async deletePreviewFile(id){
            this.loading = true;
            try { 
                const response = await http.delete('/api/attractions/preview-file/'+id);
                const attraction = response.data;
                //delete file path from store
                if(this.attractions && this.attractions.length){
                    const index = this.attractions.findIndex( el => el.id == id);
                    this.attractions[index].preview_file_path = null;
                }
                //update resource
                if(this.attraction){
                    this.attraction = attraction;
                }
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
        //delete file
        async downloadFile(id){
            this.loading = true;
            try {            
                await downloadFile('/api/attractions/download-file/'+id);
                this.loading = false;
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
