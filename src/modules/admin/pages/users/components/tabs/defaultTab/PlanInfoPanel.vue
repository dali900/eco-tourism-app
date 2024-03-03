<template>
    <Panel class="user-plan-card a-shadow" header="Korisnički plan">
        <div v-if="user?.subscription">
            <table>
                <tr>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td class="label">Tip:</td>
                    <td class="data">
                        <span class="data-content">
                            Plaćeni
                            <i
                                class="pi pi-money-bill"
                                :class="colorSubscriptionStatus"
                            ></i>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Naziv:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.subscription.plan.name
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Kreiran:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.subscription.created_at_date_formated
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Početak plana:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.subscription.start_date_formated
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Ističe:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.subscription.end_date_formated
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Preostali dani:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.subscription.remaining_days
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Status:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.subscription.status
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Aktivan:</td>
                    <td class="data">
                        <span class="data-content">
                            <i
                                v-if="isActiveSubscritpion"
                                class="pi pi-check"
                                :class="colorSubscriptionStatus"
                            ></i>
                            <i
                                v-else
                                class="pi pi-times"
                                :class="colorSubscriptionStatus"
                            ></i>
                        </span>
                    </td>
                </tr>
            </table>
            <div class="flex justify-content-end">
                <Button
                    icon="pi pi-pencil"
                    class="edit-plan p-button-rounded p-button-text"
                    @click="openSubscriptionTab"
                />
            </div>
        </div>
        <div v-else-if="user?.free_trial">
            <table>
                <tr>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td class="label">Tip:</td>
                    <td class="data">
                        <span class="data-content">
                            Free trial
                            <i
                                class="pi pi-stopwatch"
                                :class="colorFreeTrialStatus"
                            ></i>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Naziv:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.free_trial.plan.name
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Kreiran:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.free_trial.created_at_date_formated
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Početak plana:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.free_trial.start_date_formated
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Ističe:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.free_trial.end_date_formated
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Preostali dani:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.free_trial.remaining_days
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Status:</td>
                    <td class="data">
                        <span class="data-content">{{
                            user.free_trial.status
                        }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Aktivan:</td>
                    <td class="data">
                        <span class="data-content">
                            <i
                                v-if="isActiveFreeTrial"
                                class="pi pi-check"
                                :class="colorFreeTrialStatus"
                            ></i>
                            <i
                                v-else
                                class="pi pi-times"
                                :class="colorFreeTrialStatus"
                            ></i>
                        </span>
                    </td>
                </tr>
            </table>
            <div class="flex justify-content-end">
                <div class="flex justify-content-end">
                    <Button
                        icon="pi pi-pencil"
                        class="edit-plan p-button-rounded p-button-text"
                        @click="openFreeTrialTab"
                    />
                </div>
            </div>
        </div>
        <div v-else>
            <div class="ml-3">
                <small>Korisnik nema plan</small>
            </div>
            <div>
                <Button
                    label="Kreiraj pretplatu"
                    class="p-button-text"
                    @click="openSubscriptionTab"
                />
            </div>
            <div>
                <Button
                    label="Kreiraj free trial"
                    class="p-button-text"
                    @click="openFreeTrialTab"
                />
            </div>
        </div>
    </Panel>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from 'pinia';
import { useUserStore } from '@admin/stores/user'

const emit = defineEmits(['openSubscriptionTab', 'openFreeTrialTab', 'onOpenTab']);

const userStore = useUserStore();
const { user, loading } = storeToRefs(userStore);

const isActiveSubscritpion = computed( 
    () => user.value && user.value.subscription ? user.value.subscription.active : false
);

const isActiveFreeTrial = computed( 
    () => user.value && user.value.free_trial ? user.value.free_trial.active : false
);

const colorSubscriptionStatus = computed( 
    () => isActiveSubscritpion.value ? 'active-plan' : 'inactive-plan'
);

const colorFreeTrialStatus = computed( 
    () => isActiveFreeTrial.value ? 'active-plan' : 'inactive-plan'
);

const openSubscriptionTab = () => {
    emit('onOpenTab', 1);
}
const openFreeTrialTab = () => {
    emit('onOpenTab', 2);
}

</script>

<style lang="scss" scoped>
.user-plan-card {
    min-width: 300px
}
.user-plan-card .p-card-title {
    font-size: 18px;
    font-weight: 500;
}
.user-plan-card .label {
    text-align: right;
}
.user-plan-card .data-content {
    font-weight: 600;
}
.user-plan-card .active-plan {
    color: green;
}
.user-plan-card .inactive-plan {
    color: #5d0c28;
}
.user-plan-card .edit-plan {
    visibility: hidden;
}
.user-plan-card:hover .edit-plan {
    visibility: visible;
}
</style>
