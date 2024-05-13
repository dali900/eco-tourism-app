<template>
    <div class="app-card">
        <div class="card-header">
            <div class="img-wrapper">
                <slot name="image"></slot>
            </div>
        </div>
        <div class="card-body">
            <h2 class="card-title"><slot name="title"></slot></h2>
            <div class="card-content">
                <slot name="content"></slot>
            </div>
        </div>
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.app-card {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
    height: 400px;
    width: 360px;
    -webkit-box-shadow: 1px 8px 19px -12px rgba(0,0,0,0.75);
    -moz-box-shadow: 1px 8px 19px -12px rgba(0,0,0,0.75);
    box-shadow: 1px 8px 19px -12px rgba(0,0,0,0.75);
    box-sizing: border-box;
    border-radius: 15px;
    overflow: hidden;
    transition: 0.1s linear;
    &:hover {
        box-shadow: 1px 5px 19px -3px rgba(15, 49, 53, 0.75);
    }
    .card-header {
        .img-wrapper {
            height: 200px;
            overflow: hidden;
            :deep(img) {
                max-width: 360px;
                height: auto;
            }
        }
    }
    .card-body {
        padding: 8px;
        flex: 1;
        .card-title {
            font-size: var(--font-size-content);
            font-weight: 600;
            margin-top: 4px;
            margin-bottom: 8px;
        }
        .card-content {
            max-width: 360px;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }
    .card-footer {
        padding: 8px 8px 4px 8px;
    }
}

</style>
