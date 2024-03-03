<template>
    <div class="home">
        HOME
        <Button v-if="user" @click="logout">Logout</Button>
        <div>Loading: {{loading}}</div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const authStore = useAuthStore();
const { loading, user } = storeToRefs(authStore);

const logout = async () => {
    await authStore.logout();
    router.push({name: 'Login'});
}

</script>

<style>

</style>