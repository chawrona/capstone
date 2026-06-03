<script setup>
import { resourceImages } from "./composables_craftsmen/pathImages.js";
import { useResourceFlyIn } from "./composables_craftsmen/useResourceFlyIn.js";
import Craftsman from "./Craftsman.vue";

const props = defineProps(["players", "you", "currentPlayerIndex"]);
const { flyingIn } = useResourceFlyIn(() => props.players);

const resourcesWithKeys = (inv, publicId) =>
    Object.entries(inv).flatMap(([name, count]) =>
        Array.from({ length: count }, (_, i) => ({
            key: `${publicId}:${name}:${i}`,
            name,
        })),
    );
</script>

<template>
    <div class="players">
        <div
            class="point"
            :style="`--index: ${props.currentPlayerIndex}`"
        ></div>
        <div
            v-for="(player, index) in props.players"
            :key="index"
            class="player"
        >
            <div class="player-name">
                <div class="contracts">
                    <div
                        v-for="(contact, i) in player.contracts"
                        :key="i"
                        class="contract"
                    />
                </div>

                <span class="coins-amount">{{ player.coins }}</span>
                <img :src="resourceImages['coins']" alt="" class="coins" />
                <span v-if="player.publicId === props.you.publicId">(Ty)</span>
                <h1>{{ player.username }}</h1>
                <Craftsman
                    v-for="(craftsmen, c) in player.craftsmen"
                    :key="c"
                    :color="player.color.hex"
                    class="player-icon"
                    :clickable="true"
                />
            </div>

            <div class="inventory">
                <TransitionGroup name="res">
                    <div
                        v-for="{ name, key } in resourcesWithKeys(
                            player.inventory,
                            player.publicId,
                        )"
                        :key="key"
                        class="resource"
                        :data-fly-key="key"
                        :data-resource="name"
                        :class="{ 'fly-in': flyingIn.has(key) }"
                    />
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.players {
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;

    gap: 1.5rem;

    position: absolute;
    top: 20%;

    right: 2.6rem;

    color: rgb(0, 0, 0);

    .player {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: center;
        gap: 0.25rem;
        font-size: 1.5rem;

        &-name {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
            color: #e3edfd;

            /* 2. Odpowiednie pogrubienie fontu pomaga na wzorzystym tle */
            font-weight: 800;

            /* 3. Wyraźny cień (Drop Shadow) */
            /* Składnia: przesunięcie-X | przesunięcie-Y | rozmycie | kolor */
            text-shadow: 2px 3px 3px rgba(0, 0, 0, 0.85);
        }

        &-icon {
            transform: translateY(1px);
            width: 1.8rem;
            height: 1.8rem;
            filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.534));
        }

        .coins-amount {
            font-size: 1.2rem;
            transform: translateY(-1px);
        }

        .coins {
            margin-left: -0.15rem;
            width: 1.6rem;
            height: 1.6rem;
        }
    }

    .contracts {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 0.3rem;
        margin-top: 0.25rem;
        transform: translateY(0px);
    }

    .contract {
        height: 1.8rem;
        aspect-ratio: 5 / 7;
        background-color: white;
        box-shadow: 1px 1px 1px 0px rgba(51, 48, 48, 0.671);
        background-size: contain;
        background-position: center;
        background-image: url("/src/assets/games/gameAssets/craftsmen/board2.png");
    }
}

.inventory {
    display: flex;
    gap: 0.1rem;
}

.resource {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;

    filter: drop-shadow(2px 2px 5px black);

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
}

.point {
    position: absolute;
    top: 0;
    right: -0.25rem;
    transform: translateX(100%)
        translateY(calc(0.35rem + var(--index) * 5.5rem));
    width: 2rem;
    height: 2rem;

    transition: transform 0.2s;
    background-image: url("/src/assets/games/gameAssets/craftsmen/glasshour.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}

@keyframes resource-fly-in {
    0% {
        transform: translate(var(--ox, 0px), var(--oy, 0px)) scale(2.5);
        opacity: 0.9;
        filter: drop-shadow(0 0 10px gold) brightness(1.5);
        z-index: 999;
    }
    30% {
        opacity: 1;
    }
    80% {
        transform: translate(0, 0) scale(1.1);
        filter: drop-shadow(2px 2px 5px black);
    }
    100% {
        transform: translate(0, 0) scale(1);
        filter: drop-shadow(2px 2px 5px black);
    }
}

.resource.fly-in {
    animation: resource-fly-in 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    position: relative;
    z-index: 100;
}
</style>
