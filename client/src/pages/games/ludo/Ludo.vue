<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import Start from "@/assets/start_white.svg";
import { useAppStore } from "@/store/useAppStore.js";

import Dice from "../eurobusiness/components_eurobusiness/Dice.vue";
import { usePageSounds } from "../../../composables/usePageSounds";
import PlaySoundtrack from "../../../components/common/PlaySoundtrack.vue";
import { soundBus } from "../../../audio/soundBus";

const store = useAppStore();

const gameData = ref(null);
const players = ref(null);
const SOUNDTRACK_URL = "/sounds/eurobusiness_soundtrack.mp3";
usePageSounds({
    music: [{ name: "soundtrack", url: SOUNDTRACK_URL }],
    effects: [
        { name: "roll", url: "/sounds/roll.mp3" },
        { name: "click", url: "/sounds/click.mp3" },
    ],
});

const mapBases = computed(() => {
    const noPlayer = {
        color: {
            hex: "#919190",
            name: "gray",
        },
    };

    const bases = [];

    // Robimy po kolei tablicę według startingField
    for (let i = 0; i < 4; i++) {
        const player = players.value.find(
            (player) => player["startingField"] === i * 10,
        );
        if (!player) {
            bases.push({ ...noPlayer, startingField: i * 10 });
        } else {
            bases.push({ ...player });
        }
    }

    const playerIndex = bases.findIndex(
        (p) => p.publicId === gameData.value.yourPublicId,
    );

    if (playerIndex === -1) return bases;

    const rotations =
        playerIndex === 0
            ? 2
            : playerIndex === 1
              ? 1
              : playerIndex === 2
                ? 0
                : 3;

    console.log(
        "ROTACJA: ",
        rotations,
        "TUTAJ: ",
        bases,
        bases.slice(-rotations).concat(bases.slice(0, -rotations)),
    );

    return bases.slice(-rotations).concat(bases.slice(0, -rotations));
});

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 950;
const scale = ref(1);

const resizeGame = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    scale.value = Math.min(vw / BASE_WIDTH, vh / BASE_HEIGHT);
};

const playersFields = computed(() => {
    const player1Color =
        players.value.find((player) => player.startingField === 0)?.color.hex ||
        "#919190";
    const player2Color =
        players.value.find((player) => player.startingField === 10)?.color
            .hex || "#919190";
    const player3Color =
        players.value.find((player) => player.startingField === 20)?.color
            .hex || "#919190";
    const player4Color =
        players.value.find((player) => player.startingField === 30)?.color
            .hex || "#919190";

    return [player1Color, player2Color, player3Color, player4Color];
});

const getColor = (fieldNumber) => {
    if (fieldNumber > 0 && fieldNumber < 6) return playersFields.value[0];
    if (fieldNumber > 10 && fieldNumber < 16) return playersFields.value[1];
    if (fieldNumber > 20 && fieldNumber < 26) return playersFields.value[2];
    if (fieldNumber > 30 && fieldNumber < 36) return playersFields.value[3];

    return "#ffffff";
};

const getFinishFieldColor = (fieldNumber) => {
    return getColor(fieldNumber - 90);
};

const getPawnColor = (fieldNumber) => {
    if (fieldNumber > 90) {
        const player = players.value.find(
            (player) =>
                player.startingField === fieldNumber - 90 - (fieldNumber % 10),
        );

        return player.color.hex;
    }

    return players.value.find(
        (player) =>
            player.publicId === gameData.value.gameMap[fieldNumber - 1][0],
    )?.color.hex;
};

const generateGameMap = () => {
    // const przesunięcie = 0;

    const przesunięcie = players.value.find(
        (player) => player.publicId === gameData.value.yourPublicId,
    )?.startingField;

    const mapa = [
        0, 0, 0, 0, 19, 20, 21, 0, 0, 0, 0, 0, 0, 0, 0, 18, 111, 22, 0, 0, 0, 0,
        0, 0, 0, 0, 17, 112, 23, 0, 0, 0, 0, 0, 0, 0, 0, 16, 113, 24, 0, 0, 0,
        0, 11, 12, 13, 14, 15, 114, 25, 26, 27, 28, 29, 10, 101, 102, 103, 104,
        0, 124, 123, 122, 121, 30, 9, 8, 7, 6, 5, 94, 35, 34, 33, 32, 31, 0, 0,
        0, 0, 4, 93, 36, 0, 0, 0, 0, 0, 0, 0, 0, 3, 92, 37, 0, 0, 0, 0, 0, 0, 0,
        0, 2, 91, 38, 0, 0, 0, 0, 0, 0, 0, 0, 1, 40, 39, 0, 0, 0, 0,
    ].map((num) => {
        if (!num || num[0] === "f") return num;

        // 91-94 - pola finiszowe 1 gracza
        // 101-104 - pola finiszowe 2 gracza
        // 111-114 - pola finiszowe 3 gracza
        // 121-124 - pola finiszowe 4 gracza

        console.log(przesunięcie);

        if (num > 90) {
            let min = 91;
            let max = 124;

            let newNumber = num + przesunięcie;

            if (newNumber > 124) newNumber = (newNumber % 130) + 90;

            return newNumber;
        }

        if (num + przesunięcie > 40 && (num + przesunięcie) % 40 === 0)
            return 40;
        if (num + przesunięcie > 40) return (num + przesunięcie) % 40;
        return num + przesunięcie;
    });

    return mapa;
};

