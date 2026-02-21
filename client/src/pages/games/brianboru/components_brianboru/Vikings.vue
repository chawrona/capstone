<script setup>
import Vikings from "@/assets/games/gameAssets/brianboru/vikings.png";
const props = defineProps(["vikings"]);
</script>

<template>
    <div class="wrap">
        <div class="vikings" v-if="props.vikings" v-for="viking in props.vikings" :key="viking">
            <img :src="Vikings" class="vikings-icon"/>
        </div>
    </div>
</template>

<style scoped>
.wrap {
    display: flex;

    gap: 0.5rem;
    flex-wrap: wrap;
    width: calc((75px + 0.5rem) * 4);
}

.vikings {
    position: relative;
    top: 0.5rem;
    left: 0.5rem;
    border-radius: 50%;
    width: 55px;
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    display: grid;
    background-color: red;
    place-items: center;
    height: 55px;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.477);
}
.vikings-count {
    transform: translateY(2px);
    font-family: "MedievalSharp";
    position: absolute;
    text-shadow: 0 0 6px black;
}

.vikings-icon {
    filter: brightness(1.1);
}
</style>
