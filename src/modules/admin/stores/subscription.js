
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useSubscriptionStore = defineStore('subscription', {
    state: () => ({
        subscription: null,
        subscriptions: [],
        subscriptionsTotal: null,
        subscriptionPlan: null,
        subscriptionPlans: null,
        subscriptionPlansTotal: null,
        userSubscriptions: null,
        userSubscriptionsTotal: null,
        userSubscriptionsLoading: false,
        intervals: [
            {name: "Mesečno - m", value: "m"}, 
            {name: "Godišnje - y", value: "y"}
        ]
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
        async getSubscriptionPlans(){
            if (!this.subscriptionPlans) {
                const indexStore = useIndexStore();
                indexStore.setLoading();
                try {           
                    const response = await http.get('/api/subscription-plans');
                    this.subscriptionPlans = response.data.data.subscription_plans;
                    this.subscriptionPlansTotal = response.data.data.subscription_plans.length;
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
        async getSubscriptionPlan(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {           
                const response = await http.get('/api/subscription-plans/'+id);
                this.subscriptionPlan = response.data.data.subscription_plan;
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
        async getSubscriptions(params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);         
                const response = await http.get('/api/'+this.selectedApp+'/subscriptions', urlParams);
                this.subscriptions = response.data.data.subscriptions.results;
                this.subscriptionsTotal = response.data.data.subscriptions.pagination.total;
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
        async getUserSubscriptions(userId, params){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const urlParams = parseFilterParams(params);             
                const response = await http.get('/api/'+this.selectedApp+'/subscriptions/user/'+userId, urlParams);
                this.userSubscriptions = response.data.data.results;
                this.userSubscriptionsTotal = response.data.data.pagination.total;
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
        async getSubscription(id){
            if(!this.subscription || this.subscription.id != id){
                const indexStore = useIndexStore();
                indexStore.setLoading();
                try {
                    const response = await http.get('/api/'+this.selectedApp+'/subscriptions/'+id);
                    this.subscription = response.data.data.subscription;
                    indexStore.setLoading(false);
                    return this.subscription; 
                } catch (error) {
                    if(env === 'local' || env === 'dev'){
                        console.log(error);
                    }
                    indexStore.setLoading(false);
                    throw error;
                }
            }
        },
        //create new resource
        async create(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+this.selectedApp+'/subscriptions', data);
                const subscription = response.data.data.subscription;
                if(subscription){
                    //adds the object data to the beginning of the array
                    this.subscriptions.unshift(subscription);
                }
                //set selected resource
                this.subscription = subscription;
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
        async createPlan(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/subscription-plans', data);
                const subscriptionPlan = response.data.data.subscription_plan;
                if(this.subscriptionPlans && this.subscriptionPlans.length){
                    //adds the object data to the beginning of the array
                    this.subscriptionPlans.unshift(subscriptionPlan);
                }
                //set selected resource
                this.subscriptionPlan = subscriptionPlan;
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
        async update(id, data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+this.selectedApp+'/subscriptions/'+id, data);
                const subscription = response.data.data.subscription;
                if(this.subscriptions && this.subscriptions.length){
                    //replace the existing resource
                    const subscriptionIndex = this.subscriptions.findIndex( el => el.id == id);
                    if (subscriptionIndex !== -1) {
                        this.subscriptions[subscriptionIndex] = subscription;
                    }
                }
                if(this.subscription){
                    this.subscription = subscription;
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
        async updatePlan(id, data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/subscription-plans/'+id, data);
                const subscriptionPlan = response.data.data.subscription_plan;
                if(this.subscriptionPlans && this.subscriptionPlans.length){
                    //replace the existing resource
                    const subscriptionPlanIndex = this.subscriptionPlans.findIndex( el => el.id == id);
                    if (subscriptionPlanIndex !== -1) {
                        this.subscriptionPlans[subscriptionPlanIndex] = subscriptionPlan;
                    }
                }
                if(this.subscriptionPlan){
                    this.subscriptionPlan = subscriptionPlan;
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
                const response = await http.delete('/api/subscriptions/'+id);
                if (this.subscriptions && this.subscriptions.length) {
                    this.subscriptions = this.subscriptions.filter(el => el.id != id); 
                }
                if (this.subscription && this.subscription.id == id) {
                    this.subscription = null;
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
                const response = await http.delete('/api/subscription-plans/'+id);
                this.subscriptionPlans = this.subscriptionPlans.filter(el => el.id != id); 
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
