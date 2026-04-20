<script setup>
import { reactive } from "vue";

import City from "@/assets/games/gameAssets/brianboru/citiesReq.png";
import Points from "@/assets/games/gameAssets/brianboru/points.png";

import PlayerIcon from "./PlayerIcon.vue"; // Dodany import komponentu

const props = defineProps(["regions"]);

// stan flip dla każdego regionu
const flipped = reactive({});

const toggle = (region) => {
    flipped[region] = !flipped[region];
};
</script>

<template>
    <!-- <pre>

        {{ regions["Southern Uí Néill"] }}
   
    </pre> -->
    <div>
        <div class="point seven munster" @click="toggle('Munster')">
            <div v-if="!flipped['Munster']" class="wrap">
                <span class="value">7</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">5</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Munster</span>
                <span
                    v-for="(player, index) in regions['Munster']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point seven connaught" @click="toggle('Connaught')">
            <div v-if="!flipped['Connaught']" class="wrap">
                <span class="value">7</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">5</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Connaught</span>
                <span
                    v-for="(player, index) in regions['Connaught']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point six northern" @click="toggle('Northern')">
            <div v-if="!flipped['Northern']" class="wrap">
                <span class="value">6</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">4</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Northern <br />Uí Néill</span>
                <span
                    v-for="(player, index) in regions['Northern Uí Néill']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point six leintser" @click="toggle('Leinster')">
            <div v-if="!flipped['Leinster']" class="wrap">
                <span class="value">6</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">4</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Leinster</span>
                <span
                    v-for="(player, index) in regions['Leinster']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point five southern" @click="toggle('Southern')">
            <div v-if="!flipped['Southern']" class="wrap">
                <span class="value">5</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">3</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Southern <br />Uí Néill</span>
                <span
                    v-for="(player, index) in regions['Southern Uí Néill']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point four ulaid" @click="toggle('Ulaid')">
            <div v-if="!flipped['Ulaid']" class="wrap">
                <span class="value">4</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">3</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Ulaid</span>
                <span
                    v-for="(player, index) in regions['Ulaid']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point three breifne" @click="toggle('Bréifne')">
            <div v-if="!flipped['Bréifne']" class="wrap">
                <span class="value">3</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">2</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Bréifne</span>
                <span
                    v-for="(player, index) in regions['Bréifne']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>

        <div class="point three dublinn" @click="toggle('Dublinn')">
            <div v-if="!flipped['Dublinn']" class="wrap">
                <span class="value">2</span>
                <img :src="Points" alt="" class="icon" />
            </div>
            <div v-else class="wrap cityWrap">
                <span class="value">2</span>
                <img :src="City" alt="" class="icon" />
            </div>
            <div class="region-label">
                <span>Dublinn</span>
                <span
                    v-for="(player, index) in regions['Dublinn']"
                    :key="index"
                    class="owner-username"
                    :style="`transform: translateY(calc(110% * ${index}))`"
                >
                    <span
                        class="ownerColor"
                        :style="`color: ${player.color.hex}`"
                    />
                    {{ player.username }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.point {
    display: flex;
    position: absolute;
    font-weight: bold;
    color: white;
    align-items: center;
    font-family: "MedievalSharp";
    filter: drop-shadow(2px 2px 25px rgba(208, 226, 247, 0.683))
        drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.864));
}

/* Nowa klasa do ułożenia nazwy regionu i znacznika gracza jedno pod drugim */
.region-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.munster {
    top: 480px;
    left: 480px;
}

.connaught {
    top: 221px;
    left: 460px;
}

.northern.six {
    top: 60px;
    gap: 0.9rem;
    left: 875px;
}

.southern.five {
    top: 470px;
    left: 1257px;
    gap: 0.9rem;
}

.leintser {
    top: 764px;
    left: 1143px;
}

.ulaid {
    top: 148px;
    left: 1420px;
    font-weight: normal;
}

.breifne {
    top: 173px;
    left: 898px;
    font-weight: normal;

    .wrap {
        transform: translateY(-8%);
    }
}

.dublinn {
    top: 605px;
    left: 1225px;
    font-weight: normal;
}

.seven {
    font-size: 2.2rem;
    gap: 0.6rem;
    letter-spacing: 0.1px;

    .icon {
        width: 55px;
    }
    .value {
        font-size: 0.85em;
    }
}

.six {
    font-size: 1.9rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;

    .icon {
        width: 50px;
    }
    .value {
        transform: translate(-50%, -36%);
        font-size: 0.85em;
    }
}

.five {
    font-size: 1.9rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;

    .icon {
        width: 50px;
    }
    .value {
        transform: translate(-49%, -37%);
        font-size: 0.85em;
    }
}

.four {
    font-size: 1.9rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;

    .icon {
        width: 40px;
    }
    .value {
        transform: translate(-51%, -40%);
        font-size: 0.78em;
    }
}

.three {
    font-size: 1.7rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;

    .icon {
        width: 38px;
    }
    .value {
        transform: translate(-48%, -39%);
        font-size: 0.85em;
    }
}

.two {
    font-size: 1.7rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;

    .icon {
        width: 40px;
    }
    .value {
        font-size: 0.85em;
    }
}

.wrap {
    cursor: pointer;
    transform: translateY(-5%);
    position: relative;

    &:hover {
        filter: brightness(1.15);
    }

    &.cityWrap {
        .value {
            text-shadow: 0 0 5px black;
            transform: translate(-48%, -30%);
        }
    }
}

.value {
    position: absolute;
    top: 50%;
    left: 50%;
    color: white;
    transform: translate(-48%, -35%);
}

.region-label {
    position: relative;
}

.owner-username {
    display: flex;

    width: auto;
    position: absolute;
    bottom: -1em;
    left: 0.2em;
    font-size: 0.4em;
    font-weight: normal;
    gap: 0.3em;
    align-items: center;
}

.ownerColor {
    transform: translateY(-0.1em);
    display: inline-block;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
    background-color: currentColor;

    border: 1px solid rgba(0, 0, 0, 0.288);
    box-shadow:
        inset 0 0px 2px rgba(255, 255, 255, 0.576),
        inset 0 -1px 3px rgba(0, 0, 0, 0.116);
}
</style>
