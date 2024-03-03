
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useQuestionStore = defineStore('question', {
    state: () => ({
        questions: [], 
        question: null, 
        questionsTotal: 0,
        questionType: null,
        questionTypes: [],
        questionRootTypes: [],
        questionTypesTotal: 0,
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
        async getQuestions(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            this.question = null;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/questions', urlParams);
                this.questions = response.data.data.questions.results;
                this.questionsTotal = response.data.data.questions.pagination.total;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                console.log(error);
                indexStore.setLoading(false);
                throw error;
            }
        },
        async getQuestion(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/'+this.selectedApp+'/questions/'+id);
                this.question = response.data.data.question;
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
        //create new question
        async create(data, errorFields){
            const indexStore = useIndexStore(); 
            indexStore.setLoading();
            try {
                const response = await http.post('/api/'+this.selectedApp+'/questions', data);
                const question = response.data.data.question;
                //adds the object data to the beginning of the array
                this.questions.unshift(question);
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
        //update question
        async update(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/questions/'+data.id, data);
                const question = response.data.data.question;
                //replace the existing resource
                const questionIndex = this.questions.findIndex( el => el.id == data.id);
                this.questions[questionIndex] = question;
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
        //delete question
        async delete(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/questions/'+id);
                this.questions = this.questions.filter(el => el.id != id); 
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
                const response = await http.delete('/api/'+this.selectedApp+'/questions/file/'+id);
                const questionIndex = this.questions.findIndex( el => el.id == id);
                this.questions[questionIndex].file_path = null;
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
        async getQuestionTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/'+this.selectedApp+'/question-types', urlParams);
                this.questionTypes = response.data.data.question_types.results;
                this.questionTypesTotal = response.data.data.question_types.pagination.total;
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
        async getQuestionRootTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/'+this.selectedApp+'/question-types/roots', urlParams);
                this.questionRootTypes = response.data.data.question_root_types;
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
        //create new questionType
        async createType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/question-types', data);
                const questionType = response.data.data.question_type;
                //adds the object data to the beginning of the array
                this.questionTypes.unshift(questionType);
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
        //update questionType
        async updateType(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/question-types/'+data.id, data);
                const questionType = response.data.data.question_type;
                //replace the existing resource
                const questionIndex = this.questionTypes.findIndex( el => el.id == data.id);
                this.questionTypes[questionIndex] = questionType;
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
        //delete questionType
        async deleteType(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/'+this.selectedApp+'/question-types/'+id);
                this.questionTypes = this.questionTypes.filter(el => el.id != id); 
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                indexStore.setLoading(false);
                throw error;
            }
        }
    }
});
