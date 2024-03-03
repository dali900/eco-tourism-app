<template>
    <div class="new-law p-3">
        <div class="new-law-content" >
            <div class="grid">
                <div class="field col-12 md:col-12 lg:col-12">
                    <div class="file-preview">
                        <!-- <iframe ref="fileFrame" src="/bzr_new.html"></iframe> -->
                        <FilePreview 
                            url="/bzr_new.html" 
                            :htmlFileContent="htmlFileContent"
                            :title="''"
                        />
                    </div>
                </div>
                <div class="field col-12 md:col-12 lg:col-6">
                    <div class="other-informations">
                        <router-link :to="{ name: 'Contact'}">
                            <div class="img-container">
                                <!-- <img alt="news" src="/bzr_new.png"> -->
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeMount, onUnmounted, computed } from 'vue'
import FilePreview from '@/components/FilePreview.vue';

const htmlFileContent = ref(null);

onBeforeMount( () => {
    fetch('/bzr_new.html')
    .then(response => response.text())
    .then(text => htmlFileContent.value = text);
})

</script>

<style scoped lang="scss">
.new-law {
    img {
        height: 100%;
        max-width: 600px;
    }
}
.file-preview {
    min-height: calc(100vh - 210px);
    iframe {
        width: 100%;
        min-height: calc(100vh - 210px);
        background-color: white;
        border: none;
    }
}
.other-informations {
    
}
</style>