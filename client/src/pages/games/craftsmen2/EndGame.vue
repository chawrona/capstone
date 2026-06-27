<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import ArrowSmall from "@/assets/games/gameAssets/craftsmen/arrowSmall.png";
import Board from "@/assets/games/gameAssets/craftsmen/board2.png";
import Cart from "@/assets/games/gameAssets/craftsmen/cart.png";
import Cobblestone from "@/assets/games/gameAssets/craftsmen/cobblestone.jpg";
import Coins from "@/assets/games/gameAssets/craftsmen/coins.png";
import Hourglass from "@/assets/games/gameAssets/craftsmen/glasshour.png";
import Hammer from "@/assets/games/gameAssets/craftsmen/hammer.png";
import HiddenTask from "@/assets/games/gameAssets/craftsmen/hiddenTask.png";
import NoCoins from "@/assets/games/gameAssets/craftsmen/noCoins.png";
import Reroll from "@/assets/games/gameAssets/craftsmen/reroll.png";
import Hat from "@/assets/games/gameAssets/craftsmen/trader_hat.png";
import Purse from "@/assets/games/gameAssets/craftsmen/trader_purse.png";

import { useAppStore } from "../../../store/useAppStore";
import { resourceImages } from "./composables_craftsmen/pathImages";
import Craftsman from "./Craftsman.vue"; /* Upewnij się, że ścieżka jest poprawna */

const props = defineProps(["endGameData", "lobbyId"]);

const store = useAppStore();
const router = useRouter();
const visible = ref(false);

onMounted(() => {
    requestAnimationFrame(() => {
        visible.value = true;
    });
});

const goBackToLobby = () => {
    router.push(`/${props.lobbyId}`);
};

const players = computed(() => {
    return Object.entries(props.endGameData)
        .filter(([key]) => key !== "global")
        .map(([publicId, data]) => ({ publicId, ...data }));
});

const global = computed(() => props.endGameData?.global);

const STAT_COLUMNS = [
    {
        icon: null,
        isContract: true,
        key: "contracts",
        label: "Zrealizowane kontrakty",
    },
    { icon: () => Coins, key: "coins", label: "Monety na koniec gry" },
    { icon: () => Coins, key: "coinsFromStanding", label: "Monety z pozycji" },
    {
        icon: () => NoCoins,
        key: "coinsPaidToOthers",
        label: "Opłaty dla innych",
        negative: true,
    } /* Usunięto negative: true */,
    { icon: () => ArrowSmall, key: "rotations", label: "Wykonane obroty" },
    { icon: () => Reroll, key: "rerolls", label: "Przerzuty kontraktów" },
    {
        icon: () => resourceImages?.amber,
        key: "amberSpent",
        label: "Wydany bursztyn",
    },
    { icon: () => Hat, key: "tradesBought", label: "Kupione towary" },
    { icon: () => Purse, key: "tradesSold", label: "Sprzedane towary" },
];

const rankedPlayers = computed(() => {
    const entries = Object.entries(props.endGameData)
        .filter(([key]) => key !== "global")
        .map(([publicId, data]) => ({ publicId, ...data }));

    return entries.sort((a, b) => {
        if (b.contracts !== a.contracts) return b.contracts - a.contracts;
        const coinsA = a.stats?.coins ?? 0;
        const coinsB = b.stats?.coins ?? 0;
        return coinsB - coinsA;
    });
});

const MEDALS = ["🥇", "🥈", "🥉", ""];
const MEDAL_COLORS = [
    "#f5d97a",
    "#c0c0c0",
    "#cd7f32",
    "rgba(255,255,255,0.15)",
];
const MEDAL_LABELS = ["1. miejsce", "2. miejsce", "3. miejsce", "4. miejsce"];

function getStatValue(player, key) {
    if (key === "contracts") return player.contracts ?? 0;
    if (key === "coins") return player.stats?.coins ?? 0;
    return player.stats?.[key] ?? 0;
}

