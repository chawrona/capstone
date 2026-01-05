<script setup>
import { computed } from "vue";

import Chest from "@/assets/games/gameAssets/eurobusiness/chest.svg";
import User from "@/assets/user.png";

import { usePageSounds } from "../../../../composables/usePageSounds";
import actions from "../actions/actions";
import Dice from "./Dice.vue";

const props = defineProps([
    "rollResult",
    "availableActions",
    "rollDice",
    "yourTurn",
    "playersPositions",
    "playersData",
    "pickChanceCard",
    "pickCommunityCard",
    "yourPublicId",
    "useOutOfJailCard",
    "gameMap",
    "tilesOwnedBySomeone",
    "openHouseDialog",
]);

usePageSounds({
    effects: [
        { name: "roll", url: "/sounds/roll.mp3" },
        { name: "drawCard", url: "/sounds/drawCard.mp3" },
        { name: "bell", url: "/sounds/bell.mp3" },
    ],
});

const getUserColor = (publicId) => {
    const color = props.playersData.find((p) => p.publicId === publicId)?.color
        .hex;
    return color ? color : "#333";
};

const outOfJailCards = computed(() => {
    return props.playersData.find(
        (player) => player.publicId === props.yourPublicId,
    )?.outOfJailCard;
});

const playerInJail = (playerId) => {
    return props.playersData.find((player) => player.publicId === playerId)
        ?.inJail;
};

const getBuildingColor = (number) => {
    const tile = props.gameMap[number - 1];
    if (tile.type === "Budynek") return `--color: ${tile.color};`;

    return "";
};

const getCellName = (number) => {
    const tile = props.gameMap[number - 1];
    if (tile.type === "Budynek") return tile.name;

    return "";
};

const isTileOwned = (position) => {
    return Boolean(
        props.tilesOwnedBySomeone[position] &&
            props.gameMap[position].type === "Budynek",
    );
};

const isTileOwnedByYou = (position) => {
    if (!isTileOwned(position)) return false;
    const player = props.playersData.find(
        (player) => player.publicId === props.yourPublicId,
    );
    return player.ownerships.includes(position);
};

const getCellPrice = (number) => {
    const tile = props.gameMap[number - 1];
    if (tile?.subtype === "utility") {
        return "x4 / x10";
    } else if (tile?.subtype === "winda") {
        let rent = 25;
        props.playersData.forEach((player) => {
            if (player.ownerships.includes(number - 1)) {
                rent = 0;
                if (player.ownerships.includes(5)) rent += 25;
                if (player.ownerships.includes(15)) rent += 25;
                if (player.ownerships.includes(25)) rent += 25;
                if (player.ownerships.includes(35)) rent += 25;
            }
        });

        return `${rent}$`;
    } else if (tile.type === "Budynek") {
        return (isTileOwned(number - 1) ? tile.rent[0] : tile.price) + "$";
    }

    return "";
};

const getHouseNumber = (position) => {
    props.playersData.forEach((player) => {
        if (player.ownerships.includes(position)) {
            return player.properties[position] ?? 0;
        }
    });
    return 0;
};
</script>

