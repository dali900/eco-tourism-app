
import { http, parseFilterParams, fillFormErrors, downloadFile } from '@/util/apiClient';
import { defineStore } from 'pinia'
const env = import.meta.env.VITE_APP_ENV;

export const usePlaceStore = defineStore('place', {
    state: () => ({
        loading: false,
        place: null,
        places: null,
        placesTotal: null,
        rootPlaces: null,
        tree: null,
        treeCount: null
    }),
    actions: {
        //get filtered and paginated resources
        async getAll(params){
            this.loading = true;
            try {
                const urlParams = parseFilterParams(params);
                const response = await http.get('/api/places', urlParams);
                this.places = response.data.results;
                this.placesTotal = response.data.pagination.total;
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
        async get(id){
            this.loading = true;
            try {
                const response = await http.get('/api/places/'+id);
                this.place = response.data;
                this.loading = false;
                return this.attraction; 
            } catch (error) {
                if(env === 'local' || env === 'dev'){
                    console.log(error);
                }
                this.loading = false;
                throw error;
            }
        },
        //create new resource
        async create(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.post('/api/places', data);
                const place = response.data;
                if(this.places && this.places.length){
                    //adds the object data to the beginning of the array
                    this.places.unshift(place);
                }
                //set selected resource
                this.place = place;
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
        //update response
        async update(data, errorFields){
            this.loading = true;
            try {            
                const response = await http.put('/api/places/'+data.id, data);
                const place = response.data;
                if(this.places && this.places.length){
                    //replace the existing resource
                    const index = this.places.findIndex( el => el.id == data.id);
                    this.places[index] = place;
                }
                //if selected attraction in form, update it
                if(this.place){
                    this.place = place;
                }
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
        //delete response
        async delete(id){
            this.loading = true;
            try {            
                const response = await http.delete('/api/places/'+id);
                this.places = this.places.filter(el => el.id != id); 
                if (this.placesTotal !== null && this.placesTotal > 0) {
                    this.placeTotal--;
                }
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
