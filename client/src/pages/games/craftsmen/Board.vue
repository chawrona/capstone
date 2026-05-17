<script setup>
import Arrow from "@/assets/games/gameAssets/craftsmen/Arrow.png";
import Coins from "@/assets/games/gameAssets/craftsmen/Coins.png";
import Iron from "@/assets/games/gameAssets/craftsmen/iron_bar.png";


import Silk from "@/assets/games/gameAssets/craftsmen/Silk.png";
import Amber from "@/assets/games/gameAssets/craftsmen/Amber.png";
import Glass from "@/assets/games/gameAssets/craftsmen/Glass.png";

import Wood from "@/assets/games/gameAssets/craftsmen/path_wood.png";
import WoodWheat from "@/assets/games/gameAssets/craftsmen/path_wood_wheat.png";
import Stone from "@/assets/games/gameAssets/craftsmen/path_stone.png";
import StoneWheat from "@/assets/games/gameAssets/craftsmen/path_stone_wheat.png";
import Gold from "@/assets/games/gameAssets/craftsmen/path_gold.png";
import IronPath from "@/assets/games/gameAssets/craftsmen/path_iron.png";
import Bricks from "@/assets/games/gameAssets/craftsmen/path_bricks.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/path_wheat.png";


import { ref, onMounted, onUnmounted } from "vue"

const props = defineProps(["innerPositions"])


const innerPositions = ref({
  glass: 0,
  silk: 1,
  amber: 2,
})


const outerPositions = ref({
  wood: 0,
  wood_wheat: 1,
  gold: 2,
  wheat: 3,
  stone: 4,
  stone_wheat: 5,
  iron: 6,
  bricks: 7,
})



let innerCircleRotation = ref(1);
let outerCircleRotation = ref(8);

let interval

onMounted(() => {
  interval = setInterval(() => {
    innerCircleRotation.value += 1;
    outerCircleRotation.value += 1;
  }, 4000)
})

onUnmounted(() => {
  clearInterval(interval)
})


</script>

<template>
<div class="border"></div>
<div class="board">

    <<div class="outerCircle" :style="`transform: rotate(calc(45deg * ${outerCircleRotation}))`">
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.wood}))`">
        <img :src="Wood" alt="" class="silk">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.wood_wheat}))`">
        <img :src="WoodWheat" alt="" class="glass">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.gold}))`">
        <img :src="Gold" alt="" class="amber">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.wheat}))`">
        <img :src="Wheat" alt="" class="amber">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.stone}))`">
        <img :src="Stone" alt="" class="silk">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.stone_wheat}))`">
        <img :src="StoneWheat" alt="" class="glass">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.iron}))`">
        <img :src="IronPath" alt="" class="amber">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(45deg * ${outerPositions.bricks}))`">
        <img :src="Bricks" alt="" class="amber">
        <div class="guild"></div>
    </div>
</div>
    
    <div class="innerCircle" :style="`transform: rotate(calc(-120deg * ${innerCircleRotation}))`">
    <div class="path" :style="`transform: rotate(calc(120deg * ${innerPositions.silk}))`">
        <img :src="Silk" alt="" class="silk">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(120deg * ${innerPositions.glass}))`">
        <img :src="Glass" alt="" class="glass">
        <div class="guild"></div>
    </div>
    
    <div class="path" :style="`transform: rotate(calc(120deg * ${innerPositions.amber}))`">
        <img :src="Amber" alt="" class="amber">
        <div class="guild"></div>
    </div>
</div>
    
    
    
    <div class="outerPath"></div>
    <div class="innerPath"> </div>

    <div class="cost">
        <span>2</span>
        <img :src="Coins" alt="">
        <span class="one">1</span>
        <img :src="Iron" alt="">
    </div>
    <img :src="Arrow" class="arrow">
</div>
</template>

<style scoped>
.board, .outerCircle, .outerPath, .innerCircle, .innerPath {
    position: absolute;
    inset: 0;
    place-self: center;
    aspect-ratio: 1 / 1;
    border-radius:  50%;
     transition: transform 1s linear;
}


 .path {
        position: absolute;
        inset: 0;
        place-self: center;
}

.guild {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    left: 64%;;
     background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");
     background-size: contain;
     border: 4px solid black;
    top: 5.5%;
}

.innerCircle .guild {
  top: 23%;
  left: 79%;;
}

.board {
    overflow: hidden;
    height: calc(100% - 2rem);
    z-index: 1;
 box-shadow:
            inset 0px 0px 8px rgba(218, 139, 75, 0.203), /* jasne wnętrze */
            inset 0px 0px 20px rgba(0, 0, 0, 0.2),   /* delikatny cień wewnątrz */
            0px 0px 10px rgba(0, 0, 0, 0.863);           /* cień na zewnątrz */
   
}


.border {
        position: absolute;
    inset: 0;
    place-self: center;
    aspect-ratio: 1 / 1;
    border-radius:  50%;
     transition: transform 0.5s;
     z-index: 0;

        height: 100%;
        aspect-ratio: 1 / 1;
        position: absolute;
   
        border-radius: 50%;
        z-index: 1;
        background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");
        box-shadow:
            inset 0px 0px 8px rgba(218, 139, 75, 0.203), /* jasne wnętrze */
            inset 0px 0px 20px rgba(0, 0, 0, 0.2),   /* delikatny cień wewnątrz */
            0px 0px 10px rgba(0, 0, 0, 0.863);           /* cień na zewnątrz */
   
}
.outerCircle {
    height: 100%;
    background: blue;
    z-index: 1;
}
.outerPath {
    height: 80%;

    z-index: 2;
     background-image: url("/src/assets/games/gameAssets/craftsmen/outerPath.png");

   background-size: contain;
    background-repeat: repeat;
    border: 5px solid black;
}

.innerCircle {
    height: 55%;
   
    z-index: 3;
    overflow: hidden;
    border: 6px solid black;
   
}

.innerPath {
    height: 35%;
   
    z-index: 4;
    background-image: url("/src/assets/games/gameAssets/craftsmen/innerPath.png");
    background-size: contain;
    background-repeat: repeat;

  
}

.arrow {
    z-index: 5;
    position: absolute;
    right: 0rem;
    top: -2rem;
    width: 10rem;
    rotate: -25deg;

    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.685));
}

.cost {
    display: flex;
    color: white;
    font-weight: bold;
    padding: 0rem 0.75rem;

    font-size: 1.5rem;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 6;

    right: 1.25rem;
    top: 0rem;
    /* right: -.5rem;
    top: 1.2rem;

    rotate: 34deg; */
           cursor: pointer;
    color: #000000; 
    font-size: 1.15rem;
    background-size: contain;
    /* background-image: url("/src/assets/games/gameAssets/craftsmen/board.png"); */



    --background: #f2dcb5;
        background-color: var(--background);
        filter: drop-shadow(2px 2px 5px black);
        border: none;
       
    &[disabled] {
        opacity: 0.5;
    }

    &:not([disabled]) {
          cursor: pointer;
        &:hover {
            background-color: #e4b975;
        } 
    }

        font-weight: bold;
 padding: 0.3rem 1.25rem;
    font-size: 1.5rem;
    color: rgb(0, 0, 0);
    padding-left: 1.5rem;
    img {
        width: 2rem;
       transform: translateY(2px);
    }

     &:hover {
        filter: brightness(1.1) drop-shadow(2px 2px 5px black);
    }
    
}

.one {
    margin-left: 1rem;
}

</style>