<template>
    <div class="map">
        <div
            class="dices"
            :class="{
                cantRoll:
                    !availableActions.includes(actions.rollDice) ||
                    !props.yourTurn,
            }"
            @click="
                () => {
                    rollDice();
                }
            "
        >
            <Dice
                :trigger="rollResult"
                :new-value="rollResult[0]"
                color="#f32020"
            />
            <Dice
                :trigger="rollResult"
                :new-value="rollResult[1]"
                color="#2063f3"
            />
        </div>

        <div
            class="chanceCard"
            :class="{
                cantPick:
                    !availableActions.includes(actions.pickChanceCard) ||
                    !props.yourTurn,
            }"
            @click="props.pickChanceCard"
        >
            ?
        </div>
        <div
            class="communityCard"
            :class="{
                cantPick:
                    !availableActions.includes(actions.pickCommunityCard) ||
                    !props.yourTurn,
            }"
            @click="props.pickCommunityCard"
        >
            <img :src="Chest" alt="" class="chest-icon" />
        </div>

        <div
            v-if="outOfJailCards > 0"
            class="getOutOfJailCard"
            :class="{
                cantPick:
                    !availableActions.includes(actions.useOutOfJailCard) ||
                    !props.yourTurn,
            }"
            @click="useOutOfJailCard"
        >
            Zdane
        </div>

        <div
            v-for="number in 40"
            :key="number"
            class="cell"
            :data-houses="getHouseNumber(number - 1)"
            :class="{
                cells1to9: number - 1 > 0 && number - 1 < 10,
                cells11to19: number - 1 > 10 && number - 1 < 20,
                cells21to29: number - 1 > 20 && number - 1 < 30,
                cells31to39: number - 1 > 30 && number - 1 < 40,
                [`cell${number - 1}`]: true,
                building: gameMap[number - 1].type === 'Budynek',
                elevator: gameMap[number - 1]?.subtype === 'winda',
                utility: number === 13 || number === 29,
                isTileOwned: isTileOwned(number - 1),
                isYourTile: isTileOwnedByYou(number - 1),
            }"
            :style="`grid-area: cell${number - 1}; ${getBuildingColor(number)}; --backgroundIfOwned: ${tilesOwnedBySomeone[number - 1]}`"
            @click="
                () => {
                    if (isTileOwnedByYou(number - 1))
                        openHouseDialog(number - 1);
                }
            "
        >
            <p class="cell-name">{{ getCellName(number) }}</p>
            <p class="cell-price">{{ getCellPrice(number) }}</p>
        </div>

        <div class="center" style="grid-area: center" />

        <div
            v-for="[position, players] in Object.entries(
                props.playersPositions,
            )"
            :key="position"
            class="players"
            :style="`grid-area: cell${position}`"
        >
            <div
                v-for="player in players"
                :key="player"
                class="player"
                :class="{ inJail: playerInJail(player) }"
                :style="`--color: ${getUserColor(player)}`"
            >
                <img :src="User" alt="" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.players {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0 1.1rem;
    padding: 1px;

    .player {
        width: 1.5rem;
        height: 1.5rem;
        background-color: var(--color);
        border-radius: 50%;
        padding: 3px;
        z-index: 99;
        box-shadow:
            rgba(0, 0, 0, 0.25) 0px 54px 55px,
            rgba(0, 0, 0, 0.12) 0px -12px 30px,
            rgba(0, 0, 0, 0.12) 0px 4px 6px,
            rgba(0, 0, 0, 0.17) 0px 12px 13px,
            rgba(0, 0, 0, 0.09) 0px -3px 5px,
            0 0 0 2px #fff,
            0 0 0 5px var(--color);

        &.inJail {
            background: repeating-linear-gradient(
                to right,
                var(--color) 0,
                var(--color) 2px,
                #333 2px,
                #333 4px
            );

            box-shadow:
                0 0 0 2px #333,
                0 0 0 5px var(--color),
                0 0 0 8px #333;
        }
    }
}

