<template>
    <div class="see-more-btn">
        {{title}}
        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.47552L7.05 7.49953L1 13.5245" stroke="#1C7F44" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        default: ""
    }
});
</script>

<style lang="scss">
.see-more-btn {
    display: flex;
    height: 31px;
    padding: 4px 16px;
    align-items: flex-start;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 10px;
    border: 3px solid #1C7F44;
    background: #ffffff;
    color: #1C7F44;
    text-align: center;
    /* Body Medium/Body Medium, 600 */
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
}
</style>