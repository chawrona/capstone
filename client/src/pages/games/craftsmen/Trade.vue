<script setup>
import { computed, ref } from "vue";

import Stone from "@/assets/games/gameAssets/craftsmen/Stone.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";
import { resourceImages } from "./composables_craftsmen/pathImages";

const props = defineProps(["you","tradeUnlockCost"])



const canUnlockTrade = computed(() => {
    for (const [resource, cost] of props.tradeUnlockCost) {
        if (props.you.inventory[resource] < cost) {
            return false;
        }
    }
    return true;
})


</script>
<!-- !props.you.trader -->
<template>
    <div class="trade" :class="{ locked: !props.you.trader   }">
        <h1 class="trade-title" v-if="!props.you.trader  ">
            {{ !props.you.trader ? "Odblokuj handlarza" : "Handlarz" }}
        </h1>

        <div class="wrap">
            <button v-if="!props.you.trader  " class="unlock" :disabled="!canUnlockTrade">
                  <template v-for="[resource, amount] in props.tradeUnlockCost" :key="resource">
                        <div class="unlock-resource">
                            <span>{{ amount }}</span>
                            <img :src="resourceImages[resource]"/>
                        </div>
                    </template>
            </button>
            <div class="trade-button-wrap">
                <span class="label">Kup</span>
<button class="trade-button" :disabled="!props.you.trading.allowBuying">
                {{ props.you.trading.buyAmount }}
                  <img :src="resourceImages['coins']" alt="">
            </button>   
            </div>
            
            <div class="resource" :data-resource="props.you.trading.resource"></div>
            <div class="trade-button-wrap">
                <span class="label" >Sprzedaj</span>
                <button class="trade-button" :disabled="!props.you.allowSelling">
                {{ props.you.trading.sellAmount }}
                <img :src="resourceImages['coins']" alt="">
            </button>
            </div>
            
        </div>
    </div>
</template>

<style scoped>
.trade {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    width: 400px;
    aspect-ratio: 671 / 205;
    border-radius: 0.5rem;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
   
    text-align: center;
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
    --background: #f4ecd0;
    background-color: var(--background);
    border: none;
     border-radius: 0.25rem;

    &:not([disabled]) {
        cursor: pointer;
        &:hover {
            background-color: #e4b975;
        }
    }

    &[disabled] {
        opacity: 0.5;
    }

    font-weight: bold;
    padding: 0.3rem 1.25rem;
    font-size: 1.5rem;
    color: rgb(0, 0, 0);

    .unlock-resource {
        display: flex;
        gap: 0.25rem;
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
    font-size: 1.5rem;
    filter: drop-shadow(2px 2px 5px black);
}

.wrap {
   
  
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.trade-button-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    color: white;
    font-weight: bold;
    margin-bottom: 0.5rem;

    &:has([disabled]) {
        .label {
            opacity: 0.5;
        }
    }
}

.trade-button {
   display: flex;
   justify-content: center;
   gap: 0.5rem;
   align-items: center;
    border: none;
    padding: 0rem 0.5rem;
    height: 2.25rem;
    width: 7rem;
    
    font-size: 1.2rem;
    font-weight: bold;
    --background: #f4ecd0;
    background-color: var(--background);
    border-radius: 0.25rem;

    &[disabled] {
        opacity: 0.5;
    }

    img {
        width: 1.8rem;
    }

    &:not([disabled]) {
        cursor: pointer;
        &:hover {
            background-color: #e4b975;
        }
    }
}

.resource {

    width: 5rem;
    height: 5rem;
    padding: 1rem;
    margin-inline: 0.5rem;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/src/assets/games/gameAssets/craftsmen/wood.png");
    filter: drop-shadow(2px 2px 5px black);
}
</style>
