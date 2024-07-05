
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore, storeToRefs } from 'pinia'
import { getLangId } from '@/util/general';
const env = import.meta.env.VITE_APP_ENV;

export const useNewsStore = defineStore('news', {
    state: () => ({
        news: [], 
        one_news: null, 
        newsTotal: 0,
        tree: null,
        treeCount: 0,
        selectedCategories: null,
        rootCategories: null,
        category: null,
        cetegories: null,
        categoriesTotal: null,
        newsCategories: null,
        loading: false
    }),
    getters: {
        selectedApp(state){
            
            return indexStore.selectedApp;
        },
    },
    actions: {
        async getNews(params){          
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/news', urlParams);
                this.news = response.data.results;
                this.newsTotal = response.data.pagination.total;
                this.loading = false;
                return response.data;
            } catch (error) {
                console.log(error);
                this.loading = false;
                throw error;
            }
        },
        async getOneNews(id, langId = ''){
            this.loading = true;
            const appLangId = langId || getLangId();
            try {
                const response = await http.get('/api/news/'+id+'/'+appLangId);
                this.one_news = response.data.news;
                this.newsCategories = response.data.news_categories;
                this.selectedCategories = response.data.selected_categories;
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
        async adminGetOneNews(id, langId = ''){
            this.loading = true;
            try {
                const response = await http.get('/api/news/admin/'+id+'/'+langId);
                this.one_news = response.data.news;
                this.newsCategories = response.data.news_categories;
                this.selectedCategories = response.data.selected_categories;
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
        async getRootCategories(params=null){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/news-categories/roots', urlParams);
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
        async adminGetCategory(id, langId = ''){
            this.loading = true;
            const appLangId = langId || getLangId();
            try {
                const response = await http.get('/api/news-categories/admin/'+id+'/'+appLangId);
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
        async getNewsCategoryTree(){
            this.loading = true;
            try {
                const urlParams = parseFilterParams();
                const response = await http.get('/api/news-categories/tree', urlParams);
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
        async getCategoryNews(params, id){
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/news-categories/category/'+id, urlParams);
                this.category = response.data.category;
                this.news = response.data.news.results;
                this.newsTotal = response.data.news.pagination.total;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                throw error;
            }
        },
        //create new category
        async createCategory(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.post('/api/news-categories', data);
                const category = response.data;
                //adds the object data to the beginning of the array
                //this.categories.unshift(category);
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
                const response = await http.put('/api/news-categories/'+data.id, data);
                const category = response.data;
                //replace the existing resource
                if (this.newsCategories) {
                    const index = this.newsCategories.findIndex( el => el.id == data.id);
                    this.categories[index] = category;
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
        //delete category
        async deleteCategory(id, params){
            const urlParams = parseFilterParams(params);
            this.loading = true;
            try {            
                const response = await http.delete('/api/news-categories/'+id, urlParams);
                this.categories = response.data.results;
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
        //create new news
        async create(data, errorFields){             
            this.loading = true;
            try {            
                const response = await http.post('/api/news', data);
                const news = response.data;
                this.one_news = news;
                //adds the object data to the beginning of the array
                this.news.unshift(news);
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
        //update news
        async update(data, errorFields){            
            this.loading = true;
            try {            
                const response = await http.put('/api/news/'+data.id, data);
                const news = response.data;
                //replace the existing resource
                const newsIndex = this.news.findIndex( el => el.id == data.id);
                this.news[newsIndex] = news;
                this.one_news = news;
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
        //delete news
        async delete(id){            
            this.loading = true;
            try {            
                const response = await http.delete('/api/news/'+id);
                this.news = this.news.filter(el => el.id != id); 
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
                const response = await http.delete('/api/news/file/'+id);
                const newsIndex = this.news.findIndex( el => el.id == id);
                this.news[newsIndex].file_path = null;
                this.loading = false;
                return response.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                this.loading = false;
                throw error;
            }
        }
    }
});
