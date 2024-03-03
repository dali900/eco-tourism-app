<template>
    <div class="user-profile-card p-card pl-1 pr-2">
        <!-- Header -->
        <div class="flex justify-content-between mb-1" v-if="profile">
            <router-link :to="{ name: 'UserOverview', params: { userId: profile.user_id }}" class="resource-link">
                <div class="user-logo flex">
                    <div class="logo-container flex align-items-center justify-content-center">
                        <i class="pi pi-user"></i>
                    </div>
                    <div class="user-name align-self-center ml-1">
                        {{ profile.user_name }} 
                    </div>
                </div>
            </router-link>
            <div>
                <div v-if="profile.subscription_start_date && !isActiveFreeTrial">
                    Plaćeni
                    <i
                        class="pi pi-money-bill"
                        :class="colorSubscriptionStatus"
                    ></i>
                </div>
                <div v-else-if="profile.free_trial_start_date">
                    Free trial
                    <i
                        class="pi pi-stopwatch"
                        :class="colorFreeTrialStatus"
                    ></i>
                </div>
                <div v-else>
                    
                </div>
            </div>
        </div>
        <hr style="border-top: 1px solid lightgrey">
        <!-- Body -->
        <div class="flex justify-content-between">
            <div class="">
                <div>
                    <small>{{ profile.email }}</small>
                </div>
                <div>
                    rola: {{ profile.role }}
                </div>
                <div>
                    kreiran: {{ profile.created_at_date_formated }}
                </div>
            </div>
            <div class="text-right">
                <div v-if="profile.subscription_start_date && !isActiveFreeTrial">
                    <small>plan:  {{ profile.subscription_plan_name }}</small><br>
                    ističe: {{ profile.subscription_end_date_formated }} <br>
                    status: {{ profile.subscription_status }}
                </div>
                <div v-else-if="profile.free_trial_start_date">
                    <small>plan:  {{ profile.free_trial_plan_name }}</small> <br> 
                    ističe: {{ profile.free_trial_end_date_formated }} <br>
                    status: {{ profile.free_trial_status }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    profile: {
        default: null
    }
});

const isActiveSubscritpion = computed( 
    () => props.profile && props.profile.active_subscription ? true : false
);

const isActiveFreeTrial = computed( 
    () => props.profile && props.profile.active_free_trial ? true : false
);

const colorSubscriptionStatus = computed( 
    () => isActiveSubscritpion.value ? 'active-plan' : 'inactive-plan'
);

const colorFreeTrialStatus = computed( 
    () => isActiveFreeTrial.value ? 'active-plan' : 'inactive-plan'
);

</script>

<style lang="scss" scoped>
.user-profile-card {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    .user-logo {
        .logo-container {
            background-color: white;
            /* border-radius: 15px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */
            width: 25px;
            height: 25px;
            font-size: 12px;
        }
    }
}
.user-name {
    font-weight: 500;
}
.active-plan {
    color: green;
}
.inactive-plan {
    color: #5d0c28;
}
</style>