const getPawnId = (field) => {
    console.log("PIONEK: ", field, gameData.value.gameMap[field - 1][1]);

    return gameData.value.gameMap[field - 1][1];
};

const trigger = ref(0);
const canRollAgain = ref(true);
const prevAction = ref("Rzut kością");
const hideRolled = ref(false);

const isPaused = ref(false);

onMounted(() => {
    if (store.socket) {
        store.socket.on("gameData", (data) => {
            gameData.value = data;
            store.setLoading(false);

            isPaused.value = data.isPaused;

            if (prevAction.value === "Rzut kością") {
                trigger.value += 1;
                soundBus.playEffect("roll");
                hideRolled.value = true;

                canRollAgain.value = false;

                setTimeout(() => {
                    canRollAgain.value = true;
                    hideRolled.value = false;
                }, 1000);
            }

            prevAction.value = gameData.value.currentAction;
        });
        store.socket.on("players", (d) => (players.value = d));

        store.socket.on("pause", (d) => (isPaused.value = true));
        store.socket.on("resume", (d) => (isPaused.value = false));

        setTimeout(() => {
            store.emit("gameData", {
                eventName: "gameDataRequest",
            });
        }, 500);
    }

    window.addEventListener("resize", resizeGame);
    resizeGame();
});

onBeforeUnmount(() => {
    store.socket.off("gameData");
    store.socket.off("pause");
    window.removeEventListener("resize", resizeGame);
});

const rollDice = () => {
    if (!canRollAgain.value) return;
    if (!gameData.value.yourTurn) return;
    console.log();

    if (gameData.value.currentAction !== "Rzut kością") return;
    store.emit("gameData", {
        eventName: "rollDice",
    });
};

const setMap = () => {
    store.emit("gameData", {
        eventName: "setGameMap",
        map: prompt("Podaj finished json"),
    });
};

const setFinished = () => {
    store.emit("gameData", {
        eventName: "setFinished",
        finished: prompt("Podaj finished json"),
    });
};

const pawnMovement = (pawnId) => {
    if (!gameData.value.yourTurn) return;
    store.emit("gameData", {
        eventName: "pawnMovement",
        pawnId: pawnId,
    });
    soundBus.playEffect("click");
};

const isPawnOnFinish = (field) => {
    const player = players.value.find(
        (player) => player.startingField === field - 90 - (field % 10),
    );

    if (!player) return false;

    for (const playersPawns of gameData.value.finishPositions) {
        for (const [publicId, pawnId] of playersPawns) {
            if (publicId === player.publicId && field % 10 === pawnId)
                return true;
        }
    }

    return false;
};

const getPublicIdFromFieldFinish = (field) => {
    const player = players.value.find(
        (player) => player.startingField === field - 90 - (field % 10),
    );

    return player.publicId;
};
</script>

