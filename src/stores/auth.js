
import axios from 'axios';
import { http, storeAuthToken, removeAuthToken, getAuthToken } from '@/util/apiClient';
import { defineStore } from 'pinia'
import { useGlobalStore } from './global'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null, //TODO: rename csrf_token
        fetchingUser: false,
        redirectUrl: null,
        apiAuthToken: null,
    }),
    getters: {
        isAuthenticated(state){
            return !!state.user;
        },
        loading(state){
            const globalStore = useGlobalStore();
            return globalStore.loading;
        },
        hasUserAdminAccess(state){
            return state.user && (
                state.user.role === "admin" || 
                state.user.role === "super_admin" ||
                state.user.role === "editor" ||
                state.user.role === "author"
            );
        },
        authToken(state){
            if (state.apiAuthToken) return state.apiAuthToken;
            return getAuthToken();
        },
    },
    actions: {
        async login(data, formErrors){
            const globalStore = useGlobalStore();
            globalStore.setLoading();
            try {
                await http.get('/sanctum/csrf-cookie');
                const response = await http.post('/api/login', data);
                this.user = response.data.user;
                this.token = response.data.csrf_token;
                this.apiAuthToken = response.data.auth_token;
                storeAuthToken(this.apiAuthToken);
                globalStore.setLoading(false);
                return response.data;
            } catch (error) {
                globalStore.setLoading(false);
                console.log(error);
                const response = error.response;
                if(error.response.status == 422){
                    const errors = response.data.errors;
                    formErrors.email = errors.email ? errors.email[0] : "";
                    formErrors.password = errors.password ? errors.password[0] : "";
                }
                else if (error.response.status === 403) {
                    formErrors.default = response.data.message || "Nemate pristup."
                }
                else { //401 - laravel Unauthenticated - http Unauthorized
                    //const message = response.data.message;
                    formErrors.default = "Pogrešan email ili šifra";
                }
                throw error;
            }
        },
        async logout(errors = {}){
            const globalStore = useGlobalStore();
            globalStore.setLoading();
            try {
                await http.get('/api/logout');
                globalStore.setLoading(false);
                this.user = null;
                removeAuthToken();
                return true
            } catch (error) {
                console.log(error);
                const response = error.response;
                const message = response?.data.message;
                errors.default = message;
            }
        }, 
        async getAuthUser(errors = {}){
            this.fetchingUser = true;
            const globalStore = useGlobalStore();
            globalStore.setLoading();
            try {
                const response = await http.get('/api/me');
                if(response.user !== null){
                    this.user = response.data.user;
                    this.token = response.data.csrf_token;
                }
                globalStore.setLoading(false);
                this.fetchingUser = false;
                return response.data.data;
            } catch (error) {
                const response = error.response;
                this.fetchingUser = false;
                globalStore.setLoading(false);
                this.user = null;
                const message = response?.message || null;
                errors.default = message;
                throw error;
            }
        },
        hasActivePlan(){
            return this.user && this.user.has_active_plan;
        },  
        hasAccessLevel(accessLevel){
            return this.user && this.user.access && this.user.access >= accessLevel;
        },
        hasSuperAdminAccess(){
            return this.user && this.user.access && this.user.access == 5;
        }, 
        hasAdminAccess(){
            return this.user && this.user.access && this.user.access >= 4;
        }, 
        hasEditorAccess(){
            return this.user && this.user.access && this.user.access >= 3;
        }, 
        hasAuthorAccess(){
            return this.user && this.user.access && this.user.access >= 2;
        }, 
    }
});
