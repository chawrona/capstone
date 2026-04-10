<script setup>
import Rysa from "@/assets/games/gameAssets/brianboru/rysa.png";
const props = defineProps([
    "card",
    "canChoose",
    "owner",
    "callback",
    "chooseBottoms",
    "chooseTop",
]);
</script>

<template>
    <div
        :type="props.card.type"
        :class="[
            'card',
            {
                chooseCard: props.canChoose,
                chosingBottoms: props.chooseBottoms,
                chosingTop: props.chooseTop,
            },
            $attrs.class,
        ]"
    >
            <img v-if="props.card.id === 25" :src="Rysa" class="rysa">
        <div class="cardData">
            <div class="top" @click="() => props.callback?.('top', card)">
                <span
                    class="cardId"
                    :class="{ owned: props.owner }"
                    :data-username="props.owner ? props.owner.username : ''"
                >
                    {{ props.card.id }}
                </span>
                <div class="topIcons">
                    <span v-for="(value, index) in props.card.top" :key="index">
                        <img
                            class="resource-image"
                            :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                            alt=""
                        />
                    </span>
                </div>
            </div>

            <div class="bottom">
                <div
                    class="bottom1"
                    :class="{
                        singleBottom: props.card.bottom2.length === 0,
                        lessGap: props.card.bottom1.length > 3,
                    }"
                    @click="() => props.callback?.('bottom1', card)"
                >
                    <span
                        v-for="(value, index) in props.card.bottom1"
                        :key="index"
                    >
                        <img
                            class="resource-image"
                            :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                            alt=""
                        />
                    </span>
                </div>
                <div
                    v-if="props.card.bottom2.length > 0"
                    class="bottom2"
                    :class="{ lessGap: props.card.bottom2.length > 3 }"
                    @click="() => props.callback?.('bottom2', card)"
                >
                    <span
                        v-for="(value, index) in props.card.bottom2"
                        :key="index"
                    >
                        <img
                            class="resource-image"
                            :src="`/src/assets/games/gameAssets/brianboru/${value}.png`"
                            alt=""
                        />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    position: relative;
    display: flex;
    justify-content: space-between;
    // height: 135px;
    // width: 225px;
    width: 145px;
    height: 220px;
    box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.658);
    border-radius: 0.25rem;
    overflow: hidden;
    flex-shrink: 0;
    transition: 0.1;

    &[type="red"] {
        background-color: rgb(138, 0, 0);
        background-image: url("/src/assets/games/gameAssets/brianboru/red_card.png");

        &::after {
            content: "";
            position: absolute;
            width: 75px;
            height: 75px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -32%);
            opacity: 0.1;
            background-image: url("/src/assets/games/gameAssets/brianboru/axe_white.png");
        }

        .cardNumber,
        .top {
            background-color: #5b080800;
            color: rgb(247, 160, 160);
        }

        // .bottom1,
        // .bottom2,
        // .topIcons {
        //     background-color: hsla(0, 84%, 17%, 0.443);
        // }
    }
    &[type="blue"] {
        background-color: rgb(0, 64, 142);
        background-image: url("/src/assets/games/gameAssets/brianboru/blue_card.png");

        &::after {
            content: "";
            position: absolute;
            width: 120px;
            height: 120px;
            top: 50%;
            left: 50%;
            background-repeat: no-repeat;
            background-position: center;
            object-fit: cover;
            transform: translate(-50%, -31%);
            opacity: 0.1;
            background-image: url("/src/assets/games/gameAssets/brianboru/church_white.png");
        }

        .cardNumber,
        .top {
            color: rgb(147, 172, 241);
        }
        // .bottom1,
        // .bottom2,
        // .topIcons {
        //     background-color: #0413455e;
        // }
    }
    &[type="yellow"] {
        background-color: rgb(136, 118, 0);
        background-image: url("/src/assets/games/gameAssets/brianboru/yellow_card.png");

        &::after {
            content: "";
            position: absolute;
            width: 120px;
            height: 120px;
            top: 50%;
            left: 50%;

            background-repeat: no-repeat;
            background-position: center;
            object-fit: cover;
            transform: translate(-50%, -45%);
            opacity: 0.1;
            background-image: url("/src/assets/games/gameAssets/brianboru/letter_white.png");
        }

        .cardNumber,
        .top {
            color: rgb(246, 244, 142);
        }
        // .bottom1,
        // .bottom2,
        // .topIcons {
        //     background-color: #3d38046b;
        //     background-color: #3d38046b;
        // }
    }
    &[type="gray"] {
        background-color: rgb(119, 119, 119);
        background-image: url("/src/assets/games/gameAssets/brianboru/gray_card.png");

        &::after {
            content: "";
            position: absolute;
            width: 75px;
            height: 75px;
            top: 50%;
            left: 50%;

            background-repeat: no-repeat;
            background-position: center;
            object-fit: cover;
            transform: translate(-50%, -29%);
            opacity: 0.1;
            background-image: url("/src/assets/games/gameAssets/brianboru/sword.svg");
        }

        .cardNumber,
        .top {
            // background-color: #1e1e1e86;
            color: rgb(224, 224, 224);
        }
        .bottom1,
        .bottom2,
        .topIcons {
            background-color: #5a5a5a6c;
        }
    }

    .cardData {
        display: flex;
        flex-direction: column;

        height: 100%;
        width: 100%;
    }

    .cardNumber {
        width: 12.5%;
        display: grid;
        place-items: center;
        font-weight: bold;
        text-align: center;
        text-shadow: 0 0 5px 5px black;
    }
}

