<script setup>
import { computed } from "vue";

import User from "@/assets/user.png";

import actions from "../actions/actions";
import getTileRentIndex from "../composables_eurobusiness/getTileRentIndex";

const props = defineProps([
    "playersData",
    "yourPublicId",
    "gameMap",
    "openMortgagePropertyCardDialog",
    "availableActions",
    "yourTurn",
]);

const group1 = [5, 15, 25, 35]
const group2 = [12, 28]

const players = computed(() => {
    if (props.playersData.length === 4) return props.playersData;
    const players = [...props.playersData];
    for (let i = 0; i < 4 - props.playersData.length; i++) {
        players.push({
            color: { hex: "#3337", name: "gray" },
            money: null,
            publicId: null,
            username: "Brak gracza",
        });
    }
    return players;
});

const getTilePrice = (number) => {
    const tile = props.gameMap[number];
    if (tile?.subtype === "utility") {
        return tile.name === "Automat Kawowy" ?
        "☕" : "🥪"
        
    } else if (tile?.subtype === "winda") {
        let rent = 25;
        props.playersData.forEach(player => {
            if (player.ownerships.includes(number)) {
                rent = 0;
                if (player.ownerships.includes(5)) rent += 25;
                if (player.ownerships.includes(15)) rent += 25;
                if (player.ownerships.includes(25)) rent += 25;
                if (player.ownerships.includes(35)) rent += 25;
            }
        });

        return `${rent}$`
    }
    else if (tile.type === "Budynek") {
        return props.gameMap[number].rent[getTileRentIndex(number, props.playersData)] + "$"
    }

    return "";
};


</script>

