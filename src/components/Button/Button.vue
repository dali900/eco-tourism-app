<template>
    <button
        :class="{ loading: loading }"
        class="app-btn"
        @click="handleClick"
        :disabled="loading"
    >
        <span v-if="!loading">
            <slot>{{ buttonText }}</slot>
        </span>
        <span v-else>Loading...</span>
    </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    buttonText: {
        type: String,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const { emit } = defineEmits();

const handleClick = () => {
    emit("click");
};
</script>

<style scoped>
/* Add your button styles here */
.loading {
    cursor: not-allowed;
    opacity: 0.7;
}
.app-btn {
    background-color: var(--color-turquoise);
    border-color: var(--color-turquoise);
    border-radius: 10px;
    height: 40px;
    width: 140px;
    text-align: center;
    color: var(--color-white);
    font-size: 1rem;
    font-family: var(--font-family);
    font-weight: normal;
    span {
        color: var(--color-white);
    }
}
.app-btn:hover {
    background-color: var(--color-turquoise2);
    border-color: var(--color-turquoise2);
}
</style>
