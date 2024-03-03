<template>
    <div class="basic-info flex flex-column">
        <UserForm v-model="showForm" :id="selectedUserId"></UserForm>
        <div class="user-logo flex justify-content-center mt-3">
            <div class="logo-container flex align-items-center justify-content-center">
                <i class="pi pi-user" style="font-size: 2.5rem"></i>
            </div>
        </div>
        <div v-if="user" class="user-info mt-3 flex flex-column align-items-center justify-content-center">
            <div class="data-content">
                {{ user.name }}
            </div>
            <div>
                {{ user.email }}
            </div>
            <table>
                <tr>
                    <td class="label">Rola:</td>
                    <td class="data">
                        <span class="data-content">
                            {{ user.role }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Kompanija:</td>
                    <td class="data">
                        <span class="data-content">
                            {{ user.company_name }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Pozicija:</td>
                    <td class="data">
                        <span class="data-content">
                            {{ user.position }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Telefon:</td>
                    <td class="data">
                        <span class="data-content">
                            {{ user.phone_number }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Kreiran:</td>
                    <td class="data">
                        <span class="data-content" :title="user.created_at_formated">
                            {{ user.created_at_date_formated }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Ažuriran:</td>
                    <td class="data">
                        <span class="data-content" :title="user.updated_at_formated">
                            {{ user.updated_at_date_formated }}
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="user-plan mt-3 flex justify-content-center">
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
                            <span class="data-content" :title="user.subscription.created_at_formated">{{
                                user.subscription.created_at_date_formated
                            }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Početak plana:</td>
                        <td class="data">
                            <span class="data-content" :title="user.subscription.start_datetime_formated">{{
                                user.subscription.start_date_formated
                            }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Ističe:</td>
                        <td class="data">
                            <span class="data-content" :title="user.subscription.end_datetime_formated">{{
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
                            <span class="data-content" :title="user.free_trial.created_at_formated">{{
                                user.free_trial.created_at_date_formated
                            }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Početak plana:</td>
                        <td class="data">
                            <span class="data-content" :title="user.free_trial.start_date_formated">{{
                                user.free_trial.start_date_formated
                            }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">Ističe:</td>
                        <td class="data">
                            <span class="data-content" :title="user.free_trial.end_date_formated">{{
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
                
            </div>
            <div v-else>
                <div class="">
                    Korisnik nema plan
                </div>
                <div>
                    <Button
                        label="Kreiraj pretplatu"
                        class="p-button-text p-button-sm"
                        @click="openSubscriptionTab"
                    />
                </div>
                <div>
                    <Button
                        label="Kreiraj free trial"
                        class="p-button-text p-button-sm"
                        @click="openFreeTrialTab"
                    />
                </div>
            </div>
        </div>
        <div class="flex mt-3 justify-content-center">
            <div class="flex justify-content-end">
                <Button
                    icon="pi pi-pencil"
                    class="edit-plan p-button-rounded p-button-text"
                    @click="openUpdateForm"
                />
            </div>
        </div>
        <div class="flex justify-content-center">
            <Button v-if="user" 
                icon="pi pi-trash" 
                severity="danger" 
                class="delete-user p-button-text p-button-danger p-button-rounded delete-subscription-plan" 
                title="Obriši plan"
                @click="confirmDeleteUser()"/>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from 'pinia';
import { useUserStore } from '@admin/stores/user'
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from 'vue-router'
import { useToast } from "primevue/usetoast";
import UserForm from './UserForm.vue'

const emit = defineEmits(['openSubscriptionTab', 'openFreeTrialTab', 'onOpenTab']);

const userStore = useUserStore();
const { user, loading } = storeToRefs(userStore);
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const showForm = ref(false);
const selectedUserId = ref(null);

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

const confirmDeleteUser = () => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteUser(user.value.id);
        },
        //no
        reject: () => {},
        //dialog closed
        onHide: () => {}
    });
};

const openUpdateForm = () => {
    selectedUserId.value = user.value.id;
    showForm.value = true;
}

const deleteUser = (id) => {
    userStore.deleteUserProfile(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Korisnik je obrisan.', life: 3000});
            router.go(-1);
        })
        .catch((e) => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

</script>

<style lang="scss" scoped>
.basic-info {
    font-size: 14px;
    .delete-user, .edit-plan {
        visibility: hidden;
    }
}
.basic-info:hover .delete-user,
.basic-info:hover .edit-plan {
    visibility: visible;
}
.user-logo {
    .logo-container {
        background-color: white;
        border-radius: 50px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        width: 100px;
        height: 100px;
    }
}
td .label{
    width: 30%;
}
td .data{
    width: 70%;
}
.user-plan .p-card-title {
    font-size: 18px;
    font-weight: 500;
}
.label {
    text-align: right;
}
.data-content {
    font-weight: 600;
}
.user-plan .active-plan {
    color: green;
}
.user-plan .inactive-plan {
    color: #5d0c28;
}
</style>