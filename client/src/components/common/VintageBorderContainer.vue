<script setup>
// padding: grubość od zewnętrznego borderu to wewnętrznego
const props = defineProps([
    "image",
    "color",
    "padding",
    "background",
    "imageHeight",
]);
</script>

<template>
    <div
        class="vintage-border-container"
        :style="`--border-padding: ${props.padding}; --border-color: ${props.color}; --bg-color: ${props.background}; --image-height: ${props.imageHeight}`"
    >
        <img :src="props.image" alt="" class="border-corner top-left" />
        <img :src="props.image" alt="" class="border-corner top-right" />
        <img :src="props.image" alt="" class="border-corner bottom-left" />
        <img :src="props.image" alt="" class="border-corner bottom-right" />
        <slot />
    </div>
</template>

<style scoped>
.vintage-border-container {
    position: relative;
    --image-translation: calc(1rem / 16 * var(--image-height));
    --minimum-dimensions: calc(
        3rem * var(--image-height) + 1rem * var(--border-padding)
    );
    min-height: var(--minimum-dimensions);
    height: 100%;
    min-width: var(--minimum-dimensions);
    border: 3px solid var(--border-color);
    color: black;
    padding: calc(var(--border-padding) * 0.5rem);

    &::before {
        content: "";

        position: absolute;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        inset: calc(var(--border-padding) * -0.5rem);
    }

    &::after {
        content: "";

        position: absolute;
        border: 2px solid var(--border-color);
        inset: calc(var(--border-padding) * 0.5rem);
    }
}

.border-corner {
    position: absolute;
    width: calc(var(--image-height) * 1rem);
    z-index: 10;
    /* background-color: var(--bg-color); */
    /* background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-color) 54%, transparent 54%, transparent 100%); */
}

.top-left {
    top: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    left: calc(var(--border-padding) * 0.5rem - var(--image-translation));
}

.top-right {
    top: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    right: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    transform: rotate(90deg);
}

.bottom-left {
    bottom: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    left: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    transform: rotate(270deg);
}

.bottom-right {
    bottom: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    right: calc(var(--border-padding) * 0.5rem - var(--image-translation));
    transform: rotate(180deg);
}
</style>
