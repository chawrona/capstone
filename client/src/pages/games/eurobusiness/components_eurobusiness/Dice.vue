<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
    color: { default: "#000000", type: String },
    colorBackground: { default: "#ffffff", type: String },
    newValue: { default: 1, type: Number },
    size: { default: 65, type: Number },
    trigger: { default: 1, type: Number },
});

const lastValue = ref(1);
const animationClasses = ref([]);

const dotPositions = {
    1: [[50, 50]],
    2: [
        [20, 20],
        [80, 80],
    ],
    3: [
        [20, 20],
        [50, 50],
        [80, 80],
    ],
    4: [
        [20, 20],
        [20, 80],
        [80, 20],
        [80, 80],
    ],
    5: [
        [20, 20],
        [20, 80],
        [50, 50],
        [80, 20],
        [80, 80],
    ],
    6: [
        [20, 20],
        [20, 50],
        [20, 80],
        [80, 20],
        [80, 50],
        [80, 80],
    ],
};

const styles = computed(() => ({
    dotMargin: -props.size * 0.1,
    dotRadius: props.size * 0.2,
    dotShadow: props.size * 0.02,
    dotSize: props.size * 0.2,
    sideRadius: props.size * 0.08,
    translateZ: props.size * 0.5,
}));

watch(
    () => props.trigger,
    () => {
        if (lastValue.value === props.newValue) {
            let firstRoll;
            do {
                firstRoll = Math.floor(Math.random() * 6 + 1);
            } while (firstRoll === props.newValue);

            animationClasses.value = [`show-${firstRoll}`];
            setTimeout(() => {
                animationClasses.value = [`show-${props.newValue}`];
            }, 250);
        } else {
            animationClasses.value = [`show-${props.newValue}`];
        }

        lastValue.value = props.newValue;
    },
);
</script>

<template>
    <div
        class="dice-container"
        :style="{ width: `${size}px`, height: `${size}px` }"
    >
        <div
            class="dice"
            :class="animationClasses"
            :style="{ width: `${size}px`, height: `${size}px` }"
        >
            <div
                v-for="sideNum in 6"
                :key="sideNum"
                class="side"
                :class="`side-${sideNum}`"
                :style="{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: `${styles.sideRadius}px`,
                    backgroundColor: colorBackground,
                    borderColor: colorBackground
                }"
            >
                <div
                    v-for="(pos, idx) in dotPositions[sideNum]"
                    :key="idx"
                    class="dot"
                    :style="{
                        top: `${pos[0]}%`,
                        left: `${pos[1]}%`,
                        width: `${styles.dotSize}px`,
                        height: `${styles.dotSize}px`,
                        marginTop: `${styles.dotMargin}px`,
                        marginLeft: `${styles.dotMargin}px`,
                        backgroundColor: color,
                        borderRadius: `${styles.dotRadius}px`,
                        boxShadow: `inset ${styles.dotShadow}px ${styles.dotShadow}px rgba(0,0,0,0.3)`,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.dice-container {
    perspective: 1000px;
}

.dice {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s;
}

.dot {
    position: absolute;
}

.side {
    position: absolute;
    border: 1px solid #e5e5e5;
    background-color: #fff;
}

.side-1 {
    transform: translateZ(v-bind('styles.translateZ + "px"'));
}

.side-2 {
    transform: rotateY(180deg) translateZ(v-bind('styles.translateZ + "px"'));
}

.side-3 {
    transform: rotateY(-90deg) translateZ(v-bind('styles.translateZ + "px"'));
}

.side-4 {
    transform: rotateX(90deg) translateZ(v-bind('styles.translateZ + "px"'));
}

.side-5 {
    transform: rotateX(-90deg) translateZ(v-bind('styles.translateZ + "px"'));
}

.side-6 {
    transform: rotateY(90deg) translateZ(v-bind('styles.translateZ + "px"'));
}

.show-1 {
    transform: rotateX(720deg) rotateZ(-720deg);
}

.show-2 {
    transform: rotateX(-900deg) rotateZ(1080deg);
}

.show-3 {
    transform: rotateY(810deg) rotateZ(720deg);
}

.show-4 {
    transform: rotateX(-810deg) rotateZ(-1080deg);
}

.show-5 {
    transform: rotateX(450deg) rotateZ(-720deg);
}

.show-6 {
    transform: rotateY(-450deg) rotateZ(-1440deg);
}
</style>
