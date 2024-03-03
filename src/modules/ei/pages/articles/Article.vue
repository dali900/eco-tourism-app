<template>
    <div class="article p-3">
        <div v-if="!article">
            <div v-if="loading">Učitava se...</div>
            <div v-else>Nema podataka.</div>
        </div>
        <div class="article-content" v-if="article">
            <h2 v-if="!authStore.hasActivePlan()" class="pb-3">{{article.title}} <i class="pi pi-lock"></i> </h2>
            <div class="grid" v-if="authStore.hasActivePlan()">
                <div class="col-12 md:col-8 lg:col-8">
                    <FilePreview 
                        :url="url" 
                        :htmlFileContent="htmlFileContent"
                        :title="article.title"
                    />
                </div>
                <div class="col-12 md:col-4 lg:col-4">
                    <div class="flex flex-wrap">
                        <div v-if="article.title" class="field">
                            <div class="label">Naslov</div>
                            <div class="data">{{article.title}}</div>
                        </div>
                        <div v-if="article.article_type && article.article_type.parent_name" class="field">
                            <div class="label">Kategorija članka</div>
                            <div class="data">{{article.article_type.parent_name}}</div>
                        </div>
                        <div v-if="article.article_type" class="field">
                            <div class="label">Podkategorija članka</div>
                            <div class="data">{{article.article_type.name}}</div>
                        </div>
                        <div v-if="article.author" class="field">
                            <div class="label">Autor</div>
                            <div class="data">{{article.author}}</div>
                        </div>
                        <div v-if="article.publish_date" class="field">
                            <div class="label">Datum objavljivanja</div>
                            <div class="data">{{article.publish_date}}</div>
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
import { useArticleStore } from '@ei/stores/article'
import { useAuthStore } from '@/stores/auth';
import NoAccessContent from '../noAccess/NoAccessContent.vue';
import { useAppTracking } from '@/util/appTracking'
import FilePreview from '../../components/FilePreview.vue';
const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const router = useRouter();
const route = useRoute();
const toast = useToast();

const appTracking = useAppTracking();
const articleStore = useArticleStore();
const authStore = useAuthStore();
const { article, articlesTotal, loading } = storeToRefs(articleStore);
const { user } = storeToRefs(authStore);
const fileFrame = ref(null);
const filters = ref({
    'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
});

//data and props ready, dom still not
onBeforeMount( () => {
    //when switching forms clear form in case any data has left
    if(!route.params.articleId && article) {
        articleStore.article = null;
    }
    if(route.params.articleId){
        articleStore.getArticle(route.params.articleId);
    }
});

watch( article, (newVal, oldVal) => {
    if(newVal)
    {
        appTracking.mixpanelTrack('Article opened', {Article: article.value.title});
    }
});

//Get PDF or Hmtl file url to load in file preview
const url = computed(() => {
    if(!article.value){
        return null;
    }
    if(article.value.html_file) return baseApiUrl+article.value.html_file.file_url;
    else if(article.value.pdf_file) return baseApiUrl+article.value.pdf_file.file_url;
});

//Get file content
const htmlFileContent = computed(() => {
    return article.value ? article.value.html_file_content : null;
});


//listen when iframe and regluation is loaded and insert html for file preview
/* watch( [fileFrame, article], ([newFileFrame, newArticle]) => {
    //click on update form 
    if(newFileFrame && newArticle)
    {
        if(article && fileFrame.value){
            const iframe = fileFrame.value.contentWindow.document
            iframe.open();
            iframe.write(article.value.file_html_doc);
            iframe.close();
        }
    }
}); */



</script>

<style scoped lang="scss">
.article {
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