<template>
    <div class="background">
        <div v-if="gameData && isPaused" class="paused"></div>
        <PlaySoundtrack :url="SOUNDTRACK_URL" />
        <div
            v-if="gameData && players"
            class="game"
            :style="{ transform: `scale(${scale})` }"
        >
            <!-- <pre style="overflow-y: scroll; height: 100vh">
            {{ gameData }}
            {{ players }}
            {{ playersFields }}
            </pre> -->

            <div class="map">
                <!-- BAZY -->
                <div
                    v-for="(player, index) in mapBases"
                    :key="player.startingField"
                    :data-player="index"
                    class="player-base"
                    :style="`--background: ${player.color.hex}`"
                >
                    <p class="username">
                        {{ player.username }}&nbsp;{{
                            player.publicId === gameData.yourPublicId
                                ? "(Ty)"
                                : ""
                        }}
                    </p>

                    <div
                        v-for="pawnIndex in 4"
                        :key="pawnIndex"
                        :data-field="pawnIndex"
                        class="base-field"
                    >
                        <button
                            v-if="
                                gameData.startingPositionArea.some(
                                    (pawn) =>
                                        pawn[0] === player.publicId &&
                                        pawn[1] === pawnIndex,
                                )
                            "
                            class="ludo-pawn"
                            :class="{
                                'your-pawn':
                                    player.publicId === gameData.yourPublicId &&
                                    gameData.yourTurn &&
                                    gameData.currentAction === 'Ruch pionka' &&
                                    (gameData.diceThrowResult === 1 ||
                                        gameData.diceThrowResult === 6),
                            }"
                            :disabled="
                                !gameData.yourTurn ||
                                player.publicId !== gameData.yourPublicId ||
                                gameData.currentAction !== 'Ruch pionka' ||
                                (gameData.diceThrowResult !== 1 &&
                                    gameData.diceThrowResult !== 6)
                            "
                            @click="() => pawnMovement(pawnIndex)"
                        />
                    </div>
                </div>

                <!-- MAPA -->
                <div class="main-map">
                    <div
                        v-for="field in generateGameMap()"
                        :key="field"
                        :class="{
                            'main-map-field': field !== 0,
                            'starting-field': !((field - 1) % 10),
                            'finish-field': field > 90,
                        }"
                        :data-number="field > 90 ? field % 10 : null"
                        :style="`--bg-color: ${field < 90 ? getColor(field) : getFinishFieldColor(field)}`"
                    >
                        <!-- <span v-if="field !== 0">{{ field }}</span> -->

                        <button
                            v-if="
                                (Boolean(field) &&
                                    Boolean(gameData.gameMap[field - 1])) ||
                                isPawnOnFinish(field)
                            "
                            :style="`--background: ${getPawnColor(field)}`"
                            class="ludo-pawn"
                            :class="{
                                'your-pawn':
                                    (isPawnOnFinish(field)
                                        ? getPublicIdFromFieldFinish(field) ===
                                          gameData.yourPublicId
                                        : gameData.gameMap[field - 1][0] ===
                                          gameData.yourPublicId) &&
                                    gameData.yourTurn &&
                                    gameData.currentAction === 'Ruch pionka',
                            }"
                            :disabled="
                                (isPawnOnFinish(field)
                                    ? getPublicIdFromFieldFinish(field)
                                    : gameData.gameMap[field - 1][0]) !==
                                    gameData.yourPublicId ||
                                gameData.currentAction !== 'Ruch pionka'
                            "
                            @click="() => pawnMovement(getPawnId(field))"
                        />

                        <span
                            v-else-if="(field - 1) % 10 === 0 && field < 90"
                            class="s-field"
                        >
                            <img :src="Start" alt="" />
                            <!-- {{ playersFields[] }} -->
                        </span>
                        <!-- <span v-else-if="field !== 0">
                            {{field}}
                        </span> -->
                    </div>
                </div>
            </div>

            <div class="gameInfo" :class="{ myTurn: gameData.yourTurn }">
                
                <h2 class="whos-turn" :class="{ 'opacity-0': hideRolled }">
                    {{ gameData.actionMessage }}
                </h2>

                <h3
                    class="rolled"
                    :class="{
                        'opacity-0':
                            gameData.currentAction !== 'Ruch pionka' ||
                            hideRolled,
                    }"
                >
                    Wyrzucono {{ gameData.diceThrowResult }}
                </h3>

                <!-- <div class="dice"  @click="rollDice">
                    Rzuć kością
                </div> -->

                 <Dice
                  class="dice"
                    :trigger="trigger"
                    :new-value="gameData.diceThrowResult"
                    color="#ffffff"
                    colorBackground="#2063f3"
                     @click="rollDice"
                     :size="80"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");

.background {
     display: grid;
    place-items: center;
    width: 100%;
    height: 100vh;
    background-color: #0966a5;
    background: linear-gradient(
        180deg,
        rgba(67, 164, 230, 1) 0%,
        rgba(40, 143, 211, 1) 10%,
        rgba(25, 119, 181, 1) 74%,
        rgba(14, 96, 150, 1) 96%,
        rgba(13, 89, 140, 1) 100%
    );
    overflow: hidden;
}

