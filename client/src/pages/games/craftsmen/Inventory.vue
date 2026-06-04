<script setup>
import { computed, ref } from "vue";

import Cart from "@/assets/games/gameAssets/craftsmen/cart.png";
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Hourglass from "@/assets/games/gameAssets/craftsmen/hourglass.svg";
import Iron from "@/assets/games/gameAssets/craftsmen/iron_bar.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/wheat.png";
import Wood from "@/assets/games/gameAssets/craftsmen/wood.png";

import actions from "../../../../../server/models/games/craftsmen/config.js/actions";
import { resourceImages } from "./composables_craftsmen/pathImages";
import { useGameActions } from "./composables_craftsmen/useGameActions";
import { useInventoryAnimation } from "./composables_craftsmen/useInventoryAnimation.js";
import Craftsman from "./Craftsman.vue";

const props = defineProps(["you", "availableActions"]);

const { buyCart, buyCraftsman, sellInventoryItem } = useGameActions(() => props.availableActions);
const { coinsAnimating, flyingIn, flyingOut, explicitFlyOut } = useInventoryAnimation(
    () => props.you,
);

const handleSell = (name, key, ghost) => {
    if (name === 'empty' || ghost || !props.availableActions.includes(actions.SELL_INVENTORY)) return;
    explicitFlyOut.value = key; // Zapisujemy konkretny kliknięty klucz
    sellInventoryItem(name);
};

const resources = computed(() => {
    const result = [];
    const resourceNames = new Set([...Object.keys(props.you.inventory), ...flyingOut.value.values()]);

    for (const name of resourceNames) {
        const count = props.you.inventory[name] || 0;
        
        const ghostsForName = [...flyingOut.value.entries()]
            .filter(([_, ghostName]) => ghostName === name)
            .map(([key, ghostName]) => ({ ghost: true, key, name: ghostName }));
            
        const ghostKeys = ghostsForName.map(g => g.key);
        const typeItems = [];
        
        let rendered = 0;
        let i = 0;
        
        // Generuj zwykłe surowce, przeskakując te klucze, które właśnie znikają
        while (rendered < count) {
            const key = `${name}:${i}`;
            if (!ghostKeys.includes(key)) {
                typeItems.push({ key, name });
                rendered++;
            }
            i++;
        }
        
        // Sortuj po oryginalnym numerze (np. 0, 1, 2), by kliknięty surowiec nie skakał
        const combinedType = [...typeItems, ...ghostsForName].sort((a, b) => {
            const idxA = parseInt(a.key.split(':')[1]) || 0;
            const idxB = parseInt(b.key.split(':')[1]) || 0;
            return idxA - idxB;
        });
        
        result.push(...combinedType);
    }

    const nullsNeeded = props.you.maxInventorySpace - result.length;
    const empties = Array.from(
        { length: Math.max(0, nullsNeeded) },
        (_, i) => ({ key: `empty:${i}`, name: "empty" })
    );

    return [...result, ...empties];
});

const canBuyCraftsman = computed(() => {
    if (!props.you.canBuyCraftsman) return false;
    if (!props.availableActions.includes(actions.BUY_CRAFTSMAN)) return false;

    const craftsmanCost = props.you.craftsmanCost;
    const inventory = props.you.inventory;
    let missingResources = 0;

    for (const [resource, cost] of craftsmanCost) {
        const available = inventory[resource] || 0;
        if (available < cost) {
            missingResources += cost - available;
        }
    }

    return missingResources <= (inventory.amber || 0);
});

const canBuyCart = computed(() => {
    if (!props.you.canBuyCart) return false;
    if (!props.availableActions.includes(actions.BUY_CART)) return false;

    const cartCost = props.you.cartCost;
    const inventory = props.you.inventory;
    let missingResources = 0;

    for (const [resource, cost] of cartCost) {
        const available = inventory[resource] || 0;
        if (available < cost) {
            missingResources += cost - available;
        }
    }

    return missingResources <= (inventory.amber || 0);
});
</script>

