<template>
    <div class="document p-3">
        <div v-if="!document">
            <div v-if="loading">Učitava se...</div>
            <div v-else>Nema podataka.</div>
        </div>
        <div class="document-content" v-if="document">
            <h2 class="pb-3" v-if="!authStore.hasActivePlan()">{{document.title}} <i class="pi pi-lock"></i> </h2>
            <div class="grid" v-if="authStore.hasActivePlan()">
                <div class="col-12 md:col-8 lg:col-8">
                    <FilePreview 
                        :url="url" 
                        :htmlFileContent="htmlFileContent"
                        :title="document.title"
                    />
                </div>
                <div class="col-12 md:col-4 lg:col-4">
                    <div class="flex flex-wrap">
                        <template v-if="document.document_type && document.document_type.ancestorsAndSelf">
                            <div v-if="document.document_type.ancestorsAndSelf[0]" class="field">
                                <div class="label">Tip modela akta</div>
                                <div class="data">{{document.document_type.ancestorsAndSelf[0].name}}</div>
                            </div>
                            <div v-if="document.document_type.ancestorsAndSelf[1]" class="field">
                                <div class="label">Vrsta</div>
                                <div class="data">{{document.document_type.ancestorsAndSelf[1].name}}</div>
                            </div>
                            <div v-if="document.document_type.ancestorsAndSelf[2]" class="field">
                                <div class="label">Podvrsta</div>
                                <div class="data">{{document.document_type.ancestorsAndSelf[2].name}}</div>
                            </div>
                        </template>
                        <div v-if="document.title" class="field">
                            <div class="label">Naziv</div>
                            <div class="data">{{document.title}}</div>
                        </div>
                        <div v-if="document.author" class="field">
                            <div class="label">Autor</div>
                            <div class="data">{{document.author}}</div>
                        </div>
                        <div v-if="document.comment" class="field">
                            <div class="label">Napomena</div>
                            <div class="data">{{document.comment}}</div>
                        </div>
                        <div v-if="document.publish_date" class="field">
                            <div class="label">Datum objavljivanja</div>
                            <div class="data">{{document.publish_date_formated}}</div>
                        </div>
                        <div class="col-12">
                            <Button v-if="document.download_file" label="Preuzmi" icon="pi pi-download" class="mr-2" @click="downloadFile()"/>
                            <Button v-else disabled label="Dokument trenutno nije dostupan za preuzimanje" icon="pi pi-download" class="p-button-secondary"></Button>
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
import { useDocumentStore } from '@ei/stores/document'
import { useAuthStore } from '@/stores/auth';
import NoAccessContent from '../noAccess/NoAccessContent.vue';
import { useAppTracking } from '@/util/appTracking'
import FilePreview from '../../components/FilePreview.vue';
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const router = useRouter();
const route = useRoute();
const toast = useToast();

const appTracking = useAppTracking();
const documentStore = useDocumentStore();
const authStore = useAuthStore();
const { document, documentsTotal, loading } = storeToRefs(documentStore);
const { user } = storeToRefs(authStore);
const fileFrame = ref(null);
const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});

watch( document, (newVal, oldVal) => {
    if(newVal)
    {
        appTracking.mixpanelTrack('Document opened', {Document: document.value.title});
    }
});

//data and props ready, dom still not
onBeforeMount( () => {
    //when switching forms clear form in case any data has left
    if(!route.params.documentId && document) {
        documentStore.document = null;
    }
    if(route.params.documentId){
        documentStore.getDocument(route.params.documentId);
    }
});

//Get PDF or Hmtl file url to load in file preview
const url = computed(() => {
    if(!document.value){
        return null;
    }
    if(document.value.html_file) return baseApiUrl+document.value.html_file.file_url;
    else if(document.value.pdf_file) return baseApiUrl+document.value.pdf_file.file_url;
});

//Get file content
const htmlFileContent = computed(() => {
    return document.value ? document.value.html_file_content : null;
});

const downloadFile = () => {
    documentStore.downloadFile(document.value.id);
}

</script>

<style scoped lang="scss">
.document {
    min-height: calc(100vh - 300px);
    .label {
        /* color: #76bdffcc; */
        color: var(--text-color-secondary);
    }
    .field {
        margin-right: 1rem;
    }
}
</style>