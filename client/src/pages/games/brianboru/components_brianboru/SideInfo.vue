<script setup>
import { ref } from 'vue';

const props = defineProps(["direction"])


const data = [
    {
        id: 1,
        type: "church",
    },
    {
        id: 2,
        left: 14,
        players: [["Dawid", 2], ["Versus", 0], ["Sensei", 1], ["ArekiS", 0], ["TDS", 2]],
        type: "vikings"
    },
    {
        id: 3,
        type: "marriage",
    },
    {
        id: 4,
        type: "money",
    },
    {
        id: 5,
        type: "points",
    },
]

const currentType = ref(0);
const changeType = () => {
    currentType.value = currentType.value === 4 ? 0 : currentType.value + 1;
}
</script>

<template>
     <div class="info" :class="props.direction">
            <div class="circle" :data-type="data[currentType].type" @click="changeType">
                <div v-if="data[currentType].type === 'vikings'" class="vikings">
                    {{data[currentType].left}}
                </div>
            </div>
            <div v-show="data[currentType].type === 'church'" class="data" data-type="church"">

            </div>
            <div v-show="data[currentType].type === 'vikings'" class="data" data-type="vikings"">

            </div>
            <div v-show="data[currentType].type === 'marriage'" class="data" data-type="marriage"">

            </div>
            <div v-show="data[currentType].type === 'money'" class="data" data-type="money"">

            </div>
            <div v-show="data[currentType].type === 'points'" class="data" data-type="points"">

            </div>
        </div>
</template>

<style scoped>

.info {
    position: relative;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    isolation: isolate;

    --info-width: 175px;
}

.down  {
    .circle {
        top: 0;
    }
    .data {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        /* border-top-left-radius: calc(var(--info-width) / 2);
        border-top-right-radius: calc(var(--info-width) / 2); */
        transform: translateY(1px);
        margin-top: 0.5rem;
    }
}

.up {
    .circle {
        bottom: 0;
    }
    .data {
          border-top-left-radius: 0;
        border-top-right-radius: 0;
        transform: translateY(1px);
        margin-top: 0.5rem;
    }
}



.circle {
    width: calc(var(--info-width) / 2);
    position: absolute;
    height: calc(var(--info-width) / 2);
    border-radius: 50%;
    background-color: var(--color);
    border: 5px solid hsl(from var(--color) h s calc(l * 0.9))
}

.data {
    width: var(--info-width);
    height: 100%;
    flex-grow: 1;
    background-color: var(--color);
    z-index: -1;
}

    [data-type="church"] {
        --color: blue;
    }
    [data-type="money"] {
        --color: rgb(255, 136, 0);
    }
    [data-type="marriage"] {
        --color: rgb(255, 251, 0);
    }
    [data-type="vikings"] {
        --color: rgb(255, 0, 0);
    }
    [data-type="points"] {
        --color: rgb(102, 255, 0);
    }


    .vikings {
        display: grid;
        place-items: center;
        font-size: 2rem;
        height: 100%;
        color: white;
        font-weight: bold;
    }
</style>
