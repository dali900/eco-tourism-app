<template>
    <div class="regulation p-3">
        <div v-if="!regulation">
            <div v-if="loading">Učitava se...</div>
            <div v-else>Nema podataka.</div>
        </div>
        <div class="regulation-content" v-if="regulation">
            <h2 v-if="!authStore.hasActivePlan()" class="pb-3">{{regulation.name}} <i class="pi pi-lock"></i> </h2>
            <div class="grid" v-if="authStore.hasActivePlan()">
                <div class="col-12 md:col-8 lg:col-8">
                    <FilePreview 
                        :url="url" 
                        :htmlFileContent="htmlFileContent"
                        :title="regulation.name"
                    />
                </div>
                <div class="col-12 md:col-4 lg:col-4">
                    <div class="fields">
                        <template v-if="regulation.type && regulation.type.ancestorsAndSelf">
                            <div v-if="regulation.type.ancestorsAndSelf[0]" class="field">
                                <div class="label">Oblast</div>
                                <div class="data">{{regulation.type.ancestorsAndSelf[0].name}}</div>
                            </div>
                            <div v-if="regulation.type.ancestorsAndSelf[1]" class="field">
                                <div class="label">Vrsta</div>
                                <div class="data">{{regulation.type.ancestorsAndSelf[1].name}}</div>
                            </div>
                            <div v-if="regulation.type.ancestorsAndSelf[2]" class="field">
                                <div class="label">Podvrsta</div>
                                <div class="data">{{regulation.type.ancestorsAndSelf[2].name}}</div>
                            </div>
                        </template>
                        <div v-if="regulation.messenger" class="field">
                            <div class="label">Glasilo</div>
                            <div class="data">{{regulation.messenger}}</div>
                        </div>
                        <div v-if="regulation.maker" class="field">
                            <div class="label">Donosilac</div>
                            <div class="data">{{regulation.maker}}</div>
                        </div>
                        <div v-if="regulation.validity_level" class="field">
                            <div class="label">Nivo važenja</div>
                            <div class="data">{{regulation.validity_level}}</div>
                        </div>
                        <div v-if="regulation.start_date_formated" class="field">
                            <div class="label">Datum stupanja na snagu propisa</div>
                            <div class="data">{{regulation.start_date_formated}}</div>
                        </div>
                        <div v-if="regulation.version_end_date_formated" class="field">
                            <div class="label">Datum prestanka verzije</div>
                            <div class="data">{{regulation.version_end_date_formated}}</div>
                        </div>
                        <div v-if="regulation.version_release_date_formated" class="field">
                            <div class="label">Datum objavljivanja verzije</div>
                            <div class="data">{{regulation.version_release_date_formated}}</div>
                        </div>
                        <div v-if="regulation.text_release_date_formated" class="field">
                            <div class="label">Datum objavljivanja osnovnog teksta</div>
                            <div class="data">{{regulation.text_release_date_formated}}</div>
                        </div>
                        <div v-if="regulation.int_start_date_formated" class="field">
                            <div class="label">Datum stupanja na snagu međunarodnog ugovora</div>
                            <div class="data">{{regulation.int_start_date_formated}}</div>
                        </div>
                        <div v-if="regulation.text_start_date_formated" class="field">
                            <div class="label">Datum početka primene</div>
                            <div class="data">{{regulation.text_start_date_formated}}</div>
                        </div>
                        <div v-if="regulation.end_date_formated" class="field">
                            <div class="label">Datum prestanka važenja propisa</div>
                            <div class="data">{{regulation.end_date_formated}}</div>
                        </div>
                        <div v-if="regulation.use_start_date_formated" class="field">
                            <div class="label">Datum stupanja na snagu verzije propisa</div>
                            <div class="data">{{regulation.use_start_date_formated}}</div>
                        </div>
                        <div v-if="regulation.legal_predecessor_end_date_formated" class="field">
                            <div class="label">Datum prestanka važenja pravnog prethodnika</div>
                            <div class="data">{{regulation.legal_predecessor_end_date_formated}}</div>
                        </div>
                        <div v-if="regulation.basis" class="field">
                            <div class="label">Osnov za donošenje</div>
                            <div class="data">{{regulation.basis}}</div>
                        </div>
                        <div v-if="regulation.invalid_regulation" class="field">
                            <div class="label">Propis koji je prestao da važi</div>
                            <div class="data">{{regulation.invalid_regulation}}</div>
                        </div>
                        <div v-if="regulation.invalid_basis" class="field">
                            <div class="label">Norma za prestanak važenja</div>
                            <div class="data">{{regulation.invalid_basis}}</div>
                        </div>
                        <div v-if="regulation.historical_version" class="field">
                            <div class="label">Istorijska verzija propisa</div>
                            <div class="data">{{regulation.historical_version}}</div>
                        </div>
                        <div v-if="regulation.note" class="field">
                            <div class="label">Napomena</div>
                            <div class="data">{{regulation.note}}</div>
                        </div>
                        <div v-if="regulation.messenger_note" class="field">
                            <div class="label">Napomena glasnika</div>
                            <div class="data">{{regulation.messenger_note}}</div>
                        </div>
                        <div>
                            <Button v-if="regulation.download_file" label="Preuzmi" icon="pi pi-download" class="mr-2" @click="downloadFile()"/>
                            <Button v-else disabled label="Propis trenutno nije dostupan za preuzimanje" icon="pi pi-download" class="p-button-secondary"></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid" v-else>
                <div class="field col-12 md:col-6 lg:col-6">
                    <NoAccessContent/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeMount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useRegulationStore } from '@zzs/stores/regulation'
