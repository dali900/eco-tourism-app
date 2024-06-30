
import { http, parseFilterParams, fillFormErrors } from '@/util/apiClient';
import { defineStore, storeToRefs } from 'pinia'
import { getLangId } from '@/util/general';
const env = import.meta.env.VITE_APP_ENV;

export const useTripStore = defineStore('trip', {
    state: () => ({
        trips: [], 
        trip: null, 
        tripsTotal: 0,
        attraction: null,
        attractions: null,
        selectedAttractions: null,
        loading: false
    }),
    getters: {
        selectedApp(state){
            
            return indexStore.selectedApp;
        },
    },
    actions: {
        async getAll(params){          
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/trips', urlParams);
                this.trips = response.data.results;
                this.tripsTotal = response.data.pagination.total;
                this.loading = false;
                return response.data;
            } catch (error) {
                console.log(error);
                this.loading = false;
                throw error;
            }
        },
        async get(id){
            this.loading = true;
            const langId = getLangId();
            try {
                const response = await http.get('/api/trips/'+id+'/'+langId);
                this.trip = response.data;
                this.selectedAttractions = response.data.selected_attractions;
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
        async adminGet(id, langId = ''){
            this.loading = true;
            try {
                const response = await http.get('/api/trips/admin/'+id+'/'+langId);
                this.trip = response.data;
                this.selectedAttractions = response.data.selected_attractions;
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
        //create
        async create(data, errorFields){             
            this.loading = true;
            try {            
                const response = await http.post('/api/trips', data);
                const trip = response.data;
                this.trip = trip;
                this.trips.unshift(trip);
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
        //update
        async update(data, errorFields){            
            this.loading = true;
            try {            
                const response = await http.put('/api/trips/'+data.id, data);
                const trip = response.data;
                //replace the existing resource
                const tripIndex = this.trips.findIndex( el => el.id == data.id);
                this.trips[tripIndex] = trip;
                this.trip = trip;
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
        //delete
        async delete(id){            
            this.loading = true;
            try {            
                const response = await http.delete('/api/trips/'+id);
                this.trips = this.trips.filter(el => el.id != id); 
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
                const response = await http.delete('/api/trips/file/'+id);
                const tripIndex = this.trips.findIndex( el => el.id == id);
                this.trips[tripIndex].file_path = null;
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