<template>
    <div class="players">
        <article
            v-for="player in players"
            :key="player.publicId"
            class="player"
            :class="{
                inJail: player.inJail,
                you: props.yourPublicId === player.publicId,
                noPlayer: player.publicId === null,
            }"
            :style="`--color: ${player.color.hex}`"
        >
            <header class="playerInfo">
                <!-- <pre style="font-size: 1rem;" v-if="player.publicId">
                    {{ player }}

                </pre> -->
                <div class="playerIcon">
                    <img :src="User" alt="" />
                </div>
                <div v-if="player.username" class="playerUsername">
                    {{ player.username }}
                    <span v-if="props.yourPublicId === player.publicId">
                        (Ty)
                    </span>

                    <!-- <span v-if="player.inJail"> (W więzieniu)</span> -->
                </div>
                <div v-if="player.money !== null" class="playerMoney">
                    <span>{{ player.money }}</span>
                    <span class="dolarSign">$</span>
                </div>
            </header>
            <section class="cards">
                <div class="info">
                    <div
                        v-if="
                            !player.ownerships ||
                            player.ownerships?.length === 0
                        "
                        class="noCards"
                    >
                        Karty własności
                    </div>
                    <div
                        v-else
                        class="ownerships"
                        :class="{
                            lessThan9: player.ownerships.length < 9,
                            equal8: player.ownerships.length === 8,
                            lessThan17: player.ownerships.length < 17,
                            lessThan22: player.ownerships.length < 22,
                            noAction:
                                !availableActions.includes(
                                    actions.redeemPropertyCard,
                                ) && yourPublicId === player.publicId,
                            noHover:
                                !yourTurn || yourPublicId !== player.publicId,
                        }"
                    >
                        <div
                            v-for="index in player.ownerships.sort(
                                (a, b) => {
                                       const aGroup1 = group1.includes(a)
                                        const bGroup1 = group1.includes(b)
                                        const aGroup2 = group2.includes(a)
                                        const bGroup2 = group2.includes(b)

                                        // jeśli oba w tej samej grupie → sort rosnąco w grupie
                                        if (aGroup1 && bGroup1) return a - b
                                        if (aGroup2 && bGroup2) return a - b

                                        // jeśli jeden w grupie 1 → trzymaj razem
                                        if (aGroup1) return 1
                                        if (bGroup1) return -1

                                        // jeśli jeden w grupie 2 → trzymaj razem
                                        if (aGroup2) return 1
                                        if (bGroup2) return -1

                                        // reszta normalnie
                                        return a - b
                                }
                            )"
                            :key="index"
                            class="tileCard"
                            :style="`--bg: ${props.gameMap[index].color}`"
                            :class="{
                                mortgaged:
                                    player.mortgagedCards.includes(index),
                                    coffee: gameMap[index]?.name === 'Automat Kawowy',
                                    shop: gameMap[index]?.name === 'Sklepik',
                                    elevator: gameMap[index]?.subtype === 'winda',
                            }"
                            @click="
                                () => {
                                    if (
                                        yourPublicId !== player.publicId ||
                                        !yourTurn
                                    )
                                        return;
                                    openMortgagePropertyCardDialog(
                                        gameMap[index],
                                    );
                                }
                            "
                        >
                            <div class="top"></div>
                            <div class="bottom">
                                <span
                                    v-if="player.mortgagedCards.includes(index)"
                                >
                                    Z
                                </span>
                                <span v-else>
                                    {{ getTilePrice(index)}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    </div>
</template>

<style scoped lang="scss">
.players {
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: start;
    gap: 0.75rem;
    color: #1d1d1d;
}

.player {
    height: 154.25px;
    width: 100%;
    border-radius: 0.25rem;
    background: linear-gradient(180deg, #fcfaf5, #e2d7c4);
    padding: 1.5rem 1.15rem;
    font-family: "Open Sans";

    &.you {
        background: linear-gradient(
            180deg,
            hsl(41, 93%, 88%),
            hsl(38, 84%, 83%)
        );
    }

    &.inJail .playerIcon {
        background: repeating-linear-gradient(
            to right,
            #b1b1b1 0,
            #b1b1b1 2px,
            #333 2px,
            #333 6px
        );

        box-shadow:
            0 0 0 2px #777777,
            0 0 0 5px #333;
    }

    &.noPlayer {
        background: linear-gradient(180deg, #a2c9e2, #90b2c9);
        color: hsl(from var(--color) h s 0);
    }
}

.playerInfo {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 500;
    padding-left: 4px;
}

.playerIcon {
    width: 30px;
    height: 30px;
    background-color: var(--color);
    border-radius: 50%;
    padding: 5px;
    box-shadow:
        0 0 0 2px #fff,
        0 0 0 5px var(--color);
}

.playerUsername {
    font-weight: 600;
    font-size: 1.25rem;

    span {
        font-weight: 500;
        font-size: 0.9em;
    }
}

.playerMoney {
    display: flex;
    gap: 0.15rem;
    margin-left: auto;
    font-size: 1.5rem;

    .dolarSign {
        color: rgb(57, 126, 57);
    }
}

.cards {
    position: relative;
    display: flex;
    height: 90px;

    .info {
        margin-block: 0.5rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        padding: 0.25rem;
        place-items: center;
        font-size: 1.15rem;
        color: #2020207e;
        font-weight: bold;
        // background-color: rgba(129, 127, 99, 0.322);
        border-radius: 0.25rem;
    }

    .info:has(.noCards) {
        flex-direction: row;
        justify-content: center;
        background-color: rgba(129, 129, 129, 0.322);
    }
}

.ownerships {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;

    &.noAction .tileCard {
        cursor: not-allowed;

        opacity: 0.5;

        &:hover {
            filter: none;
        }
    }

    &.noHover .tileCard {
        cursor: not-allowed;
        &:hover {
            filter: none;
        }
    }

    .tileCard {
        height: 30px;
        width: 20px;
        border-radius: 0.25rem;
        border: 1px solid #000000;

        overflow: hidden;
        cursor: pointer;

        font-size: 0.75rem;
        color: black;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
            rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
            rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

        &.mortgaged {
            border-color: rgb(117, 106, 1);
        }

        .top {
            border-bottom: 1px solid black;
            background-color: var(--bg);
            height: 14px;
            width: 100%;
        }

        .bottom {
            display: grid;
            place-items: center;
            height: 16px;
            background-color: white;
        }

        &:hover {
            filter: brightness(0.85);
        }
    }

    &.lessThan22 {
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 0.2rem;
        .tileCard {
            font-size: 0.8rem;
            height: 20px;
            width: 48px;
            display: flex;

            border-radius: 0.15rem;

            &.mortgaged {
                .top {
                    border-color: rgb(117, 106, 1);
                }
            }
            .top {
                // height: ;
                height: 100%;
                border-bottom: none;
                border-right: 1px solid;
                width: 12px;
            }
            .bottom {
                width: 34px;
                height: 100%;
                font-weight: 700;

                .dolar {
                    font-size: 0.75rem;
                }
            }
        }
    }

    &.lessThan17 {
        justify-content: start;
        align-items: center;
        width: 100%;
        gap: 0.3rem;
        .tileCard {
            display: block;
            height: 30px;
            width: 40px;
            border-radius: 0.15rem;
            &.mortgaged {
                .top {
                    border-color: rgb(117, 106, 1);
                }
            }

            .top {
                height: 8px;
                width: 100%;
                border-right: none;
                border-bottom: 1px solid;
            }
            .bottom {
                width: 100%;
                height: 20px;
            }
        }
    }

    &.lessThan9 {
        justify-content: start;
        width: 100%;
        .tileCard {
            display: block;
            height: 56px;
            width: 40px;
            border-radius: 0.15rem;
            &.mortgaged {
                .top {
                    border-color: rgb(117, 106, 1);
                }
            }
            .top {
                height: 15px;
                width: 100%;
                border-right: none;
                border-bottom: 1px solid;
            }
            .bottom {
                height: 39px;
                width: 100%;
            }
        }
    }

    .coffee, .shop {
        .top {
            display: none;
        }

        border: none!important;
        .bottom {
            background-color: #531607;
            color: white;
            width: 100%!important;
            height: 100%!important;
        }
    }

    .elevator {
        .top {

            background-color: #666666;
        }

        .bottom {
            color: 666666;
            border: none;
     
        }
    }
}

.dolar {
    font-family: sans-serif;
    color: green;
}
</style>
