<script setup>
import { computed, ref } from "vue";

import Cart from "@/assets/games/gameAssets/craftsmen/Cart.png";
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Hourglass from "@/assets/games/gameAssets/craftsmen/hourglass.svg";
import Iron from "@/assets/games/gameAssets/craftsmen/iron_bar.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/wheat.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";

import Craftsman from "./Craftsman.vue";
import { resourceImages } from "./composables_craftsmen/pathImages";
import { useGameActions } from "./composables_craftsmen/useGameActions";
import actions from "../../../../../server/models/games/craftsmen/config.js/actions";

const props = defineProps(["you", "availableActions"])

const { buyCart, buyCraftsman } = useGameActions(() => props.availableActions);

const resources = computed(() => {
    console.log(props.you.inventory);
    
     const items = Object.entries(props.you.inventory)
        .flatMap(([name, count]) => Array(count).fill(name));
    
    const nullsNeeded = props.you.maxInventorySpace - items.length;
    
    console.log("ile nulli", props.you.maxInventorySpace, items.length, nullsNeeded);
    

    return [...items, ...Array(Math.max(0, nullsNeeded)).fill("empty")];
})


const canBuyCraftsman = computed(() => {
    if (!props.you.canBuyCraftsman) return false
    if (!props.availableActions.includes(actions.BUY_CRAFTSMAN)) return false;
    const craftsmanCost = props.you.craftsmanCost;
    const inventory = props.you.inventory;

    for (const [resource, cost] of craftsmanCost) {
        console.log(inventory[resource], cost, inventory[resource] < cost);
        
        if (inventory[resource] < cost) return false;
    }

    return true;
})

const canBuyCart = computed(() => {
    if (!props.you.canBuyCart) return false
    if (!props.availableActions.includes(actions.BUY_CART)) return false;
    const cartCost = props.you.cartCost;
    const inventory = props.you.inventory;

    for (const [resource, cost] of cartCost) {
        if (inventory[resource] < cost) return false;
    }

    return true;
})

</script>

<template>
    <div class="eq">
        <div class="info">
            <h1>Inwentarz</h1>
            <div class="wheat">
                {{ props.you.craftsmen + Number(props.you.trader) }}
                <img :src="Wheat" alt="" />
               
            </div>
            <div class="wallet">
                {{ props.you.coins }}
                <img :src="Coins" alt="" />
            </div>
        </div>
        <div class="inventory">
            <div
                v-for="(resource, index) in resources"
                :key="index"
                class="resource"
                :data-resource="resource"
            />
        </div>
        <div class="upgrades">
            <button class="buyCraftsman" v-if="props.you.canBuyCraftsman" :disabled="!canBuyCraftsman" @click="buyCraftsman">
                <div class="spacing">
                    <template v-for="[resource, amount] in props.you.craftsmanCost" :key="resource">
                        <div>
                            <span>{{ amount }}</span>
                            <img :src="resourceImages[resource]"/>
                        </div>
                    </template>
                </div>
                <span class="separator">/</span>
                <Craftsman :color="props.you.color.hex" class="icon" />
            </button>

            <button class="buyCart" v-if="props.you.canBuyCart" :disabled="!canBuyCart" @click="buyCart">
                <div class="spacing">
                    <template v-for="[resource, amount] in props.you.cartCost" :key="resource">
                        <div>
                            <span>{{ amount }}</span>
                            <img :src="resourceImages[resource]"/>
                        </div>
                    </template>
                </div>
                <span class="separator">/</span>
                <img :src="Cart" alt="" class="warehouse" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.eq {
    position: absolute;

    top: 11.3rem;
    left: 1rem;
    padding: 1rem;
    width: 400px;
    height: 360px;
    border-radius: 0.5rem;
   z-index: 11;
    background-size: contain;
    background-position: center;

    background-image: url("/src/assets/games/gameAssets/craftsmen/loading2.webp");
}

.inventory {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    
}

.resource {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;

    filter: drop-shadow(2px 2px 5px black);

    &[data-resource="empty"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/cart.png");
        opacity: 0.5;
    }
    &[data-resource="wood"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/wood.png");
    }
    &[data-resource="iron"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/iron_bar.png");
    }
    &[data-resource="brick"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/brick.png");
    }
    &[data-resource="stone"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/stone.png");
    }
    &[data-resource="wheat"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/wheat.png");
    }
    &[data-resource="silk"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/silk.png");
    }
    &[data-resource="amber"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/amber.png");
    }
    &[data-resource="glass"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/glass.png");
    }
}

.info,
.upgrades {
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info {
    margin-bottom: 1.5rem;
}

.wallet,
.wheat {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    font-weight: bold;
    font-size: 1.3rem;
 transform: translateY(1px);
    img {
        transform: translateY(2px);
        width: 2.25rem;
    }
}

.upgrades {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 1rem;
    left: 0;
    margin-top: auto;
}

.wheat {
    margin-left: 3.5rem;
    .hourglass {
        width: 0.9rem;
        margin-left: 0.15rem;
        transform: translateY(1px);
        filter: invert(1);
    }
}



.buyCart {
    display: flex;
    align-items: center;
    justify-content: space-around;
  
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0 1rem;
    --background: #f4ecd0;
    border-radius: 0.25rem;
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
        gap: 0.25rem;

    }
}

.buyCraftsman {
    display: flex;
    align-items: center;
    justify-content: space-around;
  
    font-size: 1.rem;
    font-weight: bold;
    padding: 0 1rem;
    --background: #f4ecd0;
    background-color: var(--background);
    filter: drop-shadow(2px 2px 5px black);
    border: none;
border-radius: 0.25rem;
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
        gap: 0.25rem;

      
    }

    .spacing {
        display: flex;
        gap: 0.6rem;
    }
}

.separator {
    margin-inline: 0.5rem;
    font-weight: bold;
    font-size: 1.25em;
}


</style>
