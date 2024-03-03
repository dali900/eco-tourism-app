<template>
    <div class="file-preview">
        <Card>
            <template #title>
                <div class="flex justify-content-between align-items-center">
                    <div class="header-left">{{title}}</div>
                    <div class="header-right flex" v-if="htmlFileContent">
                        <div class="flex align-items-center">
                            <i class="pi pi-search" v-tooltip.left="'Za pretragu pritisnite Ctrl + F ili Cmd + F (⌘+F)'"></i>
                        </div>
                        <Button icon="pi pi-print" 
                            class="p-button-rounded p-button-text p-button-plain" 
                            label=""
                            v-tooltip.right="'Štampaj'"
                            :loading="printLoading" 
                            :disabled="printLoading" 
                            @click="printHtmlBtnClick"
                        />
                    </div>
                </div>
            </template>
            <template #content>
                <small v-if="!url">Pregled fajla trenutno nije dostupan.</small>
                <div class="file-preview">
                    <iframe v-if="url" ref="fileFrame" :src="url" :key="url"></iframe>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref } from 'vue'

    const props = defineProps({
        url: {
            default: ""
        },
        htmlFileContent: {
            default: ""
        },
        title: {
            default: ""
        }
    });

    const printLoading = ref(false);

    const printHtmlBtnClick = () => {
        prepareHtmlForPrint()
        //wait to load all images
        setTimeout( () => {
            window.print();
            printLoading.value = false;
        }, 1000)
    }

    const prepareHtmlForPrint = () => {
        printLoading.value = true;
        const printContainer = document.querySelector('.print-container');
        if(printContainer) {
            printContainer.innerHTML = props.htmlFileContent;
        }
    }

    onMounted( () => {
        //if the users preses Ctrl + P
        window.addEventListener('beforeprint', prepareHtmlForPrint);
        window.addEventListener('afterprint', afterHtmlPrint);
    })

    onUnmounted( () => {
        window.removeEventListener('beforeprint', prepareHtmlForPrint);
        window.removeEventListener('afterprint', afterHtmlPrint);
    })

    const afterHtmlPrint = () => {
        printLoading.value = false;
        const printContainer = document.querySelector('.print-container');
        if(printContainer) {
            printContainer.innerHTML = "";
        }
    }
</script>

<style lang="scss">
    .file-preview {
        min-height: calc(100vh - 210px);
        iframe {
            width: 100%;
            min-height: calc(100vh - 210px);
            background-color: white;
            border: none;
        }
    }
</style>