.top {
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: left;
    transition: 0.2s;
    border-radius: 0.15rem;
    padding: 0.5rem;
    gap: 0.5rem;
    .cardId {
        display: grid;
        place-items: center;
        font-size: bold;
        font-size: 1.5rem;
        width: 20%;
        font-weight: bold;
        color: white;
        transform: translateY(2px);
    }

    .topIcons {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        border-radius: 0.2rem;
        gap: 0.3rem;
        height: 30px;
        padding: 0.5rem;
        box-shadow: 1px 1px 5px black;
        background-image: url("/src/assets/games/gameAssets/brianboru/white_card.png");
    }
}

.hidden .top {
    gap: 0.25rem;
    padding-top: 0.25rem;
}

.bottom {
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
    height: auto;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
}

.bottom1,
.bottom2 {
    display: flex;
    justify-content: center;
    gap: 0.3rem;
    height: 30px;
    padding: 0.5rem;
    width: 90%;
    align-items: center;
    background-color: #fff;
    background-image: url("/src/assets/games/gameAssets/brianboru/white_card.png");

    // border: 3px solid #940a0a;

    border-radius: 0.2rem;

    box-shadow: 1px 1px 5px black;
}

.singleBottom {
    align-items: center;
    height: 30px;
}

.resource-image {
    height: 25px;
}

.chooseCard {
    cursor: pointer;
    box-shadow: 0 0 5px 3px rgba(175, 218, 238, 0.712);
}

.chosingBottoms {
    filter: brightness(1.1);
    .bottom1,
    .bottom2 {
        cursor: pointer;
        filter: brightness(1);

        &:hover {
            filter: brightness(0.9);
        }
    }

    .topIcons {
        filter: brightness(0.7);
    }
}

.chosingTop {
    filter: brightness(1.1);
    .bottom1,
    .bottom2 {
        filter: brightness(0.7);
    }
    .top {
        cursor: pointer;
        filter: brightness(1);
        &:hover {
            filter: brightness(0.9);
        }
    }
}

.lessGap {
    gap: 0.15rem;
}

.top .owned {
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
    padding-inline: 1px;

    &::after {
        content: attr(data-username);
        position: absolute;
        inset: 0;
        display: grid;
        align-items: center;
        text-align: right;
        font-weight: normal;
        font-family: "MedievalSharp";
        opacity: 0.5;
        font-size: 0.8rem;
    }
}

.rysa {
    position: absolute;
    height: 35px;
    right: 20px;
    top: -8px;
}
</style>
