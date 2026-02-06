<script setup>
import Church from "@/assets/games/gameAssets/brianboru/church_icon.png";
const data = [
    "#d72638",
    "#d72638",
    "#d72638",
    "#3b82f6",
    "#3b82f6",
    "#facc15",
    "#facc15",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
    "#f97316",
]

</script>

<template>

<div class="church">
    <img :src="Church" alt="" class="icon">
    <div class="players">
        <div 
            v-for="color in data"
            class="player" 
            :style="`--color: ${color}`"
        />
    </div>
   
</div>


</template>

<style scoped lang="scss">

.church {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
       padding: 1.25rem 1rem;
       border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/brownTexture.png");
    // background-color: white;
    gap: 2rem;
      box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.358);

}

.icon {
    height: 96px;
}

.players {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: start;
    align-content: start;
    gap: 0.5rem;
    grid-row: 2;
    width: 170px;
    height: 115px;
}

.player {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.349);
    background-color: hsl(from var(--color) h s calc(l * 1));
    box-shadow:
        inset 0 1.5px 3px rgba(255, 255, 255, 0.576),
        /* highlight góry */ inset 0 -3px 5px rgba(0, 0, 0, 0.247),
        0 2px 3px rgba(0, 0, 0, 0.308);
}


</style>