import { useAuthStore } from '@/stores/auth'
import NoAccessContent from '../noAccess/NoAccessContent.vue';
import FilePreview from '../../components/FilePreview.vue';
import { useAppTracking } from '@/util/appTracking'

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const route = useRoute();
const toast = useToast();

const appTracking = useAppTracking();
const regulationStore = useRegulationStore();
const authStore = useAuthStore();
const { regulation, regulationsTotal, loading } = storeToRefs(regulationStore);
const { user } = storeToRefs(authStore);
const fileFrame = ref(null);

//data and props ready, dom still not
onBeforeMount( () => {
    //when switching forms clear form in case any data has left
    if(!route.params.regulationId && regulation) {
        regulationStore.regulation = null;
    }
    if(route.params.regulationId){
        regulationStore.getRegulation(route.params.regulationId);
    }
});

//Get PDF or Hmtl file url to load in file preview
const url = computed(() => {
    if(!regulation.value){
        return null;
    }
    if(regulation.value.html_file) return baseApiUrl+regulation.value.html_file.file_url;
    else if(regulation.value.pdf_file) return baseApiUrl+regulation.value.pdf_file.file_url;
});

//Get file content
const htmlFileContent = computed(() => {
    return regulation.value ? regulation.value.html_file_content : null;
});

watch( regulation, (newVal, oldVal) => {
    if(newVal)
    {
        appTracking.mixpanelTrack('Regulation opened', {Regulation: regulation.value.name});
    }
});


//listen when iframe and regluation is loaded and insert html for file preview
/* watch( [fileFrame, regulation], ([newFileFrame, newRegulation]) => {
    //click on update form 
    if(newFileFrame && newRegulation)
    {
        if(regulation && fileFrame.value){
            const iframe = fileFrame.value.contentWindow.document
            iframe.open();
            iframe.write(regulation.value.html_doc);
            iframe.close();
        }
    }
}); */

const downloadFile = () => {
    regulationStore.downloadFile(regulation.value.id);
}

</script>

<style scoped lang="scss">
.regulation {
    min-height: calc(100vh - 300px);
    .fields {
        border-left: thick solid #1C7F44;
        border-left-width: 3px;
        padding-left: 7px;
        .field {
            margin-bottom: 3px;
            font-family: Inter;
            font-size: 15px;
            font-style: normal;
            font-weight: 500;
            line-height: 144%; /* 21.6px */
            letter-spacing: 0.15px;
            border-radius: 4px;
            background: #FFF;
            padding-left: 4px;
            .label {
                color: #6F6E6E;
            }
            .data {
                color: #1E1E1E; 
            }
        }
        .p-button {
            width: 100%;
            display: table;
            color: var(--50, #F8FAFC);
            font-family: Inter;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            margin-top: 10px;
            border-radius: 10px;
        }
    }
}
</style>