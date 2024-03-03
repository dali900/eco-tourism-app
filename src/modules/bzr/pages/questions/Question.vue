<template>
    <div class="question p-3">
        <div v-if="!question">
            <div v-if="loading">Učitava se...</div>
            <div v-else>Nema podataka.</div>
        </div>
        <div class="question-content" v-if="question">
            <h2 v-if="!authStore.hasActivePlan()" class="pb-3">{{question.title}} <i class="pi pi-lock"></i> </h2>
            <div class="grid" v-if="authStore.hasActivePlan()">
                <div v-if="question.title" class="field col-12">
                    <div class="label">Naslov</div>
                    <div class="data" v-html="question.title"></div>
                </div>
                <div v-if="question.question" class="field col-12">
                    <div class="label">Pitanje</div>
                    <div class="data" v-html="question.question"></div>
                </div>
                <div v-if="question.answer" class="field col-12">
                    <div class="label">Odgovor</div>
                    <div class="data" v-html="question.answer"></div>
                </div>
                <div v-if="question.author" class="field col-12">
                    <div class="label">Autor</div>
                    <div class="data">{{question.author}}</div>
                </div>
                <div v-if="question.publish_date" class="field col-12">
                    <div class="label">Datum objavljivanja</div>
                    <div class="data">{{question.publish_date}}</div>
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
import { ref, reactive, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useQuestionStore } from '@bzr/stores/question'
import { useAuthStore } from '@/stores/auth';
import NoAccessContent from '../noAccess/NoAccessContent.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const questionStore = useQuestionStore();
const authStore = useAuthStore();
const { question, questionsTotal, loading } = storeToRefs(questionStore);
const { user } = storeToRefs(authStore);
const fileFrame = ref(null);

//data and props ready, dom still not
onBeforeMount( () => {
    //when switching forms clear form in case any data has left
    if(!route.params.questionId && question) {
        questionStore.question = null;
    }
    if(route.params.questionId){
        questionStore.getQuestion(route.params.questionId);
    }
});

</script>

<style scoped lang="scss">
.question {
    min-height: calc(100vh - 300px);
    .label {
        /* color: #76bdffcc; */
        color: var(--text-color-secondary);
        padding-bottom: 10px;
    }
    .preview iframe {
        width: 100%;
        min-height: calc(100vh - 250px);
        background-color: white;
    }
    .preview iframe {
        border: none;
    }
}
</style>