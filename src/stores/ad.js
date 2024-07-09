
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { getLangId } from '@/util/general';
import { defineStore } from 'pinia'
const env = import.meta.env.VITE_APP_ENV;

export const useAdStore = defineStore('ad', {
    state: () => ({
        loading: false,
        category: null,
        categories: null,
        categoriesTotal: null,
        ad: null,
        ads: null,
        adsTotal: null,
        rootCategories: null,
        rootCategoriesTotal: null,
        selectedCategories: null,
        subcategories: null,
        trips: null,
        tree: null,
        treeCount: null,
        languages: null,
        places: null,
    }),
    getters: {
        
    },
    actions: {
        //get filtered and paginated resources
        async getCategories(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/ad-categories', urlParams);
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
        async getRootCategories(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/ad-categories/roots', urlParams);
                this.rootCategories = response.data;
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
        async getPageData(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/ad-categories/page-data', urlParams);
                this.rootCategories = response.data.categories;
                this.trips = response.data.trips;
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
        async getAdCategoryTree(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/ad-categories/tree', urlParams);
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
        async getCatagory(id, langId = ''){
            this.loading = true;
            const appLangId = langId || getLangId();
            try {
                const response = await http.get('/api/ad-categories/admin/'+id+'/'+appLangId);
                this.category = response.data;
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
        //get filtered and paginated resources
        async getAds(params){
            this.loading = true;
            this.ad = null;
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/ads', urlParams);
                this.ads = response.data.results;
                this.adsTotal = response.data.pagination.total;
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
        //fetch resource. Different resource form ads. Needs to be fetched again if not selected
        async getAd(id){
            this.loading = true;
            const langId = getLangId();
            try {
                const response = await http.get('/api/ads/'+id+'/'+langId);
                this.ad = response.data;
                this.loading = false;
                return this.ad; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                this.loading = false;
                throw error;
            }
        },
        async adminGetAd(id, langId = ''){
            this.loading = true;
            try {
                const response = await http.get('/api/ads/admin/'+id+'/'+langId);
                this.ad = response.data;
                this.loading = false;
                return this.ad; 
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
                const response = await http.post('/api/ads', data);
                const ad = response;
                //ads are not loaded when ad form is opened directly
                if(this.ads && this.ads.length){
                    //adds the object data to the beginning of the array
                    this.ads.unshift(ad);
                }
                //set selected resource
                this.ad = ad;
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
                const response = await http.put('/api/ads/'+data.id, data);
                const ad = response.data;
                if(this.ads && this.ads.length){
                    //replace the existing resource
                    const index = this.ads.findIndex( el => el.id == data.id);
                    this.ads[index] = ad;
                }
                //if selected ad in form, update it
                if(this.ad){
                    this.ad = ad;
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
                const response = await http.delete('/api/ads/'+id);
                this.ads = this.ads.filter(el => el.id != id); 
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
        async createCategory(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.post('/api/ad-categories', data);
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
        async updateCategory(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.put('/api/ad-categories/'+data.id, data);
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
        async deleteCategory(id, params){
            const urlParams = parseFilterParams(params);
            this.loading = true;
            try {            
                const response = await http.delete('/api/ad-categories/'+id, urlParams);
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
                const response = await http.delete('/api/ads/file/'+id);
                const ad = response.data;
                //delete file path from store
                if(this.ads && this.ads.length){
                    const index = this.ads.findIndex( el => el.id == id);
                    if (index !== -1) {
                        this.ads[index].file_path = null;
                    }
                }
                //update resource
                if(this.ad){
                    this.ad = ad;
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
    }
});
