
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: [], 
        article: null, 
        articlesTotal: 0,
        articleType: null,
        articleTypes: [],
        articleTypesTotal: 0,
    }),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        }
    },
    actions: {
        async getArticles(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            this.article = null;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/exportinfo/articles', urlParams);
                this.articles = response.data.data.articles.results;
                this.articlesTotal = response.data.data.articles.pagination.total;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                console.log(error);
                indexStore.setLoading(false);
                throw error;
            }
        },
        async getArticle(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/exportinfo/articles/'+id);
                this.article = response.data.data.article;
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
        async getArticleTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/exportinfo/article-types', urlParams);
                this.articleTypes = response.data.data.article_types.results;
                this.articleTypesTotal = response.data.data.article_types.pagination.total;
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
        async getArticleRootTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+indexStore.app+'/article-types/roots', urlParams);
                this.articleRootTypes = response.data.data.article_root_types;
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
    }
});
