<script setup>
import { ref, watch } from "vue";

const props = defineProps(["trigger", "newValue"]);

const lastValue = ref(1);

const animationClasses = ref([]);

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
    <div id="dice1" class="dice dice-one" :class="animationClasses">
        <div id="dice-one-side-one" class="side one">
            <div class="dot one-1"></div>
        </div>
        <div id="dice-one-side-two" class="side two">
            <div class="dot two-1"></div>
            <div class="dot two-2"></div>
        </div>
        <div id="dice-one-side-three" class="side three">
            <div class="dot three-1"></div>
            <div class="dot three-2"></div>
            <div class="dot three-3"></div>
        </div>
        <div id="dice-one-side-four" class="side four">
            <div class="dot four-1"></div>
            <div class="dot four-2"></div>
            <div class="dot four-3"></div>
            <div class="dot four-4"></div>
        </div>
        <div id="dice-one-side-five" class="side five">
            <div class="dot five-1"></div>
            <div class="dot five-2"></div>
            <div class="dot five-3"></div>
            <div class="dot five-4"></div>
            <div class="dot five-5"></div>
        </div>
        <div id="dice-one-side-six" class="side six">
            <div class="dot six-1"></div>
            <div class="dot six-2"></div>
            <div class="dot six-3"></div>
            <div class="dot six-4"></div>
            <div class="dot six-5"></div>
            <div class="dot six-6"></div>
        </div>
    </div>
</template>

<style scoped>
.dice {
    --width: 100px;
    position: relative;
    width: var(--width);
    height: var(--width);
    transform-style: preserve-3d;
    transition: transform 1s;
    font-size: 20px;
}

.dot {
    position: absolute;
    width: calc(0.2 * var(--width));
    height: calc(0.2 * var(--width));
    margin: calc(-0.1 * var(--width)) calc(0.05 * var(--width))
        calc(0.5 * var(--width)) calc(-0.1 * var(--width));
    background-color: #f25f5c;
    border-radius: calc(0.2 * var(--width));
    box-shadow: inset calc(0.02 * var(--width)) calc(0.02 * var(--width))
        #d90429;
}

.side {
    position: absolute;
    width: var(--width);
    height: var(--width);
    border: 1px solid #e5e5e5;
    background-color: #fff;
    border-radius: 5px;
    line-height: 2em;
    text-align: center;
}

.side:nth-child(1) {
    transform: translateZ(3.1em) scale(0.75);
}

.side:nth-child(6) {
    transform: rotateY(90deg) translateZ(3.1em) scale(0.75);
}

.side:nth-child(3) {
    transform: rotateY(-90deg) translateZ(3.1em) scale(0.75);
}

.side:nth-child(4) {
    transform: rotateX(90deg) translateZ(3.1em) scale(0.75);
}

.side:nth-child(5) {
    transform: rotateX(-90deg) translateZ(3.1em) scale(0.75);
}

.side:nth-child(2) {
    transform: rotateY(-180deg) translateZ(3.1em) scale(0.75);
}

.show-1 {
    transform: rotateX(720deg) rotateZ(-720deg) scale(0.75);
}

.show-6 {
    transform: rotateY(-450deg) rotateZ(-1440deg) scale(0.75);
}

.show-3 {
    transform: rotateY(810deg) rotateZ(720deg) scale(0.75);
}

.show-4 {
    transform: rotateX(-810deg) rotateZ(-1080deg) scale(0.75);
}

.show-5 {
    transform: rotateX(450deg) rotateZ(-720deg) scale(0.75);
}

.show-2 {
    transform: rotateX(-900deg) rotateZ(1080deg) scale(0.75);
}

.two-1,
.three-1,
.four-1,
.five-1,
.six-1 {
    top: 20%;
    left: 20%;
}

.four-3,
.five-3,
.six-4 {
    top: 20%;
    left: 80%;
}

.one-1,
.three-2,
.five-5 {
    top: 50%;
    left: 50%;
}

.four-2,
.five-2,
.six-3 {
    top: 80%;
    left: 20%;
}

.two-2,
.three-3,
.four-4,
.five-4,
.six-6 {
    top: 80%;
    left: 80%;
}

.six-2 {
    top: 50%;
    left: 20%;
}

.six-5 {
    top: 50%;
    left: 80%;
}
</style>
