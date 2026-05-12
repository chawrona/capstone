<script setup>
import { computed, ref } from "vue";

import Axe from "@/assets/games/gameAssets/brianboru/axe.png";
import Church from "@/assets/games/gameAssets/brianboru/church.png";
import Letter from "@/assets/games/gameAssets/brianboru/letter.png";
import MoneyMinus from "@/assets/games/gameAssets/brianboru/money_minus.png";
import MoneyPlus from "@/assets/games/gameAssets/brianboru/money_plus.png";
import Money from "@/assets/games/gameAssets/brianboru/money.png";
import Rysa from "@/assets/games/gameAssets/brianboru/rysa.png";
import Triquetra5 from "@/assets/games/gameAssets/brianboru/triquetra_5.png";
import Triquetra from "@/assets/games/gameAssets/brianboru/triquetra.png";
import VikingShield from "@/assets/games/gameAssets/brianboru/viking_shield.png";

import statuses from "../../../../../../../server/models/games/brianboru/config/statuses";
import { soundBus } from "../../../../../audio/soundBus";
import { useAppStore } from "../../../../../store/useAppStore";
import Card from "../Card.vue";

const assetsMap = {
    axe: Axe,
    church: Church,
    letter: Letter,
    money: Money,
    money_minus: MoneyMinus,
    money_plus: MoneyPlus,
    triquetra: Triquetra,
    triquetra_5: Triquetra5,
    viking_shield: VikingShield,
};

const props = defineProps(["chosenCards", "you", "status"]);
const store = useAppStore();

const canChoose = computed(() => {
    return props.status === statuses.CHOOSE_CARD_EFFECT;
});

const canChooseHover = (player) => {
    return canChoose.value && player.username === props.you.username;
};

const chosenCard = ref(null);
const chosenBottom = ref("bottom1");
const dialogOpen = ref(false);
const bottomResources = computed(() => chosenCard.value[chosenBottom.value]);
const doesContainResource = computed(() => {
    return bottomResources.value.some((resource) =>
        ["church", "letter", "axe", "viking_shield"].includes(resource),
    );
});
const containedResource = computed(() => {
    const resources = new Set(bottomResources.value);
    if (resources.has("church")) return "church";
    if (resources.has("letter")) return "letter";
    if (resources.has("axe")) return "axe";
    if (resources.has("viking_shield")) return "viking_shield";
    return false;
});

const additionalResource = ref(0);
const buyingCity = ref(false);
const canYouBuyACity = computed(() => {
    if (!props.you.canExpand) return false;

    return (
        props.you.money +
            bottomResources.value.reduce(
                (acc, d) => (acc += d === "money_plus" ? 1 : 0),
                0,
            ) >=
        5
    );
});

const useCardEffect = (bottom, card) => {
    if (props.chosenCards.length > 1 && chosenBottom.value === "top") return;
    if (props.status !== statuses.CHOOSE_CARD_EFFECT) return;
    chosenCard.value = card;
    chosenBottom.value = bottom;
    additionalResource.value = 0;
    buyingCity.value = false;

    if (!doesContainResource.value && chosenBottom.value === "top") {
        activateCardEffect();
    } else {
        dialogOpen.value = true;
        soundBus.playEffect("selectCardEffect");
    }
};

const closeDialog = () => {
    soundBus.playEffect("click");
    dialogOpen.value = false;
};

const canManipulate = computed(() => {
    const moneyInTop = bottomResources.value.reduce(
        (acc, d) => (acc += d === "money_plus" ? 1 : 0),
        0,
    );

    const howManySubstractMoneyShow = Math.max(
        additionalResource.value * 2 - moneyInTop,
        0,
    );

    const money = Math.floor((props.you.money + moneyInTop) / 2);
    let cantAdd = money - additionalResource.value > 0;
    let cantSubstract = additionalResource.value > 0;

    return {
        add: !cantAdd,
        howManySubstractMoneyShow,
        money: moneyInTop,
        substract: !cantSubstract,
    };
});

const addResource = () => additionalResource.value++;
const substractResource = () => additionalResource.value--;
const buildCity = () => (buyingCity.value = true);
const DontBuildCity = () => (buyingCity.value = false);

const activateCardEffect = () => {
    store.emit("gameData", {
        data: {
            buildCity: buyingCity.value,
            buyAdditional: additionalResource.value,
            chosenBottom: chosenBottom.value,
        },
        eventName: "chooseCardEffect",
    });
    closeDialog();
};
</script>