.cell {
    display: grid;
    place-items: center;
    background-position: center;
    background-size: cover;
    position: relative;
    min-width: 0;
    min-height: 0;

    &.cell2,
    &.cell17,
    &.cell33 {
        background-color: #e47440;

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: url("games/gameAssets/eurobusiness/chest.svg");
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            background-size: 75%;
            filter: invert(1);
        }
    }

    &.cell2 {
        &::after {
            rotate: 90deg;
            background-size: 55%;
        }
    }

    &.cell17 {
        &::after {
            rotate: 180deg;
        }
    }

    &.cell7,
    &.cell22,
    &.cell36 {
        background-color: #40a2e4;

        &::after {
            content: "?";
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 4rem;
            font-weight: 700;
            color: #fff;

            line-height: 1;
            pointer-events: none;
        }
    }

    &.cell38 {
        background-image: url("games/gameAssets/eurobusiness/diamond.svg");
        background-position: center;
        background-size: 65%;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &::before {
            content: "Warunek";
            text-align: center;
            font-weight: bold;
            letter-spacing: -0.5px;
            transform: translateY(-1.6rem);
        }
        &::after {
            content: "75$";
            text-align: center;
            font-weight: bold;
        }
    }

    &.cell4 {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-image: url("games/gameAssets/eurobusiness/czesne.svg");
        background-position: center;
        background-size: 55%;
        background-repeat: no-repeat;
        &::before {
            content: "Czesne";
            text-align: center;
            font-weight: bold;
            transform: translateX(1.6rem);
        }
        &::after {
            content: "150$";
            text-align: center;
            font-weight: bold;
        }
    }

    &.cell22 {
        &::after {
            rotate: 180deg;
        }
    }

    &.cell10 {
        border-right: 2px solid black;
        border-top: 2px solid black;
        rotate: 90deg;
        background-image: url("games/gameAssets/eurobusiness/cell10.png");
        background-position: center;
        background-size: cover;
    }

    &.cell20 {
        border-right: 2px solid black;
        border-top: 2px solid black;
        rotate: 180deg;
        background-image: url("games/gameAssets/eurobusiness/cell20.png");
    }

    &.cell30 {
        border-top: 2px solid black;
        border-right: 2px solid black;
        rotate: -90deg;
        background-image: url("games/gameAssets/eurobusiness/cell30.png");
    }

    &.cell0 {
        border-right: 2px solid black;
        border-top: 2px solid black;
        background-image: url("games/gameAssets/eurobusiness/cell0.png");
    }

    &.building {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .cell-name {
            font-size: 1rem;
        }

        .cell-price {
            font-weight: bold;
        }
    }

    &.building.elevator::after,
    &.building.cell12:after,
    &.building.cell28:after {
        border: none !important;
        inset: 0 !important;
        background-image: url("games/gameAssets/eurobusiness/elevator.svg");
        width: 100% !important;
        height: 100% !important;
        background-repeat: no-repeat;
    }

    &.building.cell5.elevator {
        .cell-name {
            transform: translateX(1.6rem);
            font-weight: bold;
        }

        .cell-price {
            margin-right: auto;
        }
        &::after {
            background-size: 52.5%;
            background-position: center 45%;
            rotate: 90deg;
        }
    }

    &.building.cell15.elevator {
        .cell-price {
            margin-bottom: auto;
        }
        .cell-name {
            transform: translateY(-1.6rem);
            rotate: 180deg;
            font-weight: bold;
        }
        &::after {
            background-size: 75%;
            background-position: center 45%;
            rotate: 180deg;
        }
    }

    &.building.cell12 {
        .cell-price {
            margin-bottom: auto;
        }
        .cell-name {
            transform: translateY(-1.6rem);
            rotate: 180deg;
            line-height: 1;
            font-weight: bold;
        }
        &::after {
            background-size: 50%;
            background-position: center 60%;
            rotate: 180deg;
            background-image: url("games/gameAssets/eurobusiness/coffee.svg");
        }
    }
    &.building.cell25.elevator {
        .cell-price {
            margin-left: auto;
        }
        .cell-name {
            transform: translateX(1.6rem);
            font-weight: bold;
            rotate: 180deg;
        }
        &::after {
            background-size: 52.5%;
            background-position: center 45%;
            rotate: -90deg;
        }
    }
    &.building.cell28 {
        .cell-price {
            margin-left: auto;
        }
        .cell-name {
            transform: translateX(1.6rem);
            font-weight: bold;
            rotate: 180deg;
        }
        &::after {
            background-size: 52.5%;
            background-position: center 45%;
            rotate: -90deg;
            background-image: url("games/gameAssets/eurobusiness/food.svg");
        }
    }
    &.building.cell35.elevator {
        .cell-price {
            margin-top: auto;
        }
        .cell-name {
            transform: translateY(-1.6rem);

            font-weight: bold;
        }

        &::after {
            background-size: 75%;
            background-position: center 45%;
        }
    }

    &.isTileOwned.building:not(.elevator, .utility)::after {
        content: attr(data-houses);
        font-weight: bold;
        text-align: center;
        font-size: 1.1rem;
        padding: 0;
        color: rgb(15, 15, 15);
    }

    &.isYourTile:not(.elevator, .utility) {
        cursor: pointer;
        &:hover {
            filter: brightness(0.75);
        }
    }

    &.isTileOwned.building.cell39::after,
    &.building.cell37::after {
        color: rgb(226, 226, 226);
    }

    &.building::after {
        content: "";
        position: absolute;
        background-image: var(--color);
        background: linear-gradient(
            90deg,
            var(--color) 0%,
            hsl(from var(--color) h s calc(l * 0.9)) 100%
        );
    }

    &.cells1to9 {
        border-right: 2px solid black;
        border-top: 2px solid black;

        writing-mode: vertical-rl;
        padding-right: 1.75rem;
        padding-left: 0.35rem;

        &.building::after {
            right: 0;
            width: 27px;
            height: 100%;

            border-left: 2px solid black;
        }
    }

    &.cells11to19 {
        border-right: 2px solid black;
        border-bottom: 2px solid black;
        padding-bottom: 1.75rem;
        padding-top: 0.35rem;

        flex-direction: column-reverse;
        .cell-price,
        .cell-name {
            transform: rotate(180deg);
        }

        &.building::after {
            bottom: 0;
            width: 100%;
            height: 27px;

            border-top: 2px solid black;
        }
    }

    &.cells21to29 {
        border-left: 2px solid black;
        border-bottom: 2px solid black;
        flex-direction: column-reverse;

        writing-mode: vertical-rl;
        padding-left: 1.75rem;
        padding-right: 0.35rem;

        .cell-price,
        .cell-name {
            transform: rotate(180deg);
        }

        &.building::after {
            left: 0;
            width: 27px;
            height: 100%;
            border-right: 2px solid black;
        }
    }
    &.cells31to39 {
        border-top: 2px solid black;
        border-left: 2px solid black;
        padding-top: 1.75rem;
        padding-bottom: 0.35rem;

        &.building::after {
            top: 0;
            width: 100%;
            height: 27px;
            border-bottom: 2px solid black;
        }
    }

    &.cell9 {
        border-top: none;
    }
    &.cell19 {
        border-right: none;
    }

    &.cell29 {
        border-bottom: none;
    }
    &.cell39 {
        border-left: none;
    }

    &.isTileOwned {
        background-color: color-mix(
            in srgb,
            var(--backgroundIfOwned) 20%,
            white
        );
    }
}

