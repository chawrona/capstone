<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

import Arrow from "@/assets/games/gameAssets/craftsmen/arrow.png";

import actions from "../../../../server/models/games/craftsmen/config.js/actions";
import { soundBus } from "../../audio/soundBus";
import { pathImages } from "./composables_craftsmen/pathImages";
import { resourceImages } from "./composables_craftsmen/pathImages";
import { useGameActions } from "./composables_craftsmen/useGameActions";
import Craftsman from "./Craftsman.vue";

const props = defineProps([
    "innerCircleRotation",
    "outerCircleRotation",
    "outerPositions",
    "innerPositions",
    "availableActions",
    "outerPathCraftsmen",
    "innerPathCraftsmen",
    "guilds",
    "availableMovement",
    "you",
    "isYourTurn",
]);

const { buildGuild, moveCraftsman, rotate } = useGameActions(
    () => props.availableActions,
);

const selectedCraftsman = ref(null);

const selectCraftsmanToMove = (id) => {
    if (
        !Object.keys(props.availableMovement).includes(String(id)) ||
        !props.isYourTurn
    )
        return;
    if (id === selectedCraftsman.value) return (selectedCraftsman.value = null);
    selectedCraftsman.value = id;
    soundBus.playEffect("selectCraftsman");
    console.log("Wybrano: ", selectedCraftsman.value);
};

const localmoveCraftsman = (ringType, fieldId) => {
    moveCraftsman(ringType, fieldId, selectedCraftsman.value);
    selectedCraftsman.value = null;
};

const canRotate = computed(() => {
    if (!props.availableActions.includes(actions.ROTATE)) return false;

    const rotateCost = props.you.rotateCost;
    const inventory = props.you.inventory;
    let missingResources = 0;

    for (const [resource, cost] of rotateCost) {
        const available = inventory[resource] || 0;
        if (available < cost) {
            missingResources += cost - available;
        }
    }

    return missingResources <= (inventory.amber || 0);
});

// --- DŹWIĘK ROTACJI ZEWNĘTRZNEGO KOŁA ---
watch(
    () => props.outerCircleRotation,
    (newVal, oldVal) => {
        if (oldVal !== undefined && newVal !== oldVal) {
            soundBus.playEffect("rocks");
        }
    },
);

// --- DŹWIĘK BUDOWY GILDII ---
const totalGuildsCount = computed(() => {
    if (!props.guilds) return 0;
    let count = 0;
    for (const ring in props.guilds) {
        if (props.guilds[ring]) {
            for (const id in props.guilds[ring]) {
                if (props.guilds[ring][id]) {
                    count++;
                }
            }
        }
    }
    return count;
});

watch(totalGuildsCount, (newCount, oldCount) => {
    if (oldCount !== undefined && newCount > oldCount) {
        soundBus.playEffect("craft");
    }
});
// ----------------------------

const dialogOpened = ref(false);
const guildToBuild = ref(null);

const canBuildOuterGuild = computed(() => {
    if (!props.availableActions.includes(actions.BUILD_GUILD)) return false;

    const inventory = props.you.inventory;
    let missingResources = 0;

    for (const [resource, cost] of props.you.guildCost) {
        const available = inventory[resource] || 0;
        if (available < cost) {
            missingResources += cost - available;
        }
    }

    return missingResources <= (inventory.amber || 0);
});

const openBuildGuildDialog = (ringType, id, resource) => {
    if (dialogOpened.value === true) return;
    if (props.guilds[ringType][id]) return;
    soundBus.playEffect("buttonPress1");
    guildToBuild.value = [ringType, id, resource];
    dialogOpened.value = true;
};

const closeBuildGuildDialog = () => {
    soundBus.playEffect("buttonPress1");
    dialogOpened.value = false;
    guildToBuild.value = null;
};

const fields = {
    amber: "Bursztynu",
    brick: "Cegieł",
    glass: "Szkła",
    gold: "Bankowej",
    iron: "Żelaza",
    silk: "Jedwabiu",
    stone: "Kamienia",
    stone_wheat: "Kamienia i Zboża",
    wheat: "Zboża",
    wood: "Drewna",
    wood_wheat: "Drewna i Zboża",
};

const localBuildGuild = () => {
    buildGuild(guildToBuild.value);
    closeBuildGuildDialog();
};

const isSelectingPlace = computed(() => {
    return (
        props.availableActions.includes(actions.PLACE_CRAFTSMAN) ||
        props.availableActions.includes(actions.PLACE_TRADER)
    );
});
</script>