<template>
    <div v-if="dialogOpen" class="dialog" :data-type="chosenCard.type">
        <h1 class="dialogTitle">Efekt karty</h1>

        <h2 class="cardId">
            {{ chosenCard.id }}
        </h2>

        <div class="dialogContent">
            <div v-if="doesContainResource">
                {{
                    bottomResources[0] === "axe"
                        ? " Czy chcesz nająć dodatkowych wikingów?"
                        : bottomResources[0] === "letter"
                          ? " Czy chcesz zakupić dodatkowe listy?"
                          : bottomResources.includes("viking_shield")
                            ? "Brian Boru odbija Twoje miasto z rąk wikingów"
                            : " Czy chcesz dokupić miejsce w kościele?"
                }}
            </div>

            <div v-else-if="canYouBuyACity">
                <p>Czy chcesz zbudować miasto?</p>
            </div>

            <div class="buyingAdditional">
                <button
                    v-if="
                        doesContainResource &&
                        !bottomResources.includes('viking_shield')
                    "
                    :disabled="canManipulate.substract"
                    @click="substractResource"
                >
                    -
                </button>
                <button
                    v-if="canYouBuyACity && !doesContainResource"
                    :disabled="!buyingCity"
                    @click="DontBuildCity"
                >
                    -
                </button>
                <div class="bottom1">
                    <!-- BOTTOM 2 -->
                    <span
                        v-if="
                            chosenBottom === 'bottom2' || chosenBottom === 'top'
                        "
                    >
                        <span
                            v-for="(
                                value, index
                            ) in canManipulate.howManySubstractMoneyShow"
                            :key="index"
                        >
                            <img class="resource-image" :src="MoneyMinus" />
                        </span>
                    </span>

                    <span v-if="chosenBottom === 'bottom2'">
                        <span
                            v-for="(value, index) in bottomResources.length +
                            additionalResource"
                            :key="index"
                        >
                            <img
                                class="resource-image"
                                :src="assetsMap[bottomResources[0]]"
                            />
                        </span>
                        <img
                            v-if="bottomResources.includes('viking_shield')"
                            class="resource-image"
                            :src="VikingShield"
                        />
                    </span>

                    <!-- TOP -->

                    <span v-if="chosenBottom === 'top'">
                        <span
                            v-for="(value, index) in bottomResources.length -
                            canManipulate.money -
                            1 +
                            additionalResource"
                            :key="index"
                        >
                            <img
                                class="resource-image"
                                :src="assetsMap[containedResource]"
                            />
                        </span>
                    </span>

                    <span
                        v-if="
                            chosenBottom === 'top' && additionalResource === 0
                        "
                    >
                        <span
                            v-for="(value, index) in canManipulate.money"
                            :key="index"
                        >
                            <img class="resource-image" :src="Money" />
                        </span>
                    </span>

                    <span v-if="chosenBottom === 'top'">
                        <img class="resource-image" :src="Triquetra" />
                    </span>

                    <!-- BOTTOM 1 -->

                    <span
                        v-if="
                            doesContainResource &&
                            !buyingCity &&
                            chosenBottom === 'bottom1'
                        "
                    >
                        <span
                            v-for="(value, index) in bottomResources.length - 1"
                            :key="index"
                        >
                            <img
                                class="resource-image"
                                :src="assetsMap[bottomResources[0]]"
                            />
                        </span>
                    </span>

                    <span
                        v-if="
                            !doesContainResource &&
                            !buyingCity &&
                            chosenBottom === 'bottom1'
                        "
                    >
                        <span
                            v-for="(value, index) in bottomResources.length - 1"
                            :key="index"
                        >
                            <img
                                class="resource-image"
                                :src="assetsMap[bottomResources[0]]"
                            />
                        </span>
                    </span>

                    <span
                        v-if="
                            !doesContainResource &&
                            buyingCity &&
                            chosenBottom === 'bottom1'
                        "
                    >
                        <span
                            v-for="(value, index) in 5 -
                            bottomResources.length +
                            1"
                            :key="index"
                        >
                            <img
                                class="resource-image"
                                style="scale: 0.84"
                                :src="MoneyMinus"
                            />
                        </span>
                    </span>

                    <span
                        v-if="
                            !doesContainResource && chosenBottom === 'bottom1'
                        "
                    >
                        <img
                            class="resource-image"
                            :src="Triquetra5"
                            :style="`opacity: ${buyingCity ? 1 : 0.4}`"
                        />
                    </span>
                </div>
                <button
                    v-if="
                        doesContainResource &&
                        !bottomResources.includes('viking_shield')
                    "
                    :disabled="canManipulate.add"
                    @click="addResource"
                >
                    +
                </button>
                <button
                    v-if="canYouBuyACity && !doesContainResource"
                    :disabled="buyingCity"
                    @click="buildCity"
                >
                    +
                </button>
            </div>

            <!-- <Card 
                :card="chosenCard"
                :owner="props.player"
                class="dialogCard"
            /> -->
        </div>
        <div class="buttons">
            <button
                v-if="chosenBottom !== 'top'"
                class="dialogButton blueButton"
                @click="closeDialog"
            >
                Przemyślę to
            </button>
            <button class="dialogButton blueButton" @click="activateCardEffect">
                Aktywuj Efekt
            </button>
        </div>
    </div>

    <div class="chosenCards">
        <div
            v-for="([card, player], i) in props.chosenCards"
            :key="i"
            class="wrap"
            :style="`--color: ${player.color.hex};`"
            :data-type="card.type"
        >
            <Card
                :key="card.id"
                :card="card"
                :can-choose="canChooseHover(player)"
                :choose-bottoms="
                    statuses.CHOOSE_CARD_EFFECT === props.status &&
                    props.chosenCards.length !== 1 &&
                    canChooseHover(player)
                "
                :choose-top="
                    statuses.CHOOSE_CARD_EFFECT === props.status &&
                    props.chosenCards.length === 1 &&
                    canChooseHover(player)
                "
                :owner="player"
                :callback="useCardEffect"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.wrap {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}

