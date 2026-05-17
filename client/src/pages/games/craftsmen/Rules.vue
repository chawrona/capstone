<script setup>
import Rules from "@/assets/games/gameAssets/craftsmen/Book.png";
import { ref } from "vue";


const dialogOpened = ref(false)

const toggleDialog = () => dialogOpened.value = !dialogOpened.value

</script>

<template>

<div class="dialog" v-if="dialogOpened">
    <h1>Zasady gry</h1>

</div>


<img :src="Rules" alt="" class="rules" @click="toggleDialog">


</template>

<style scoped>

.dialog {
    position: absolute;
    inset: 0;
    place-self: center;
    width: 45rem;
    height: 60rem;
    overflow-y: scroll;
    background-color: red;
    padding: 1rem 2rem;
 scrollbar-width: none;
        box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: contain;
    background-position: center;

    color: white;
    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");

    h1 {
        text-align: center;
    }

}


.rules {
    padding-block: 1rem;
    position: absolute;
    bottom: 12.5rem;
    cursor: pointer;
    left: 7.5rem;
    width: 15rem;
    z-index: 10;
       filter: drop-shadow( 0px 0px 5px rgba(0, 0, 0, 0.534));

       &:hover {
  filter: brightness(1.05) drop-shadow( 0px 0px 5px rgba(0, 0, 0, 0.534));
       }
  
}

</style>