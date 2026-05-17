<script setup>
import { ref } from 'vue';
import Stone from "@/assets/games/gameAssets/craftsmen/Stone.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";

const traderLocked = ref(true)
const allowBuying = ref(true)
const allowSelling = ref(true)

</script>

<template>
<div class="trade" :class="{locked: traderLocked}">
    <h1 class="trade-title">{{traderLocked ? "Odblokuj handlarza" : "Handlarz"}}</h1>


   

    <div class="wrap">
       
        <button  v-if="traderLocked" class="unlock">
            <div class="unlock-resource">
                <span>2</span>
                <img :src="Wood" alt="">
            </div>
            <div class="unlock-resource">
                <span>3</span>
                <img :src="Stone" alt="">
            </div>
        </button>
      
        <button class="trade-button" :disabled="!allowBuying">Kup za 2</button>
        <div class="resource" data-resource="wood"></div>
        <button class="trade-button" :disabled="!allowSelling">Sprzedaj za 4</button>
    </div>

</div>
</template>

<style scoped>
.trade {
    padding-block: 1rem;
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    width: 450px;

    box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");


    &.locked {
        .wrap > *:not(.unlock) {
            display: none;
        }

        .trade-button {
            cursor: auto;

            &:hover {
                background-color: var(--background);
            }
        }
    }
}

.unlock {

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem 1.25rem;
    font-size: 1.5rem;
    margin-inline: auto;
    gap: 1rem;
    --background: #f2dcb5;
    background-color: var(--background);
    border: none;
    
    
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
   
    .unlock-resource {
            display: flex;
            gap: 0.5rem;
    align-items: center;
    justify-content: center;
         img {
            width: 2rem;
        }

    }
}

.trade-title {
    color: white;
    text-align: center;
      filter: drop-shadow(2px 2px 5px black)
}

.wrap {
    height: 7rem;
    padding: 1rem;
    align-items: center;
    display: flex;
    justify-content: space-around;
}

.trade-button {
    font-size: 1.15rem;
    font-weight: bold;
    background-color: transparent;
    border: none;
    padding: 0rem 1rem;
    height: 2.25rem;
    width: 9.3rem;
    --background: #f2dcb5;
        background-color: var(--background);
         filter: drop-shadow(2px 2px 5px black);
       
    &[disabled] {
        opacity: 0.5;
    }

    &:not([disabled]) {
          cursor: pointer;
        &:hover {
            background-color: #e4b975;
        } 
    }


}

.resource {
    background-color: #ffffff;
    width: 5rem;    
    height: 5rem;   
    padding: 1rem;
    
    border-radius: 50%;
    background-size: 60%;
        background-position: center;
   background-repeat: no-repeat;
       background-image: url("/src/assets/games/gameAssets/craftsmen/wood.png");
       filter: drop-shadow(2px 2px 5px black)
}
</style>