<script setup>
import { computed, ref } from "vue";

import Stone from "@/assets/games/gameAssets/craftsmen/Stone.png";
import Wood from "@/assets/games/gameAssets/craftsmen/Wood.png";

import actions from "../../../../../server/models/games/craftsmen/config.js/actions";
import { resourceImages } from "./composables_craftsmen/pathImages";
import { useGameActions } from "./composables_craftsmen/useGameActions";

const props = defineProps([
    "you",
    "tradeUnlockCost",
    "availableActions",
    "isYourTurn",
]);

const { buyTrade, buyTrader, sellTrade } = useGameActions(
    () => props.availableActions,
);

const canUnlockTrade = computed(() => {
    let missingResources = 0;

    for (const [resource, cost] of props.tradeUnlockCost) {
        const available = props.you.inventory[resource] || 0;
        if (available < cost) {
            missingResources += cost - available;
        }
    }

    return missingResources <= (props.you.inventory.amber || 0);
});
</script>
<!-- !props.you.trader -->
<template>
    <div class="trade" :class="{ locked: !props.you.trader }">
        <h1 v-if="!props.you.trader" class="trade-title">
            {{ !props.you.trader ? "Odblokuj handlarza" : "Handlarz" }}
        </h1>

        <div class="wrap">
            <button
                v-if="!props.you.trader"
                class="unlock"
                :disabled="!canUnlockTrade || !props.isYourTurn"
                @click="buyTrader"
            >
                <template
                    v-for="[resource, amount] in props.tradeUnlockCost"
                    :key="resource"
                >
                    <div class="unlock-resource">
                        <span>{{ amount }}</span>
                        <img :src="resourceImages[resource]" />
                    </div>
                </template>
            </button>
            <div class="trade-button-wrap">
                <span class="label">Kup</span>
                <button
                    class="trade-button"
                    :disabled="
                        !props.you.trading.allowBuying ||
                        !props.availableActions.includes(actions.TRADE) ||
                        !props.isYourTurn
                    "
                    @click="buyTrade"
                >
                    {{
                        props.you.trading.buyAmount && props.isYourTurn
                            ? props.you.trading.buyAmount
                            : ""
                    }}
                    <img :src="resourceImages['coins']" alt="" />
                </button>
            </div>

            <div
                class="resource"
                :data-resource="
                    !props.isYourTurn
                        ? 'notYourTurn'
                        : props.you.trading.resource
                "
            ></div>
            <div class="trade-button-wrap">
                <span class="label">Sprzedaj</span>
                <button
                    class="trade-button"
                    :disabled="
                        !props.you.trading.allowSelling ||
                        !props.availableActions.includes(actions.TRADE) ||
                        !props.isYourTurn
                    "
                    @click="sellTrade"
                >
                    {{
                        props.you.trading.sellAmount && props.isYourTurn
                            ? props.you.trading.sellAmount
                            : ""
                    }}
                    <img :src="resourceImages['coins']" alt="" />
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

    filter: drop-shadow(2px 2px 5px black);

    &[data-resource="wood"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/wood.png");
    }

    &[data-resource="brick"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/brick.png");
    }
    &[data-resource="iron"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/iron_bar.png");
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
    &[data-resource="undefined"],
    &[data-resource="coins"],
    &[data-resource="notYourTurn"] {
        opacity: 0.5;
        background-image: url("/src/assets/games/gameAssets/craftsmen/undefined.png");
    }
}
</style>
