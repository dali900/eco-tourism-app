const env = import.meta.env.VITE_APP_ENV;
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import globalStorePlugin from './stores/globalStorePlugin'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ConfirmationService from 'primevue/confirmationservice';
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import srCyrl from './locales/sr-cyrl.json'
import srLatn from './locales/sr-latn.json'
import VueMixpanel from 'vue-mixpanel'

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Card from 'primevue/card';
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import PanelMenu from 'primevue/panelmenu';
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import Tooltip from 'primevue/tooltip';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import DataView from 'primevue/dataview';
import FileUpload from 'primevue/fileupload';
import Calendar from 'primevue/calendar';
import ConfirmDialog from 'primevue/confirmdialog';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Galleria from 'primevue/galleria';
import { http } from './util/apiClient'
import Popper from "vue3-popper";

import App from './App.vue'
import router from './router/index'

//import './assets/main.css'
import './bootstrap'

const i18n = createI18n({
    locale: "srLatn",
    fallback: "srLatn",
    messages: { en, srLatn, srCyrl },
    legacy: false
})

const app = createApp(App)
// Global error handler
if (env === 'production') {
    app.config.errorHandler = (err, instance, info) => {
        console.error(err);
        http.post('api/report-error', {
            msg: err.message, 
            stack: err.stack, 
            url: window.location.href,
            info
        });
        throw new Error(err);
    };
}
const pinia = createPinia();
pinia.use(globalStorePlugin);
app.use(pinia)
app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);
app.use(ConfirmationService);
app.use(i18n)
/* app.use(VueMixpanel, {
    token: import.meta.env.VITE_MIXPANEL_TOKEN,
    config: {
        ignore_dnt: true,
        debug: env !== 'production'
    }
}) */


app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('MultiSelect', MultiSelect);
app.component('Button', Button);
app.component('SplitButton', SplitButton);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('Card', Card);
app.component('Sidebar', Sidebar);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('PanelMenu', PanelMenu);
app.component('Panel', Panel);
app.component('Dialog', Dialog);
app.component('ProgressSpinner', ProgressSpinner);
app.component('ProgressBar', ProgressBar);
app.component('Toast', Toast);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Paginator', Paginator);
app.component('DataView', DataView);
app.component('Calendar', Calendar);
app.component('FileUpload', FileUpload);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Galleria', Galleria);
app.component("Popper", Popper);


app.directive('tooltip', Tooltip);

app.mount('#app')
