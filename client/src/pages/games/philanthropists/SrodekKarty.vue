<script setup>
defineProps({
    czyWyzerowane: Boolean,
    karta: Boolean,
    material: String,
});

import guma from "@/assets/games/gameAssets/philanthropists/guma.png";
import herbata from "@/assets/games/gameAssets/philanthropists/herbata.png";
import kawa from "@/assets/games/gameAssets/philanthropists/kawa.png";
import sol from "@/assets/games/gameAssets/philanthropists/sol.png";
import wegiel from "@/assets/games/gameAssets/philanthropists/wegiel.png";
import zboze from "@/assets/games/gameAssets/philanthropists/zboze.png";

const ikony = {
    guma,
    herbata,
    kawa,
    sol,
    wegiel,
    zboze,
};
</script>

<template>
    <div
        class="karta"
        :class="czyWyzerowane ? 'wyzerowane' : karta ? 'karta2' : 'karta1'"
    >
        <div class="zdjecie">
            <div class="ikona srodekKartyIkona" :class="material">
                <img :src="ikony[material]" class="img" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.karta {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
    background-color: rgb(29, 29, 29);
    /* background: linear-gradient(47deg, rgba(214,206,143,1) 0%, rgba(230,222,160,1) 25%, rgba(232,222,140,1) 50%, rgba(209,202,149,1) 74%, rgba(247,239,173,1) 100%); */
    padding: 6px;
}

.wyzerowane {
    &:hover {
        filter: brightness(1.05);
    }
}

.zdjecie {
    width: 100%;
    height: 100%;
    border-radius: 0.15rem;
    /* border: 6px solid #e6dea0; */
    background-size: contain;
}

.karta1 {
    background-image: url("/src/assets/games/gameAssets/philanthropists/karta.webp");
}

.karta2 {
    background-image: url("/src/assets/games/gameAssets/philanthropists/karta2.webp");
    background-size: 100% 100%;
}

.img {
    width: 2.5rem;
    height: 2.5rem;
}

.ikona {
    display: grid;
    place-items: center;
    --border: #725f4a8a;
    position: absolute;

    width: 42px;
    aspect-ratio: 1 / 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    aspect-ratio: 1 / 1;
    background: var(--kolor);
    box-shadow: 0 0 0px 3px var(--border);
    background-size: 175%;

    filter: drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.534));
}

.guma {
    --kolor: #96593b;
    /* --border: #622803; */
}

.kawa {
    --kolor: #ac3123;
    /* --border: #581710; */
}

.herbata {
    --kolor: #b1d865;
    /* --border: #92a049; */
}

.sol {
    --kolor: #3c3d58;
    /* --border: #808080; */
}

.wegiel {
    --kolor: #55473e;
    --border: #5f4d39;
}

.zboze {
    --kolor: #ffef63;
    /* --border: #d5b461; */
}

.guma {
    --kolor: var(--guma-gradient);
}

.kawa {
    --kolor: var(--kawa-gradient);
}

.herbata {
    --kolor: var(--herbata-gradient);
}

.sol {
    --kolor: linear-gradient(
        47deg,
        rgb(158, 158, 158) 0%,
        rgb(151, 151, 151) 25%,
        rgb(148, 148, 148) 50%,
        rgb(117, 117, 117) 74%,
        rgb(110, 110, 110) 100%
    );
}

.wegiel {
    --kolor: var(--wegiel-gradient);
}

.zboze {
    --kolor: var(--zboze-gradient);
}
</style>
