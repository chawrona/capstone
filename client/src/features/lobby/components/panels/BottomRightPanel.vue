<script setup>
import CopyUrl from "../../../../components/common/CopyUrl.vue";
</script>

<template>
    <div class="panel bottom-right">
        <CopyUrl />
    </div>
</template>

<style scoped>
.bottom-right {
    bottom: 0;
    right: 0;

    @media (width < 768px) {
        order: 2;
    }
}
</style>