<template>
    <!-- <div v-if="dialogOpened && guildToBuild" class="dialog">
        <h1>Budowa Gildii</h1>

        <div>
            Czy chcesz wybudować gildię w dzielnicy <br /><span
                class="sector-name"
                >{{ fields[guildToBuild[2]] }}</span
            >
            za

            <div class="guild-cost">
                <template
                    v-for="[resource, amount] in props.you.guildCost"
                    :key="resource"
                >
                    <span>{{ amount }}</span>
                    <img :src="resourceImages[resource]" />
                </template>
            </div>
        </div>
        <div class="buttons">
            <button @click="closeBuildGuildDialog">Przemyślę to</button>
            <button
                v-if="guildToBuild[0] === 'outer'"
                :disabled="!canBuildOuterGuild"
                @click="localBuildGuild"
            >
                Zbuduj
            </button>
        </div>
    </div> -->

    <button class="cost" :disabled="!canRotate" @click="rotate">
        <span class="one">1</span>
        <img :src="resourceImages['iron']" alt="" />
    </button>
    <img :src="Arrow" class="arrow" />

    <div class="border"></div>

    <div class="board">
        <!-- Sklepy rzemieślnicze -->

        <div
            class="outerCircle"
            :style="`transform: rotate(calc(45deg * ${outerCircleRotation}))`"
        >
            <div
                v-for="(value, key) in props.outerPositions"
                :key="key"
                class="path"
                :style="`transform: rotate(calc(45deg * ${value}))`"
            >
                <img :src="pathImages[key]" alt="" />
            </div>

            <!-- <div
                v-for="(value, index) in props.outerPositions"
                :key="index"
                class="guild"
                :class="{
                    guildHover: !props.guilds.outer[value],
                    guildShow:
                        guildToBuild &&
                        guildToBuild[1] === value &&
                        guildToBuild[0] === 'outer',
                }"
                :style="`
                    --color: ${props.guilds.outer[value]?.hex};
                    transform: translate(-50%, -50%) rotate(${-45 * props.outerCircleRotation}deg);
                    top: calc(50% + 45% * sin(45deg * ${value} - 68deg));
                    left: calc(50% + 45% * cos(45deg * ${value} - 68deg));
                `"
                :data-guild="`outer-${value}`"
                :data-occupied="props.guilds.outer[value] !== null"
                @click="() => openBuildGuildDialog('outer', value, index)"
            ></div> -->
        </div>

        <div class="outerPathBackground"></div>

        <div class="outerPath">
            <div
                v-for="(craftsmen, index) in props.outerPathCraftsmen"
                :key="index"
                class="point lowIndex"
                :style="`
                    transform: translate(-50%, -50%);
                    top: calc(50% + 42.8% * sin(45deg * ${index} - 56deg));
                    left: calc(50% + 42.8% * cos(45deg * ${index} - 56deg));
                `"
            >
                <Craftsman
                    v-for="craftsman in craftsmen"
                    :key="craftsman.id"
                    :color="craftsman.color"
                    :type="craftsman.type"
                    class="innerPathCraftsman"
                    :class="{
                        hover:
                            Object.keys(props.availableMovement).includes(
                                String(craftsman.id),
                            ) && props.isYourTurn,
                    }"
                    @click.stop="() => selectCraftsmanToMove(craftsman.id)"
                />
            </div>

            <div
                v-for="(craftsmen, index) in 8"
                :key="index"
                class="point highIndex invisiblePoint"
                :style="`
            
                  
                    transform: translate(-50%, -50%);
                    top: calc(50% + 42.5% * sin(45deg * ${index} - 56deg));
                    left: calc(50% + 42.5% * cos(45deg * ${index} - 56deg));
                `"
            >
                <div
                    class="pointing-arrow"
                    :class="{
                        upsideDownArrow: [2, 3, 4].includes(index),
                        show:
                            (selectedCraftsman !== null &&
                                props.availableMovement[selectedCraftsman]
                                    ?.outer[index]) ||
                            isSelectingPlace,
                    }"
                    @click="() => localmoveCraftsman('outer', index)"
                />
            </div>
        </div>

        <!-- Sklepu luksusowe -->

        <div
            class="innerCircle"
            :style="`transform: rotate(calc(-120deg * ${innerCircleRotation}))`"
        >
            <div
                v-for="(value, key) in props.innerPositions"
                :key="key"
                class="path"
                :style="`transform: rotate(calc(120deg * ${value}))`"
            >
                <img :src="pathImages[key]" alt="" />
            </div>
        </div>

        <div class="innerPath">
            <div
                v-for="(craftsmen, index) in props.innerPathCraftsmen"
                :key="index"
                class="point lowIndex"
                :style="`
                    transform: translate(-50%, -50%);
                    top: calc(50% + 26% * sin(120deg * ${index} - 30deg));
                    left: calc(50% + 26% * cos(120deg * ${index} - 30deg));
                `"
            >
                <Craftsman
                    v-for="craftsman in craftsmen"
                    :key="craftsman.id"
                    :color="craftsman.color"
                    :type="craftsman.type"
                    class="innerPathCraftsman"
                    :class="{
                        hover:
                            Object.keys(props.availableMovement).includes(
                                String(craftsman.id),
                            ) && props.isYourTurn,
                    }"
                    @click.stop="() => selectCraftsmanToMove(craftsman.id)"
                />
            </div>

            <div
                v-for="(craftsmen, index) in 3"
                :key="index"
                class="point highIndex invisiblePoint"
                :style="`
                    transform: translate(-50%, -50%);
                    top: calc(50% + 26% * sin(120deg * ${index} - 30deg));
                    left: calc(50% + 26% * cos(120deg * ${index} - 30deg));
                `"
            >
                <div
                    class="pointing-arrow"
                    :class="{
                        upsideDownArrow: index === '1',
                        show:
                            selectedCraftsman !== null &&
                            props.availableMovement[selectedCraftsman]?.inner[
                                index
                            ],
                    }"
                    @click="() => localmoveCraftsman('inner', index)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes upAndDown {
    from {
        transform: translateX(-50%) translateY(calc(-25% + 0.5rem));
    }

    to {
        transform: translateX(-50%) translateY(calc(-25% - 0.5rem));
    }
}

@keyframes UpsideUpAndDown {
    from {
        transform: translateX(-50%) translateY(calc(125% + 0.5rem));
    }

    to {
        transform: translateX(-50%) translateY(calc(125% - 0.5rem));
    }
}

.dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 200;
    width: 500px;
    height: 250px;
    color: white;
    top: 35%;

    display: flex;
    flex-direction: column;
    text-align: center;
    position: absolute;
    justify-content: space-between;
    padding: 2rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 3px 3px 3px 0px rgba(51, 48, 48, 0.671);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/src/assets/games/gameAssets/craftsmen/black1.jpg");

    button {
        padding: 0.5rem 1.5rem;
        font-size: 1.15rem;
        font-weight: bold;
        --background: #f4ecd0;
        background-color: var(--background);
        filter: drop-shadow(2px 2px 5px black);
        border: none;
        border-radius: 0.25rem;

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

    & > div {
        line-height: 2;
        margin-top: 0.5rem;
        max-width: 90%;
        margin-inline: auto;
        text-align: center;
    }

    .guild-cost {
        display: inline-flex;
        align-items: center;
        gap: 0.15rem;

        img {
            width: 2rem;
        }
    }

    .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: auto;
    }

    .sector-name {
        font-weight: bold;
    }
}

.board,
.outerCircle,
.outerPath,
.outerPathBackground,
.innerCircle,
.innerPath {
    position: absolute;
    inset: 0;
    place-self: center;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transition: transform 1s linear;
}

.path {
    position: absolute;
    inset: 0;
    place-self: center;
}

/* Region Guild */

.point {
    &.invisiblePoint {
        width: 1px;
        height: 1px;
        padding: 0;
    }

    width: 7.5rem;
    height: 7.5rem;
    z-index: 300;
    &.smaller {
        width: 7.5rem;
        height: 7.5rem;
        padding: 1rem;
        justify-content: center;
        align-items: center;
    }

    &.evenSmaller {
        width: 6rem;
        height: 6rem;
    }

    &.lowIndex {
        z-index: 4;
    }

    &.highIndex {
        z-index: 5;
    }

    padding: 1rem;
    border-radius: 50%;

    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    background-size: contain;
    z-index: 200;

    .pointing-arrow {
        display: none;

        width: 4em;
        height: 6rem;
        z-index: 320;
        left: calc(35% - 0.1rem);
        top: -6rem;
        position: absolute;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        background-image: url("/src/assets/games/gameAssets/craftsmen/arrow_down.png");
        animation: upAndDown 0.8s linear infinite alternate;

        &:hover {
            background-image: url("/src/assets/games/gameAssets/craftsmen/arrow_down_hover.png");
        }

        &.upsideDownArrow {
            animation: UpsideUpAndDown 0.8s linear infinite alternate;
            background-image: url("/src/assets/games/gameAssets/craftsmen/arrow_up.png");
            &:hover {
                background-image: url("/src/assets/games/gameAssets/craftsmen/arrow_up_hover.png");
            }
        }
    }

    .show {
        display: block;

        &:hover {
            filter: brightness(0.7);
        }
    }

    .innerPathCraftsman {
        width: 2.5rem;

        &.hover {
            cursor: pointer;
            filter: brightness(1.2);
            animation: upAndDown 1.4s ease-in-out infinite;
        }

        &.hover:hover {
            filter: brightness(1.3) drop-shadow(0 0 7px rgb(255, 255, 255));
        }
    }
}

@keyframes upAndDown {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-0.4rem);
    }
    100% {
        transform: translateY(0);
    }
}

.guild {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    background-image: url("/src/assets/games/gameAssets/craftsmen/black1.jpg");
    background-color: black;
    background-size: contain;
    z-index: 200;
    transition: transform 1s;
    border: 4px solid black;

    &[data-occupied="true"] {
        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
                url("/src/assets/games/gameAssets/craftsmen/hammer.png"),
                linear-gradient(
                    150deg,
                    var(--color),
                    hsl(from var(--color) h s calc(l * 0.6))
                );
            background-position: center;

            background-size: contain;
            border-radius: 50%;
        }
    }
    &.guildShow,
    &.guildHover:hover {
        background-size: 60%;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("/src/assets/games/gameAssets/craftsmen/hammer_icon.png");
        background-color: #ffffff98;

        cursor: pointer;
    }
}

.innerCircle .guild {
    top: 23%;
    left: 79%;
}

.board {
    overflow: hidden;
    height: calc(100% - 2rem);
    z-index: 1;
    box-shadow:
        inset 0px 0px 8px rgba(218, 139, 75, 0.203),
        /* jasne wnętrze */ inset 0px 0px 20px rgba(0, 0, 0, 0.2),
        /* delikatny cień wewnątrz */ 0px 0px 10px rgba(0, 0, 0, 0.863); /* cień na zewnątrz */
}

.border {
    position: absolute;
    inset: 0;
    place-self: center;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transition: transform 0.5s;
    z-index: 0;

    height: 100%;
    aspect-ratio: 1 / 1;
    position: absolute;

    border-radius: 50%;
    z-index: 1;
    background-color: black;
    opacity: 0.5;
    /* background-image: url("/src/assets/games/gameAssets/craftsmen/background.jpg"); */
    background-size: contain;

    box-shadow:
        inset 0px 0px 8px rgb(218, 163, 118),
        /* jasne wnętrze */ inset 0px 0px 20px rgba(0, 0, 0, 0.2),
        /* delikatny cień wewnątrz */ 0px 0px 10px rgba(0, 0, 0, 0.863); /* cień na zewnątrz */
}

.outerCircle {
    height: 100%;
    background: rgb(0, 0, 0);
    z-index: 1;
}

.outerPathBackground {
    height: 80%;
    z-index: 2;
    background-image: url("/src/assets/games/gameAssets/craftsmen/outerPath.png");
    background-size: contain;
    background-repeat: repeat;
    border: 5px solid black;
}

.outerPath {
    height: 80%;

    z-index: 4;
}

.innerCircle {
    overflow: hidden;
    height: 55%;
    border-radius: 50%;
    z-index: 3;
    overflow: hidden;
    border: 6px solid black;
}

.innerPath {
    height: 35%;

    z-index: 6;
    background-image: url("/src/assets/games/gameAssets/craftsmen/innerPath.png");
    background-size: contain;
    background-repeat: repeat;
}

.arrow {
    z-index: 5;
    position: absolute;
    right: 30rem;
    top: 0rem;
    width: 10rem;
    rotate: -25deg;

    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.685));
}

.cost {
    display: flex;
    color: white;
    font-weight: bold;
    padding: 0rem 1.5rem;
    border-radius: 0.25rem;
    gap: 0.25rem;
    font-size: 1.5rem;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 6;

    right: 29.9rem;
    top: 3.9rem;
    /* right: -.5rem;
    top: 1.2rem;

    rotate: 34deg; */
    cursor: pointer;
    color: #000000;
    font-size: 1.15rem;
    background-size: contain;
    /* background-image: url("/src/assets/games/gameAssets/craftsmen/board.png"); */

    --background: #f4ecd0;
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
    padding: 0.3rem 2.25rem;
    font-size: 1.5rem;
    color: rgb(0, 0, 0);
    padding-left: 1.5rem;
    img {
        width: 2rem;
        transform: translateY(0px);
    }

    &:hover {
        filter: brightness(1.1) drop-shadow(2px 2px 5px black);
    }
}

.one {
    margin-left: 1rem;
}
</style>