const bestPerStat = computed(() => {
    const result = {};
    for (const col of STAT_COLUMNS) {
        let best = null;
        let bestVal = col.negative ? Infinity : -Infinity;
        for (const p of rankedPlayers.value) {
            const val = getStatValue(p, col.key);
            if (col.negative ? val < bestVal : val > bestVal) {
                bestVal = val;
                best = p.publicId;
            }
        }
        result[col.key] = best;
    }
    return result;
});
</script>

<template>
    <div class="overlay" :class="{ visible }">
        <div class="content">
            <header class="header">
                <h1 class="title">Koniec Gry</h1>
                <div class="separator" />
            </header>

            <div v-if="global" class="global-stats">
                <div class="global-card">
                    <div>
                        <div class="stat-label">
                            Łączna liczba tur:
                            <span class="stat-value">{{
                                global.totalTurns
                            }}</span>
                        </div>
                    </div>
                    <img :src="Hourglass" class="stat-icon" alt="czas" />
                </div>
                <div class="global-card"></div>
                <div v-if="global.mostValuableResource" class="global-card">
                    <div>
                        <div class="stat-label">
                            Najcenniejszy surowiec:
                            <span class="stat-value">{{
                                global.mostValuableResource
                            }}</span>
                        </div>
                    </div>
                    <img
                        :src="resourceImages[global.mostValuableResource]"
                        class="stat-icon"
                        :alt="global.mostValuableResource"
                    />
                </div>
            </div>
            <div class="stats-table-wrapper">
                <div class="stats-table-scroll">
                    <table class="stats-table">
                        <thead>
                            <tr>
                                <th class="col-stat">Statystyka</th>
                                <th
                                    v-for="(player, index) in rankedPlayers"
                                    :key="player.publicId"
                                    class="col-player"
                                >
                                    <span class="th-medal">{{
                                        MEDALS[index]
                                    }}</span>
                                    <span class="th-name">{{
                                        player.username
                                    }}</span>
                                    <Craftsman
                                        :color="player.color.hex"
                                        class="craftsman"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="col in STAT_COLUMNS" :key="col.key">
                                <td class="col-stat">
                                    <div class="stat-cell-label">
                                        <img
                                            v-if="col.icon"
                                            :src="col.icon()"
                                            class="table-icon"
                                            :alt="col.label"
                                        />
                                        <img
                                            v-else-if="col.isContract"
                                            :src="Board"
                                            class="table-icon"
                                            :alt="col.label"
                                        />
                                        {{ col.label }}
                                    </div>
                                </td>
                                <td
                                    v-for="player in rankedPlayers"
                                    :key="player.publicId"
                                    class="col-player"
                                    :class="{
                                        'cell-best':
                                            bestPerStat[col.key] ===
                                            player.publicId,
                                        'cell-negative': col.negative,
                                    }"
                                >
                                    <span class="cell-val">{{
                                        getStatValue(player, col.key)
                                    }}</span>
                                    <span
                                        v-if="
                                            bestPerStat[col.key] ===
                                            player.publicId
                                        "
                                        class="cell-star"
                                        >★</span
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <button class="back-btn" @click="goBackToLobby">
                <img :src="Cobblestone" class="btn-bg" alt="" />
                <span>Powrót do lobby</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;

    z-index: 9999999;
    color: white;
    overflow-y: auto;
    opacity: 0;
    transition: opacity 0.8s ease;
    font-family: sans-serif;
}

.overlay.visible {
    opacity: 1;
}

@keyframes twinkle {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 0.6;
    }
}

/* Layout */
.content {
    position: relative;
    z-index: 1;
    max-width: 1600px;
    margin: 0 auto;
    padding: 1rem 1.5rem 0;
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 2rem;
}
.crown {
    font-size: 3rem;
    filter: drop-shadow(0 0 16px gold);
    animation: floatCrown 3s ease-in-out infinite;
}
@keyframes floatCrown {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}
.title {
    font-size: clamp(2rem, 6vw, 3.5rem);
    letter-spacing: 0.15em;
    background: linear-gradient(135deg, #f5d97a, #e8a830, #f5d97a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0.4rem 0;
    text-shadow: none;
}
.separator {
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e8a830, transparent);
    margin: 0.8rem auto 0;
}