.game {
    width: 1920px;
    height: 950px;
    transform-origin: top left;
    margin-block: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

// Game Map

.map {
      border-radius: 0.5rem;
    --map-padding: 3rem;
    position: relative;
    width: 900px;
    aspect-ratio: 1 / 1;
    background-color: blue;
    padding: 3rem;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    background: linear-gradient(180deg, #fcfaf5, #e2d7c4);

    .player-base {
        inset: var(--map-padding) auto auto var(--map-padding);
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        width: 175px;
        height: 175px;
        background-color: red;
        border-radius: 50%;
        // border: 4px solid black;
        position: absolute;
        place-items: center;
        padding: 1.75rem;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
            rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

        background-image: linear-gradient(
            211deg,
            var(--background) 0%,
            hsl(from var(--background) h s calc(l * 0.8)) 80%
        );

        .base-field {
            display: grid;
            place-items: center;
            border-radius: 50%;
            border: inset 2px
                hsla(from var(--background) h s calc(l * 0.1) / 0.2);
            background-color: hsl(from var(--background) h s calc(l * 0.4));
            width: 50px;
            height: 50px;
        }
    }

    .username {
        font-family: "Caveat Brush";

        font-size: 1.75rem;
        position: absolute;
        top: -2.5rem;
    }

    [data-player="1"] {
        inset: var(--map-padding) var(--map-padding) auto auto;
    }

    [data-player="2"] {
        inset: auto var(--map-padding) var(--map-padding) auto;
    }

    [data-player="3"] {
        inset: auto auto var(--map-padding) var(--map-padding);
    }
}

.dice {
    cursor: pointer;
    margin-bottom: 6rem;
}

.ludo-pawn {
    width: 40px;
    height: 40px;

    transition:
        scale 0.2s,
        box-shadow 0.2s;
    background-color: hsl(from var(--background) h s calc(l * 1.2));
    border-radius: 50%;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.349);
    box-shadow:
        inset 0 6px 8px rgba(255, 255, 255, 0.76),
        /* highlight góry */ inset 0 -6px 10px rgba(0, 0, 0, 0.247),
        0 4px 6px rgba(0, 0, 0, 0.308);

    &.your-pawn:hover {
        cursor: pointer;
        background-color: hsl(from var(--background) h s calc(l * 0.9));
        transform: scale(1.05);
        box-shadow:
            0 0 5px rgba(255, 255, 255, 0.301),
            inset 0 6px 8px rgba(255, 255, 255, 0.76),
            /* highlight góry */ inset 0 -6px 10px rgba(0, 0, 0, 0.247),
            0 4px 6px rgba(0, 0, 0, 0.308);
    }
}

.main-map {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: repeat(11, 1fr);

    .main-map-field {
        background-color: #fff;
        width: 95%;
        height: 95%;
        border-radius: 50%;
        border: 1px solid black;
        display: grid;
        place-items: center;
        font-size: 1.25rem;
        font-weight: bold;

        background-color: hsl(from var(--bg-color) h s calc(l * 1.5));
    }

    .starting-field:not(.finish-field) {
        background-color: var(--bg-color);
    }

    .s-field {
        font-family: sans-serif;
        border-radius: 0;
        display: block;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        line-height: 1;
        img {
            width: 90%;
        }
    }

    .finish-field {
        border-radius: 0;
        width: 90%;
        position: relative;
        height: 90%;

        background-color: hsl(from var(--bg-color) h s calc(l * 1));

        &::after {
            content: "";
            display: grid;
            place-items: center;
            position: absolute;
            inset: 5px;
            background-color: rgba(255, 255, 255, 0.164);
            box-shadow: rgb(255, 255, 255) 0px 0px 15px;
            background-image: url("./trophy.svg");
            background-position: center;
            background-size: 50%;
            background-repeat: no-repeat;
        }

        &:has(.ludo-pawn)::after {
            content: none;
        }
    }
}

// Game info

.gameInfo {
    width: 500px;
   font-family: "Open sans";
    height: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    position: relative;

    transition: background 0.1s;

    background: linear-gradient(180deg, #fcfaf5, #e2d7c4);

    &.myTurn {
        background: linear-gradient(
            180deg,
            hsl(41, 93%, 88%),
            hsl(38, 84%, 83%)
        );
    }

  border-radius: 0.5rem;
}

.paused {
    position: absolute;
    z-index: 9998;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.745);
    display: grid;
    color: white;
    font-family: sans-serif;
    place-items: center;
    h1 {
        max-width: 700px;
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    h2 {
        font-size: 1.5rem;
    }
}

.rolled {
    font-size: 2.25rem;
    margin-block: auto;
}

.opacity-0 {
    color: transparent;
}

.game-title {
    font-size: 3.5rem;
    font-style: italic;
    font-weight: bold;
}

.whos-turn {
    font-family: "Open sans";
    text-align: center;

    font-size: 2.25rem;
    margin: 1rem 0;
}

.hide {
    opacity: 0;
}
</style>
