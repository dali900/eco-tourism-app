import { ref, inject, onBeforeMount, onUnmounted } from 'vue'
const env = import.meta.env.VITE_APP_ENV;

export function useAppTracking() {
    //const mixpanel = inject('mixpanel')

    const mixpanelTrack = (eventName, data = null) => {
        if(env !== 'local'){
            console.log(eventName);
            console.log(data);
            //mixpanel.track(eventName, data);
        }
    }
    
    const setUser = (user) => {
        /* if(env !== 'local'){
            mixpanel.identify(user.email);
            mixpanel.people.set({
                "$first_name": user.first_name,
                "$last_name": user.last_name,
                "$email": user.email,
                "$distinct_id": user.email,
                "Plan": user.role,
                "Created": user.created_at_formated,
                created_at: user.created_at
            });
        } */
    }

    return { mixpanelTrack, setUser }
}