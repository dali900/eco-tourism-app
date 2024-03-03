<script setup>

</script>

<template>
    <div class="plans">
        <SubscriptionPlans></SubscriptionPlans>
        <FreeTrialPlans></FreeTrialPlans>
    </div>
</template>

<script setup>
import SubscriptionPlans from './subscriptionPlans/SubscriptionPlans.vue'
import FreeTrialPlans from './freeTrialPlans/FreeTrialPlans.vue'
</script>

<style scoped>
.plans {
    width: 100%;
}

</style>