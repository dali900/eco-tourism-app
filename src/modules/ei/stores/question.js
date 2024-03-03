
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
        questionTypesTotal: 0,
    }),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        }
    },
    actions: {
        async getQuestions(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            this.question = null;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/exportinfo/questions', urlParams);
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
                const response = await http.get('/api/exportinfo/questions/'+id);
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
        //get filtered and paginated resources
        async getQuestionTypes(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/exportinfo/question-types', urlParams);
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
    }
});
