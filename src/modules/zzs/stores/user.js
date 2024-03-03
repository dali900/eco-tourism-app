
import axios from 'axios';
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useIndexStore } from './index'
const env = import.meta.env.VITE_APP_ENV;

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        users: null,
        usersTotal: null,
        profiles: null,
        profilesTotal: null,
        roles: null,
    }),
    getters: {
        loading(state){
            const indexStore = useIndexStore();
            return indexStore.loading;
        }
    },
    actions: {
        //fetch resource
        async getUser(id){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {
                const response = await http.get('/api/'+indexStore.app+'/users/'+id);
                this.user = response.data.data.user;
                this.roles = response.data.data.roles;
                indexStore.setLoading(false);
                return this.user;
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
                const response = await http.post('/api/'+indexStore.app+'/users', data);
                const user = response.data.data.user;
                //users are not loaded when user form is opened directly
                if(this.users && this.users.length){
                    //adds the object data to the beginning of the array
                    this.users.unshift(user);
                }
                //set selected resource
                this.user = user;
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
                const response = await http.put('/api/'+indexStore.app+'/users/'+id, data);
                const user = response.data.data.user;
                if(this.users && this.users.length){
                    //replace the existing resource
                    const userIndex = this.users.findIndex( el => el.id == data.id);
                    this.users[userIndex] = user;
                }
                //if selected user in form, update it
                if(this.user){
                    this.user = user;
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
        //update response
        async updatePassword(id, data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.put('/api/'+indexStore.app+'/users/'+id+'/password', data);
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
                const response = await http.delete('/api/'+indexStore.app+'/users/'+id);
                this.users = this.users.filter(el => el.id != id); 
                if(this.user && this.user.id == id){
                    this.user = null;
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
        //contact
        async contact(data, errorFields){
            const indexStore = useIndexStore();
            indexStore.setLoading();
            try {            
                const response = await http.post('/api/'+indexStore.app+'/contact', data);
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
        deactivateFreeTrial() {
            if (this.user && this.user.free_trial) {
                this.user.free_trial.active = 0;
            }
        }
    }
});