.map {
    position: relative;
    width: 900px;
    height: 901px;
    border-radius: 0.25rem;
    background-position: center;
    background-size: contain;
    background-image: linear-gradient(180deg, #fcfaf5, #e2d7c4);

    // grid
    display: grid;
    grid-template-columns:
        4fr
        repeat(9, 3fr)
        4fr;

    grid-template-rows:
        4fr
        repeat(9, 3fr)
        4fr;

    overflow: hidden;

    grid-template-areas:
        "cell10 cell11 cell12 cell13 cell14 cell15 cell16 cell17 cell18 cell19 cell20"
        "cell9  center center center center center center center center center cell21"
        "cell8  center center center center center center center center center cell22"
        "cell7  center center center center center center center center center cell23"
        "cell6  center center center center center center center center center cell24"
        "cell5  center center center center center center center center center cell25"
        "cell4  center center center center center center center center center cell26"
        "cell3  center center center center center center center center center cell27"
        "cell2  center center center center center center center center center cell28"
        "cell1  center center center center center center center center center cell29"
        "cell0 cell39 cell38 cell37 cell36 cell35 cell34 cell33 cell32 cell31 cell30";
}

.dices {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 2.5rem;
    cursor: pointer;
    padding: 2rem;
    width: 250px;
    height: 250px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-image: radial-gradient(
        circle,
        hsl(39, 87%, 95%) 0%,
        #fae2b6 60%,
        #fae2b6 100%
    );
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    &:hover {
        background-image: radial-gradient(
            circle,
            hsl(39, 87%, 90%) 0%,
            hsl(39, 87%, 80%) 60%,
            hsl(39, 87%, 80%) 100%
        );
    }

    &.cantRoll {
        cursor: auto;
        background-image: radial-gradient(circle, #d1d1d1 0%, #bdbdbd 100%);
    }
}

.chanceCard,
.communityCard,
.getOutOfJailCard {
    position: absolute;
    display: grid;
    place-items: center;
    width: 250px;
    height: 140px;
    color: white;
    font-size: 4rem;
    border: 4px solid white;
    border-radius: 0.5rem;
    transform-origin: center;
    cursor: pointer;
    user-select: none;
    background-color: #f6bf09;
    outline: 6px solid #f6bf09;

    &:hover {
        filter: brightness(1.05);
    }

    &.cantPick {
        cursor: auto;
        &:hover {
            filter: none;
        }
    }
}

.chanceCard {
    top: 203px;
    left: 146px;
    transform: rotate(-45deg);

    box-shadow:
        rgba(0, 0, 0, 0.25) 0px 34px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px,
        rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px,
        rgba(0, 0, 0, 0.09) 0px -3px 5px;

    &.cantPick {
        background-color: #40a2e4;
        outline: 6px solid #40a2e4;
    }
}

.communityCard {
    right: 146px;
    bottom: 203px;
    transform: rotate(135deg);
    box-shadow:
        rgba(22, 22, 19, 0.25) 0px 34px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px,
        rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px,
        rgba(0, 0, 0, 0.09) 0px -3px 5px;

    &.cantPick {
        background-color: #e47440;
        outline: 6px solid #e47440;
    }

    .chest-icon {
        height: 30%;
        transform: translateY(-80%) rotate(-5deg);
        filter: invert(1);
    }
}

.getOutOfJailCard {
    left: 146px;
    bottom: 203px;
    transform: rotate(-315deg);
    box-shadow:
        rgba(22, 22, 19, 0.25) 0px 34px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px,
        rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px,
        rgba(0, 0, 0, 0.09) 0px -3px 5px;
    background-color: hsl(46, 93%, 45%);
    outline: 6px solid hsl(46, 93%, 45%);

    &.cantPick {
        background-color: #575757;
        outline: 6px solid #575757;
    }
}
</style>