.chosenCards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // background-color: rgba(255, 0, 0, 0.404);
    position: absolute;
    top: 8rem;
    height: 80%;
    justify-content: start;
    align-content: start;
    align-items: start;

    width: 350px;

    transform: scale(0.9);
    gap: 1rem;
    left: 8%;
    padding-bottom: 0.5rem;
}

[data-type="red"] .username {
    background-color: rgb(138, 0, 0);
}

[data-type="blue"] .username {
    background-color: rgb(0, 64, 142);
}

[data-type="yellow"] .username {
    background-color: rgb(136, 118, 0);
}

[data-type="gray"] .username {
    background-color: rgb(119, 119, 119);
}

.username {
    z-index: 2;
    //  height: 220px;
    //  width: 1.2rem;
    width: 145px;
    box-shadow: 0px 4px 4px 3px rgba(0, 0, 0, 0.658);
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    display: block;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.1px;
    margin-inline: auto;
    text-align: center;
    display: block;
    padding: 0.25rem 0.5rem;
    // text-orientation: sideways;
    //  writing-mode: sideways-lr;
    color: white;
}

.dialog {
    position: absolute;
    top: 50%;
    font-family: "MedievalSharp";
    left: 50%;
    transform: translate(-50%, -65%);

    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    height: 300px;
    min-width: 650px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;
    color: white;
    font-weight: normal;

    z-index: 30;
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_grey.webp");

    &[data-type="red"] {
        background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_red.webp");
    }
    &[data-type="blue"] {
        background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_blue.webp");
    }
    &[data-type="yellow"] {
        background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_yellow.webp");
    }

    background-size: cover;
    gap: 0.5rem;

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }
    .dialogContent {
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }
    .dialogButton {
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem 1.75rem;

        &[disabled="true"] {
            color: red;
        }
    }
}

.buyingAdditional {
    display: flex;
    gap: 0.5rem;
    width: max-content;
    justify-content: center;

    button {
        display: block;
        aspect-ratio: 1 / 1;

        background-image: url("/src/assets/games/gameAssets/brianboru/white_card.png");
        border-radius: 0.2rem;
        border: none;
        font-weight: bold;
        font-size: 1.5rem;
        font-family: "MedievalSharp";
        box-shadow: 1px 1px 5px black;
        cursor: pointer;

        &:hover {
            filter: brightness(0.9);
        }
    }
}

.bottom1 {
    display: flex;
    justify-content: center;
    gap: 0.3rem;
    height: 45px;
    padding: 0.5rem;
    width: 100%;
    min-width: 400px;
    align-items: center;
    background-color: #fff;
    background-image: url("/src/assets/games/gameAssets/brianboru/white_card.png");

    // border: 3px solid #940a0a;

    border-radius: 0.2rem;

    box-shadow: 1px 1px 5px black;

    img {
        width: 40px;
    }

    & > span {
        display: flex;
        justify-content: center;
        gap: 0.3rem;
    }
}

.buttons {
    display: flex;
    gap: 1rem;
}

.cardId {
    position: absolute;
    top: 1.75rem;
    font-size: 2.5rem;
    left: 2.2rem;
}

.blueButton {
    font-weight: normal;
}
</style>
