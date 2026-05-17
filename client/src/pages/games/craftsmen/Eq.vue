<script setup>
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/wheat.png";
import Hourglass from "@/assets/games/gameAssets/craftsmen/hourglass.svg";
import Cart from "@/assets/games/gameAssets/craftsmen/Cart.png";
import Iron from "@/assets/games/gameAssets/craftsmen/iron_bar.png";

import { ref } from "vue";
import Craftsman from "./Craftsman.vue";


const maxSpace = ref(6);
const requiredWheat = ref(2);
const activespace = ref(0);
const coins = ref(13);


const resources = [
    "wood", "wheat",
    "wheat", "iron",
    "empty", "empty",
    "empty", "empty",
    "empty", "empty",
    "empty", "empty",
  
]

const cartsToBuy = 6;

</script>

<template>
<div class="eq">
    <div class="info">
        <h1>Inwentarz</h1>
        <div class="wheat">
              <img :src="Wheat" alt="">
            {{ requiredWheat }} /
            <img :src="Hourglass" alt="" class="hourglass">
        </div>
        <div class="wallet">
            {{coins}}
            <img :src="Coins" alt="">
        </div>
    </div>
    <div class="inventory">
        <div class="resource" :data-resource="resource" v-for="(resource, index) in resources"/>
    </div>
    <div class="upgrades">
          

        <button class="buyCraftsman">
            <div>
                <span>2</span>
                <img :src="Wheat" alt="">
                <span>1</span>
                <img :src="Iron" alt="">
            </div>
            <span class="separator">/</span>
            <Craftsman color="black" class="icon"/>
        </button>
     
        <button class="buyCart">
            <div>
                <span>2</span>
                <img :src="Wood" alt="">
            </div>
           <span class="separator">/</span>
            <img :src="Cart" alt="" class="warehouse">
        </button>
     
    </div>
</div>
</template>

<style scoped>
.eq {
    position: absolute;
 
    top: 11rem;
    left: 1rem;
    padding: 1rem;
    width: 450px;
    height: 300px;
 

      box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: contain;
    background-position: center;

    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");
}

.inventory {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.resource {
     background-color: #ffffff;
    width: 3.5rem;    
    height: 3.5rem;   
    padding: 0.5rem;
    
    border-radius: 50%;
    background-size: 70%;
        background-position: center;
   background-repeat: no-repeat;
      
       filter: drop-shadow(2px 2px 5px black);


    &[data-resource="empty"] {
        background-color: #5c4a3f;
        background-image: url("/src/assets/games/gameAssets/craftsmen/cart.png");
    }
    &[data-resource="wood"] {
        background-color: #8f664d;
        background-image: url("/src/assets/games/gameAssets/craftsmen/wood.png");
    }
    &[data-resource="iron"] {
        background-color: #e2e1e1;
        background-image: url("/src/assets/games/gameAssets/craftsmen/iron_bar.png");
    }
    &[data-resource="brick"] {
        background-color: #bd705a;
        background-image: url("/src/assets/games/gameAssets/craftsmen/brick.png");
    }
    &[data-resource="stone"] {
        background-color: #7d7e8d;
        background-image: url("/src/assets/games/gameAssets/craftsmen/stone.png");
    }
    &[data-resource="wheat"] {
        background-color: #b48c4a;
        background-image: url("/src/assets/games/gameAssets/craftsmen/wheat.png");
    }
}

.info, .upgrades {
    color: white;
    display: flex;
    justify-content: space-between;
}

.info {
    margin-bottom: 1.5rem;
}

.wallet, .wheat {
    display: flex;
    gap: 0rem;
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;

    img {
        width: 2.5rem;
    }
}

.upgrades {
    position: absolute; width: 100%;
    bottom: 0;
    padding: 1rem;
    left: 0;
    margin-top: auto;
}

.wheat {

    

    .hourglass {
        width: 0.9rem;
        margin-left: 0.15rem;
        transform: translateY(1px);
        filter: invert(1);
    }}

    .warehouse {
        margin-left: 0.5rem;
    }

    .buyCart {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 10.5rem;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 0 1rem;
        --background: #f2dcb5;
        background-color: var(--background);
        filter: drop-shadow(2px 2px 5px black);
        border: none;
       

            font-weight: bold;
 padding: 0.3rem 1.25rem;
    font-size: 1.5rem;
    color: rgb(0, 0, 0);

    &[disabled] {
        opacity: 0.5;
    }

    &:not([disabled]) {
          cursor: pointer;
        &:hover {
            background-color: #e4b975;
        } 
    }
        img {
            width: 2rem;
        }

        div {
            display: flex;
            align-items: center;
            gap: 0.2rem;
        }
    }

    .buyCraftsman {
             display: flex;
        align-items: center;
        justify-content: space-around;
        width: 13rem;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 0 1rem;
        --background: #f2dcb5;
        background-color: var(--background);
        filter: drop-shadow(2px 2px 5px black);
        border: none;
       

            font-weight: bold;
 padding: 0.3rem 1.25rem;
    font-size: 1.5rem;
    color: rgb(0, 0, 0);

    &[disabled] {
        opacity: 0.5;
    }

    &:not([disabled]) {
          cursor: pointer;
        &:hover {
            background-color: #e4b975;
        } 
    }
        img {
            width: 2rem;
        }

        .icon {
            transform: translateY(-2px);
            width: 1.5rem;
        }

        div {
            display: flex;
            align-items: center;
            gap: 0.2rem;
        }   
    }

    .separator {
        margin-inline: 1rem;
        font-weight: bold;
        font-size: 1.25em;
    }
</style>