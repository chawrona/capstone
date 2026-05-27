<script setup>
import { computed, ref } from "vue";

import Brick from "@/assets/games/gameAssets/craftsmen/Brick.png";
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Reroll from "@/assets/games/gameAssets/craftsmen/Reroll.png";
import Stone from "@/assets/games/gameAssets/craftsmen/Stone.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/wheat.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";
import { resourceImages } from "./composables_craftsmen/pathImages";
import { useGameActions } from "./composables_craftsmen/useGameActions";

const props = defineProps(["contract", "availableActions", "you", "rerollCost", "id", "canReroll"]);

const { rerollContract, completeContract } = useGameActions(() => props.availableActions)

const canReroll = computed(() => {
    return props.you.coins >= props.rerollCost;
})

const canCompleteContract = computed(() => {
    for (const [resource, cost] of props.contract.requirements) {
        if (props.you.inventory[resource] < cost) {
            return false;
        }
    }
    return true;
})

const localCompleteContract = () => {
    if (!canCompleteContract.value) return
    completeContract(props.id)
}

</script>

<template>
    <div class="card" :class="{ hidden: !props.contract.available }">
        <button v-if="props.canReroll" class="reroll" @click="() => rerollContract(props.id)" :disabled="!canReroll">
            <img :src="Reroll" alt="" class="reroll-icon"/>
            {{ props.rerollCost }}
            <img :src="Coins" alt="" />
        </button>

        <div class="wrap" :class="{disable: !canCompleteContract}" @click="localCompleteContract">
            <h1 class="title">{{ props.contract.title }}</h1>

            <img :src="Wood" alt="" class="cardIcon" />

            <div class="top">
                <div
                    v-for="([resource, amount]) in props.contract.requirements"
                    :key="resource"
                    :class="{ smallerImg: true }"
                >
                    {{ amount }}
                    <img :src="resourceImages[resource]" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    width: 32%;

    aspect-ratio: 5 / 7;


    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    cursor: pointer;
}

.wrap {
    padding: 1.75rem 1rem;
    width: 100%;
    padding-top: 1.45rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
   
    box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;

    

    background-image: url("/src/assets/games/gameAssets/craftsmen/board2.png");

    &.disable {
       
         cursor: not-allowed;

         .cardIcon {
            opacity: 0.5;
         }
    }

    &:not(.disable):hover {
        filter: brightness(1.2);
    }

    .cardIcon {
        width: 5rem;
    }
}

.title {
    font-size: 1.3rem;
    text-align: center;
    font-weight: bold;
    margin-top: 0.25rem;
    height: 4rem;
}
.za {
    font-size: 1.25rem;
}



.top {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 0.25rem;
    font-size: 1.5rem;
}

.hidden {
    opacity: 0;
    cursor: auto;
}

.top div {
    display: flex;

    gap: 0.2rem;
    align-items: center;
}

.top .smallerImg {
    display: flex;
    gap: 0.25rem;
     transform: translateY(-px);
    img {
        transform: translateY(2px);
        width: 2rem;
    }
}

.reroll {
    display: flex;
    justify-content: center;
    position: absolute;
    align-items: center;
    
    top: -3.25rem;
    border: none;
    height: 2.75rem;
     aspect-ratio: 671 / 205;
    
    padding: 0.75rem;
    font-size: 1.3rem;
    font-weight: bold;
    color: white;
    gap: 0.2rem;
    cursor: pointer;
    box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: 100% 100%;
    background-position: center;
    background-image: url("/src/assets/games/gameAssets/craftsmen/board.png");

    &:not([disabled]):hover {
        filter: brightness(1.2);
    }

    &[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
    }

    img {
        width: 2rem;
    }

    .reroll-icon {
        margin-right: 0.25rem;
        width: 1.75rem;
        transform: translateY(-0.5px);
    }
}
</style>
