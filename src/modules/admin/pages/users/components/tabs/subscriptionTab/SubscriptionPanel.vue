<template>
    <Panel :header="subscriptionHeaderTitle" class="subscription-panel a-shadow">
        <div class="user-form">
            <div class="field flex flex-column">
                <label for="subscription_plan_id" :class="{'p-error': formErrors.subscription_plan_id}">Plan *</label>
                <div>
                    <Dropdown v-model="form.subscription_plan_id" 
                        placeholder="Izaberi model plan" 
                        inputId="subscription_plan_id"
                        optionLabel="name" 
                        optionValue="id" 
                        :options="subscriptionPlans" 
                        :showClear="true" 
                        :class="{'p-invalid': formErrors.subscription_plan_id}"
                    />
                </div>
                <small class="p-error">{{formErrors.interval}}</small>
            </div>
            <div class="field flex flex-column">
                <label for="start_date" :class="{'p-error': formErrors.start_date}">Početak</label>
                <div>
                    <Calendar inputId="start_date" v-model="form.start_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.start_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                </div>
                <small class="p-error">{{formErrors.start_date}}</small>
            </div>
            <div class="field flex flex-column">
                <label for="end_date" :class="{'p-error': formErrors.end_date}">Ističe</label>
                <div>
                    <Calendar inputId="end_date" v-model="form.end_date_formated" dateFormat="dd.mm.yy." :inputClass="formErrors.end_date ? 'p-invalid' : ''" @keyup.enter="save" class="calendar-field"/>
                </div>
                <small class="p-error">{{formErrors.end_date}}</small>
            </div>
            <div class="flex flex-column">
                <div class="field flex flex-column">
                    <div>
                        <Checkbox
                            inputId="active"
                            v-model="form.active"
                            :trueValue="1"
                            :falseValue="0"
                            :binary="true"
                            :class="{ 'p-invalid': formErrors.active }"
                        />&nbsp;
                        <label for="active">Aktivan</label>
                    </div>
                    <small id="active-help" class="p-error">{{
                        formErrors.active
                    }}</small>
                </div>
            </div>
            <div>
                <small class="p-error">{{ formErrors.default }}</small>
            </div>
            <div v-if="subscription">
                <div>
                    <small>Ističe: {{ subscription.end_datetime_formated }}</small>
                </div>
                <div>
                    <small>Preostali dani: {{ subscription.remaining_days }}</small>
                </div>
                <div>
                    <small>Status: {{ subscription.status }}</small>
                </div>
            </div>
            <div class="flex justify-content-between mt-2">
                <Button
                    :label="subscription ? 'Ažuriraj' : 'Sačuvaj'"
                    :loading="loading"
                    @click="save"
                    icon="pi pi-save"
                />
                <Button v-if="subscription" 
                    icon="pi pi-trash" 
                    severity="danger" 
                    class="p-button-text p-button-danger p-button-rounded delete-subscription-plan" 
                    title="Obriši plan"
                    @click="confirmDeleteSubscription(subscription.id)"/>
            </div>
        </div>
    </Panel>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast";
import { useSubscriptionStore } from '@admin/stores/subscription'
import { useUserStore } from "@admin/stores/user";
import { useConfirm } from "primevue/useconfirm";
import Panel from 'primevue/panel';
import dateTool from '@/util/dateTool'

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore)
const { subscriptionPlans, loading } = storeToRefs(subscriptionStore)
const confirm = useConfirm();
const toast = useToast();

const form = reactive({
    user_id: "",
    subscription_plan_id: "",
    start_date: "",
    start_date_formated: "",
    end_date: "",
    end_date_formated: "",
    active: "",
});

onBeforeMount( () => {
    subscriptionStore.getSubscriptionPlans();
});

const subscription = computed( () => user.value?.subscription );
const subscriptionHeaderTitle = computed( () => subscription?.value ? "Pretplata" : "Kreiraj pretplatu");

//formData
watch( subscription, (newVal, oldVal) => {
    setFormData(newVal);
});

watch( user, (newVal, oldVal) => {
    if(user.value) {
        form.user_id = user.value.id
    }
});

const formErrors = reactive({
    user_id: "",
    subscription_plan_id: "",
    start_date: "",
    end_date: "",
    active: "",
});

const setFormData = (formData) => {
    if(formData){
        for (const field in form) {
            if (subscription.value.hasOwnProperty(field)) {
                const formDataField = subscription.value[field];
                form[field] = formDataField;
            }
        }
    } 
}

const clearForm = () => {
    form.subscription_plan_id = "";
    form.start_date = "";
    form.start_date_formated = "";
    form.end_date = "";
    form.end_date_formated = "";
    form.active = "";
    clearErrors();
};

const clearErrors = () => {
    formErrors.user_id = "";
    formErrors.subscription_plan_id = "";
    formErrors.start_date = "";
    formErrors.end_date = "";
    formErrors.active = "";
    formErrors.default = "";
}

const formateDateFields = () => {
    form.start_date = dateTool.toDbFormat(form.start_date_formated);
    form.end_date = dateTool.toDbFormat(form.end_date_formated);
}

const save = async () => {
    clearErrors();
    formateDateFields();
    //Update
    if(subscription.value)
    {
        subscriptionStore.update(subscription.value.id, form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Pretplata je ažurirana!', detail: form.title, life: 3000});
                user.value.subscription = responseData.subscription;
            })
            .catch(() => {
                toast.add({severity:'error', summary: 'Greška tokom ažuriranja.', detail: form.title, life: 3000});
            })
    } 
    //Create
    else 
    {
        subscriptionStore.create(form, formErrors)
            .then((responseData) => {
                toast.add({severity:'success', summary: 'Kreirana nova pretplata!', detail: form.title, life: 3000});
                user.value.subscription = responseData.subscription;
                userStore.deactivateFreeTrial();
            })
            .catch((e) => {
                toast.add({severity:'error', summary: 'Greška tokom kreiranja.', detail: form.title, life: 3000});
            })
    }
};

const confirmDeleteSubscription = (id) => {
    confirm.require({
        message: 'Da li želite da nastavite?',
        header: 'Brisanje',
        icon: 'pi pi-exclamation-triangle',
        //yes
        accept: () => {
            deleteSubscription(id);
        },
        //no
        reject: () => {},
        //dialog closed
        onHide: () => {}
    });
};

const deleteSubscription = (id) => {
    subscriptionStore.delete(id)
        .then(() => {
            toast.add({severity:'success', summary: 'Plan obrisan.', life: 3000});
            user.value.subscription = null;
            clearForm();
        })
        .catch(() => {
            toast.add({severity:'error', summary: 'Greška tokom brisanja.', life: 3000});
        })
}

</script>

<style scoped>
.calendar-field {
    width: 100%;
}
.delete-subscription-plan {
    visibility: hidden;
}
.subscription-panel:hover .delete-subscription-plan {
    visibility: visible;
}
.delete-free-trial-plan {
    visibility: hidden;
}
.free-trial-panel:hover .delete-free-trial-plan {
    visibility: visible;
}
.p-dropdown.p-component.p-inputwrapper {
    width: 100%;
}
</style>