<template>
    <div class="eq">
        <div class="info">
            <h1>Inwentarz</h1>
            <div class="wheat">
                {{ props.you.craftsmen + Number(props.you.trader) }}
                <img :src="Wheat" alt="" />
            </div>
            <div class="wallet" :class="{ 'coins-pop': coinsAnimating }">
                {{ props.you.coins }}
                <img :src="Coins" alt="" />
            </div>
        </div>

        <div class="inventory">
            <div
                v-for="{ name, key, ghost } in resources"
                :key="key"
                class="resource"
                :data-resource="name"
                :data-fly-key="key"
               @click="handleSell(name, key, ghost)"
                :class="{
                    'fly-in': flyingIn.has(key),
                    'fly-out': ghost,
                }"
            />
        </div>
        <div class="upgrades">
            <button
                v-if="props.you.canBuyCraftsman"
                class="buyCraftsman"
                :disabled="!canBuyCraftsman"
                @click="buyCraftsman"
            >
                <div class="spacing">
                    <template
                        v-for="[resource, amount] in props.you.craftsmanCost"
                        :key="resource"
                    >
                        <div>
                            <span>{{ amount }}</span>
                            <img :src="resourceImages[resource]" />
                        </div>
                    </template>
                </div>
                <span class="separator">/</span>
                <Craftsman :color="props.you.color.hex" class="icon" />
            </button>

            <button
                v-if="props.you.canBuyCart"
                class="buyCart"
                :disabled="!canBuyCart"
                @click="buyCart"
            >
                <div class="spacing">
                    <template
                        v-for="[resource, amount] in props.you.cartCost"
                        :key="resource"
                    >
                        <div>
                            <span>{{ amount }}</span>
                            <img :src="resourceImages[resource]" />
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


    &:not([data-resource="empty"]) {
        cursor: url("/src/assets/games/gameAssets/craftsmen/coinsCursor.png") 8 8, pointer;
    }

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

    &.fly-in {
        animation: resource-fly-in 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        position: relative;
        z-index: 100;
    }

    &.fly-out {
        animation: resource-fly-out 0.85s cubic-bezier(0.4, 0, 1, 1) forwards;
        position: relative;
        z-index: 100;
        pointer-events: none;
    }

    transition: transform 0.12s ease, filter 0.12s ease;

    &:not([data-resource="empty"]):not(.fly-out):hover {
        transform: scale(1.1);
        filter: drop-shadow(2px 2px 2px rgba(255, 210, 60, 0.65)) brightness(1.1);
    }

    &:not([data-resource="empty"]):not(.fly-out):active {
        transform: scale(0.95);
        transition-duration: 0.06s;
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

    font-size: 1rem;
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

@keyframes resource-fly-in {
    0% {
        transform: translate(var(--ox, 0px), var(--oy, 0px)) scale(2.8);
        opacity: 0.85;
        filter: drop-shadow(0 0 12px gold) brightness(1.6);
    }
    20% {
        opacity: 1;
    }
    60% {
        transform: translate(0, 0) scale(1.12);
        filter: drop-shadow(2px 2px 5px black);
    }
    100% {
        transform: translate(0, 0) scale(1);
        filter: drop-shadow(2px 2px 5px black);
    }
}

@keyframes resource-fly-out {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
        filter: drop-shadow(2px 2px 5px black);
    }
    15% {
        transform: translate(0, 0) scale(1.05);
    }
    55% {
        transform: translate(
                calc(var(--ox, 0px) * 0.05),
                calc(var(--oy, 0px) * 0.05)
            )
            scale(2.4);
        opacity: 1;
        filter: drop-shadow(0 0 4px gold) brightness(1.2);
    }

    100% {
        transform: translate(var(--ox, 0px), var(--oy, 0px)) scale(0.15);
        opacity: 0;
        filter: drop-shadow(0 0 2px gold);
    }
}

@keyframes coins-pop {
    0% {
        transform: scale(1);
    }
    40% {
        transform: scale(1.35);
        color: #f0d060;
    }
    70% {
        transform: scale(0.95);
    }
    100% {
        transform: scale(1);
    }
}

.wallet {
    &.coins-pop {
        animation: coins-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }
}
</style>
