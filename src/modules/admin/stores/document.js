
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useDocumentStore = defineStore('document', {
    state: () => ({
        documentType: null,
        documentTypes: null,
        documentTypesTotal: null,
        documentRootTypes: null,
        document: null,
        documents: null,
        documentsTotal: null,
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
        async getDocumentTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/'+this.selectedApp+'/document-types', urlParams);
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
                const response = await http.get('/api/'+this.selectedApp+'/document-types/roots', urlParams);
                this.documentRootTypes = response.data.data.document_root_types;
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
        async getFilterDocumentRootTypes(params){
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/document-types', urlParams);
                return response.data.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
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
                const response = await http.get('/api/'+this.selectedApp+'/documents', urlParams);
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
                const response = await http.get('/api/'+this.selectedApp+'/documents/'+id);
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
        //create new resource
        async create(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/documents', data);
                const document = response.data.data.document;
                //adds the object data to the beginning of the array
                if(this.documents && this.documents.length){
                    this.documents.unshift(document);
                }
                this.document = document;
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
                const response = await http.put('/api/'+this.selectedApp+'/documents/'+data.id, data);
                const document = response.data.data.document;
                //replace the existing resource
                if(this.documents && this.documents.length){
                    const documentIndex = this.documents.findIndex( el => el.id == data.id);
                    this.documents[documentIndex] = document;
                }
                //update resource
                if(this.document){
                    this.document = document;
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
                const response = await http.delete('/api/'+this.selectedApp+'/documents/'+id);
                this.documents = this.documents.filter(el => el.id != id); 
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
        //create new documentType
        async createType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/document-types', data);
                const documentType = response.data.data.document_type;
                //adds the object data to the beginning of the array
                this.documentTypes.unshift(documentType);
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
        //update documentType
        async updateType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/document-types/'+data.id, data);
                const documentType = response.data.data.document_type;
                //replace the existing resource
                const documentIndex = this.documentTypes.findIndex( el => el.id == data.id);
                this.documentTypes[documentIndex] = documentType;
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
        //delete documentType
        async deleteType(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/document-types/'+id);
                this.documentTypes = this.documentTypes.filter(el => el.id != id); 
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
                const response = await http.delete('/api/'+this.selectedApp+'/documents/file/'+id);
                const document = response.data.data.document;
                //delete file path from store
                if(this.documents && this.documents.length){
                    const documentIndex = this.documents.findIndex( el => el.id == id);
                    this.documents[documentIndex].file_path = null;
                }
                //update resource
                if(this.document){
                    this.document = document;
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
                const response = await http.delete('/api/'+this.selectedApp+'/documents/preview-file/'+id);
                const document = response.data.data.document;
                //delete file path from store
                if(this.documents && this.documents.length){
                    const documentIndex = this.documents.findIndex( el => el.id == id);
                    this.documents[documentIndex].preview_file_path = null;
                }
                //update resource
                if(this.document){
                    this.document = document;
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
        //download file
        async downloadFile(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                await downloadFile('/api/'+this.selectedApp+'/documents/download-file/'+id);
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
