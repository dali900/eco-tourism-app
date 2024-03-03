import { ref, onMounted, onUnmounted } from "vue";
import { useIndexStore } from '@/stores/index'
import { useToast } from "primevue/usetoast";
const env = import.meta.env.VITE_APP_ENV;

export function useAppUpdateManager() {
    const toast = useToast();
    const indexStore = useIndexStore();
    const checkTimer = ref(null);
    const reloadTimer = ref(null);

    const getAppVersion = () => {
        indexStore.getAppVersion();
    }
    
    const trackAppUpdates = () => {
        checkTimer.value = setInterval(() => {
            indexStore.trackAppVersion();
            if(indexStore.loadedAppVersion !== null && indexStore.newAppVersion !== null){
                if((indexStore.loadedAppVersion !== indexStore.newAppVersion)){
                    clearInterval(checkTimer.value);
                    setAppReloadTimer();
                }
            }
        }, 1000 * 5); // minutes (1000 milliseconds * x min (in seconds))
    }
    
    const setAppReloadTimer = () => {
        console.log("app reload in 10 sec");
        toast.add({severity:'info', summary: 'Nova verzija aplikacije!', detail: 'Kako bi uspešno učitali novu verziju aplikacije molimo vas da osvežite stranicu ili sačekajte 10 sekundi.', life: 11000});
        reloadTimer.value = setTimeout(() => {
            window.location.reload();
        }, 1000 * 12);
    }

    //onMounted(() => {});

    onUnmounted(() => {
        if(env !== 'local'){ 
            clearInterval(checkTimer.value);
            clearTimeout(reloadTimer.value);
        }
    });

    //check for app update
    if(env !== 'local'){ 
        indexStore.getAppVersion()
            .then((responseData) => {
                trackAppUpdates();
            })
    }



    return { checkTimer, getAppVersion, trackAppUpdates};
}
