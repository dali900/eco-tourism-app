<template>
    <div class="about">
        About
    </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast";


</script>

<style scoped>
.about {
    height: 80px;
    width: 600px;
    border: 1px solid red;
}
</style>