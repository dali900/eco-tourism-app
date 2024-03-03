import { ref } from 'vue';
import { getAppNameFromUrl } from '../util/general'

export default function({ store }) {

    store.globalLoading = ref(false);
    store.$state.globalLoading = store.globalLoading;
    store.setGlobalLoading = (status) => {
        store.globalLoading = status;
        store.$state.globalLoading = status;
    }
    return {
        //globalLoading: ref(false),
        app: ref(getAppNameFromUrl())
    };
}