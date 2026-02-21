<script setup>
import { ref } from "vue";

const props = defineProps(["message", "phases"]);

const infoSwitch = ref(true);
</script>

<template>
    <div v-if="infoSwitch" class="turnInfo" @click="infoSwitch = !infoSwitch">
        <h1>{{ props.message }}</h1>
    </div>
    <div v-else class="turnInfo" @click="infoSwitch = !infoSwitch">
        <h1>
            Faza {{ props.phases.marriage.current }}/{{
                props.phases.marriage.total
            }},
            <span v-if="props.phases.current === 'passing'">
                Odrzucanie kart {{ props.phases.passing.current }}/{{
                    props.phases.passing.total
                }}
            </span>
            <span v-else>
                Tura {{ props.phases.playing.current }}/{{
                    props.phases.playing.total
                }}
            </span>
        </h1>
    </div>
</template>

<style scoped>
.turnInfo {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1;
    font-family: "MedievalSharp";
    color: white;
    width: 600px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;

    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/brownTexture.png");
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);
    cursor: pointer;

    &:hover {
        /* background-image: url("/src/assets/games/gameAssets/brianboru/grayCard.png"); */
        /* color: #386fc8; */
        filter: hue-rotate(180deg);
    }

    h1 {
        font-weight: normal;
    }
}
</style>
