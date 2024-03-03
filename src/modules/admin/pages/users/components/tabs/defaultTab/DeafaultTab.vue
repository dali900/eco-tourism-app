<template>
    <div class="user-default-tab">
        <!-- <SubscriptionForm v-model="showSubscriptionForm" :id="props.user?.subscription?.id"></SubscriptionForm> -->
        <div class="grid">
            <div class="col-12 md:col-6 lg:col-5">
                <DefaultInfoPanel></DefaultInfoPanel>
            </div>
            <!-- <div class="col-12 md:col-6 lg:col-8">
                <div class="flex justify-content-end">
                    <PlanInfoPanel @onOpenTab="openTab($event)"></PlanInfoPanel>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import DefaultInfoPanel from "./DefaultInfoPanel.vue"
import PlanInfoPanel from "./PlanInfoPanel.vue"

const emit = defineEmits(['onOpenTab']);

const openTab = (payload) => {
    emit('onOpenTab', payload);
}

</script>

<style scoped>

</style>