/* Global stats */
.global-stats {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
    flex-direction: column;
}

.global-card {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1.5rem;
}
.stat-icon {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
}
.stat-label {
    font-size: 1.25rem;
    color: rgb(216, 216, 216);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
.wheat {
    margin-left: 2rem;
}
.stat-value {
    font-size: 1.25rem;

    color: #e8a830;
}

/* Back button */
.back-btn {
    display: block;
    position: relative;
    margin: 0 auto;
    padding: 0.65rem 1.8rem;
    font-size: 1.25rem;
    font-weight: bold;
    color: #1a0a0a;
    background: linear-gradient(135deg, #f5d97a, #c8880a);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}
.back-btn:hover {
    filter: brightness(1.2);
}
.back-btn:active {
    transform: translateY(0);
}
.btn-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.12;
    image-rendering: pixelated;
}
.back-btn span {
    position: relative;
    z-index: 1;
}

/* PODIUM */
.podium-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2.5rem;
}

.place-1 {
    background: rgba(245, 217, 122, 0.08);
}
.place-2 {
    background: rgba(192, 192, 192, 0.06);
}
.place-3 {
    background: rgba(205, 127, 50, 0.06);
}

.podium-place-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.75rem;
}
.podium-craftsman-wrapper {
    width: 60px;
    height: 60px;
    margin: 0 auto 0.75rem;
}
.podium-name {
    font-family: "Cinzel", serif;
    font-size: 0.95rem;
    color: #f0e8d0;
    margin-bottom: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.podium-scores {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
}
.podium-score-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
}
.podium-score-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}
.podium-score-val {
    font-size: 1.3rem;
    font-weight: 700;
    color: #f0e8d0;
    line-height: 1;
}
.podium-score-label {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}
.podium-score-divider {
    width: 1px;
    height: 32px;
    background: rgba(255, 255, 255, 0.12);
}

/* TABELA */
.stats-table-wrapper {
    margin-bottom: 2rem;
}
.stats-table-scroll {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.stats-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem; /* Zwiększony font */
}
.stats-table thead tr {
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.stats-table th {
    padding: 0.8rem 1rem;
    font-weight: 600;
    color: #d8d8d8;
    text-align: center;
    white-space: nowrap;
}
.stats-table th.col-stat {
    text-align: left;
}

.col-player .craftsman {
    width: 1.25rem;
    display: inline-block;
    margin-left: 0.3rem;
    transform: translateY(3px);
}

.th-medal {
    margin-right: 0.3rem;
    filter: brightness(1);
}
.th-name {
    color: #d8d8d8;
}

.stats-table tbody tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background 0.15s;
}
.stats-table tbody tr:hover {
    background: rgba(255, 255, 255, 0.04);
}
.stats-table tbody tr:last-child {
    border-bottom: none;
}

td {
    padding: 0.75rem 1rem;
    text-align: center;
    color: rgb(226, 226, 226);
}
td.col-stat {
    text-align: left;
}

.stat-cell-label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #d8d8d8;
    white-space: nowrap;
}
.table-icon {
    width: 24px;
    height: 24px; /* Powiększone ikony */
    object-fit: contain;
    opacity: 0.85;
    /* Usunięte image-rendering: pixelated */
}

tr:not(:first-of-type) .col-player:not(.cell-best) {
    background-color: rgba(17, 17, 17, 0.39);
}

.cell-best {
    background: rgba(228, 213, 75, 0.137);
    color: #eaaf3b;
    font-weight: 700;
    position: relative;
}
.cell-negative.cell-best {
    background: rgba(228, 75, 75, 0.336);
    color: #ea3b3b;
}

.cell-negative .cell-star {
    color: #ea3b3b;
}

.cell-val {
    position: relative;
    z-index: 1;
}
.cell-star {
    font-size: 0.65rem;
    color: #eaaf3b;
    margin-left: 0.2rem;
    vertical-align: super;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
