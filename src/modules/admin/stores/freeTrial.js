
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useFreeTrialStore = defineStore('freeTrial', {
    state: () => ({
        freeTrial: null,
        freeTrials: [],
        freeTrialsTotal: null,
        freeTrialPlan: null,
        freeTrialPlans: [],
        freeTrialPlansTotal: null,
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
        //get resources
        async getFreeTrialPlans(params){
            if (!this.freeTrialPlans.length) {
                const indexStore = useIndexStore();
                indexStore.setLoading();
                try {           
                    const response = await http.get('/api/free-trial-plans');
                    this.freeTrialPlans = response.data.data.free_trial_plans;
                    this.freeTrialPlansTotal = response.data.data.free_trial_plans.length;
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
        },
        async getFreeTrialPlan(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {           
                const response = await http.get('/api/free-trial-plans/'+id);
                this.freeTrialPlan = response.data.data.free_trial_plan;
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
        async getFreeTrials(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/'+this.selectedApp+'/free-trials', urlParams);
                this.freeTrials = response.data.data.free_trials.results;
                this.freeTrialsTotal = response.data.data.free_trials.pagination.total;
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
        async getFreeTrial(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                if(!this.freeTrial || this.freeTrial.id != id){
                    const response = await http.get('/api/'+this.selectedApp+'/free-trials/'+id);
                    this.freeTrial = response.data.data.free_trial;
                }
                indexStore.setLoading(false);
                return this.freeTrial; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                indexStore.setLoading(false);
                throw error;
            }
        },
        //fetch resource
        async getUserFreeTrial(userId){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/'+this.selectedApp+'/free-trials/user/'+userId);
                this.freeTrial = response.data.data;
                indexStore.setLoading(false);
                return this.freeTrial; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                indexStore.setLoading(false);
                throw error;
            }
        },
        //create new resource
        async create(data, errorFields, updateStore = true){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/free-trials', data);
                const freeTrial = response.data.data.free_trial;
                //set selected resource
                if (updateStore) {
                    this.freeTrial = freeTrial;
                }
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                indexStore.setLoading(false);
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                throw error;
            }
        },
        async createPlan(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/free-trial-plans', data);
                const freeTrialPlan = response.data.data.free_trial_plan;
                if(this.freeTrialPlans && this.freeTrialPlans.length){
                    //adds the object data to the beginning of the array
                    this.freeTrialPlans.unshift(freeTrialPlan);
                }
                //set selected resource
                this.freeTrialPlan = freeTrialPlan;
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                indexStore.setLoading(false);
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                throw error;
            }
        },
        //update response
        async update(id, data, errorFields, updateStore = true){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/free-trials/'+id, data);
                const freeTrial = response.data.data.free_trial;
                if(this.freeTrials && this.freeTrials.length){
                    //replace the existing resource
                    const freeTrialIndex = this.freeTrials.findIndex( el => el.id == id);
                    if (freeTrialIndex !== -1) {
                        this.freeTrials[freeTrialIndex] = freeTrial;
                    }
                }
                if(updateStore && this.freeTrial){
                    this.freeTrial = freeTrial;
                }
                indexStore.setLoading(false);
                return response.data.data;
            } catch (error) {
                indexStore.setLoading(false);
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                fillFormErrors(errorFields, error);
                throw error;
            }
        },
        async updatePlan(id, data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/free-trial-plans/'+id, data);
                const freeTrialPlan = response.data.data.free_trial_plan;
                if(this.freeTrialPlans && this.freeTrialPlans.length){
                    //replace the existing resource
                    const freeTrialPlanIndex = this.freeTrialPlans.findIndex( el => el.id == id);
                    if (freeTrialPlanIndex !== -1) {
                        this.freeTrialPlans[freeTrialPlanIndex] = freeTrialPlan;
                    }
                }
                if(this.freeTrialPlan){
                    this.freeTrialPlan = freeTrialPlan;
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
                const response = await http.delete('/api/free-trials/'+id);
                if (this.freeTrials && this.freeTrials.length) {
                    this.freeTrials = this.freeTrials.filter(el => el.id != id);
                }
                if (this.freeTrial && this.freeTrial.id == id) {
                    this.freeTrial = null;
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
        async deletePlan(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.delete('/api/free-trial-plans/'+id);
                if (this.freeTrialPlans && this.freeTrialPlans.length) {
                    this.freeTrialPlans = this.freeTrialPlans.filter(el => el.id != id);
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
    }
});
