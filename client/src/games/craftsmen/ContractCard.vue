<script setup>
import { computed, ref, watch, nextTick } from "vue";

import Brick from "@/assets/games/gameAssets/craftsmen/brick.png";
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Reroll from "@/assets/games/gameAssets/craftsmen/reroll.png";
import Stone from "@/assets/games/gameAssets/craftsmen/stone.png";
import Wheat from "@/assets/games/gameAssets/craftsmen/wheat.png";
import Wood from "@/assets/games/gameAssets/craftsmen/wood.png";

import { soundBus } from "../../audio/soundBus";
import { resourceImages } from "./composables_craftsmen/pathImages";
import { useGameActions } from "./composables_craftsmen/useGameActions";

const props = defineProps([
    "contract",
    "availableActions",
    "you",
    "rerollCost",
    "id",
    "canReroll",
]);

const { completeContract, rerollContract } = useGameActions(
    () => props.availableActions,
);

const icons = import.meta.glob(
    "@/assets/games/gameAssets/craftsmen/contracts/*.png",
    {
        eager: true,
        import: "default",
    },
);

const getIconPath = (iconName) => {
    const path = `/src/assets/games/gameAssets/craftsmen/contracts/${iconName}`;
    return icons[path] || "";
};

const animClass = ref("");
const displayContract = ref({ ...props.contract });

watch(
    () => props.contract,
    async (newVal, oldVal) => {
        if (
            newVal.title === oldVal?.title &&
            newVal.available === oldVal?.available
        ) {
            displayContract.value = { ...newVal };
            return;
        }

        if (!newVal.available) {
            soundBus.playEffect("craft");
            displayContract.value = { ...newVal };
            return;
        }

        animClass.value = "fly-out";
        await new Promise((r) => setTimeout(r, 320));
        displayContract.value = { ...newVal };
        animClass.value = "";
        await nextTick();
        animClass.value = "fly-in";

        const FLY_IN_DURATION = 320;
        setTimeout(() => {
            soundBus.playEffect("placeCard");
        }, FLY_IN_DURATION * 0.8);
    },
);

const canReroll = computed(() => {
    return props.you.coins >= props.rerollCost;
});

const canCompleteContract = computed(() => {
    let missingResources = 0;
    const inventory = props.you.inventory;

    console.log(["XD", props.contract, props.contract.requirements]);

    for (const [resource, cost] of props.contract.requirements) {
        const available = inventory[resource] || 0;
        if (available < cost) {
            missingResources += cost - available;
        }
    }

    return missingResources <= (inventory.amber || 0);
});

const localCompleteContract = () => {
    if (!canCompleteContract.value) return;
    completeContract(props.id);
};
</script>

<template>
    <div
        class="card"
        :class="[animClass, { hidden: !displayContract.available }]"
    >
        <button
            class="reroll"
            :disabled="!canReroll"
            @click="() => rerollContract(props.id)"
        >
            <img :src="Reroll" alt="" class="reroll-icon" />
            {{ props.rerollCost }}
            <img :src="Coins" alt="" />
        </button>

        <div
            class="wrap"
            :class="[animClass, { disable: !canCompleteContract }]"
            :data-points="displayContract.points"
            @click="localCompleteContract"
        >
            <h1 class="title">{{ displayContract.title }}</h1>

            <img
                :src="getIconPath(displayContract.icon)"
                alt=""
                class="cardIcon"
            />

            <div class="top">
                <div
                    v-for="[resource, amount] in displayContract.requirements"
                    :key="resource"
                    :class="{
                        smallerImg: true,
                        smaller: displayContract.requirements.length > 2,
                    }"
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

    &[data-points="1"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/boardP1.png");
    }
    &[data-points="2"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/boardP2.png");
    }
    &[data-points="3"] {
        background-image: url("/src/assets/games/gameAssets/craftsmen/boardP3.png");
    }

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
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 0.25rem;
    font-size: 1.5rem;

    &:has(.smaller) {
        width: 90%;
        gap: 0.1rem 0.5rem;
    }

    img {
        transform: translateY(2px);
        width: 2rem;
    }

    div {
        display: flex;

        gap: 0.2rem;
        align-items: center;
    }

    .smaller {
        font-size: 1.3rem;
        img {
            width: 1.75rem;
        }
    }
}

.top .hidden {
    opacity: 0;
    cursor: auto;
}

.reroll {
    display: flex;
    justify-content: center;
    position: absolute;
    align-items: center;
    top: -4rem;
    right: 0;
    border: none;
    height: 3.25rem;
    width: 10rem;
    padding: 0.75rem;
    font-size: 1.45rem;
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
        margin-right: 0rem;
        width: 2.25rem;
        transform: translateY(-2px);
    }
}

@keyframes flyOut {
    0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
    }
    20% {
        transform: translate(6px, -20px) rotate(1deg);
        opacity: 1;
    }
    100% {
        transform: translate(120vw, -30px) rotate(8deg);
        opacity: 0;
    }
}
@keyframes flyIn {
    0% {
        transform: translate(120vw, -30px) rotate(8deg);
        opacity: 0;
    }
    80% {
        transform: translate(6px, -20px) rotate(1deg);
        opacity: 1;
    }
    100% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
    }
}

.wrap.fly-out {
    animation: flyOut 0.32s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}
.wrap.fly-in {
    animation: flyIn 0.32s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}
</style>
