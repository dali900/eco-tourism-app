
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useDocumentStore = defineStore('document', {
    state: () => ({
        documentType: null,
        documentTypes: null,
        documentRootTypes: null,
        documentTypesTotal: null,
        document: null,
        documents: null,
        documentsTotal: null,
    }),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        }
    },
    actions: {
        //get filtered and paginated resources
        async getDocumentTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/'+indexStore.app+'/document-types', urlParams);
                this.documentTypes = response.data.data.document_types.results;
                this.documentTypesTotal = response.data.data.document_types.pagination.total;
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
        async getDocumentRootTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+indexStore.app+'/document-types/roots', urlParams);
                this.documentRootTypes = response.data.data.document_all_types;
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
        async getDocuments(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            this.document = null;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+indexStore.app+'/documents', urlParams);
                this.documents = response.data.data.documents.results;
                this.documentsTotal = response.data.data.documents.pagination.total;
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
        //fetch resource
        async getDocument(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {         
                const response = await http.get('/api/'+indexStore.app+'/documents/'+id);
                this.document = response.data.data.document;
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
        //download file
        async downloadFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                await downloadFile('/api/'+indexStore.app+'/documents/download-file/'+id);
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
