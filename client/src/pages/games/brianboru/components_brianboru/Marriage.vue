<script setup>

import Money from "@/assets/games/gameAssets/brianboru/money_plus.png";
import MoneyDouble from "@/assets/games/gameAssets/brianboru/money_double_plus.png";
import Sun from "@/assets/games/gameAssets/brianboru/sun.png";
import City from "@/assets/games/gameAssets/brianboru/city.png";


</script>

<template>
    <div class="marriage">
        <div class="level">
            <div class="top"></div>
            <div class="left"></div>
            <div class="circle"></div>
            <div class="right"></div>
        </div>
        <div class="level">
            <div class="prize">
                  <img :src="City" alt="" class="city">
            </div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">
                  <img :src="Sun" alt="" class="sun">
            </div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">   <img :src="MoneyDouble" alt="" class="doubleMoney"></div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">   <img :src="MoneyDouble" alt="" class="doubleMoney"></div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">
                  <img :src="Money" alt="" class="money">
            </div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">
                <img :src="Money" alt="" class="money">
            </div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">
                <img :src="Money" alt="" class="money">
            </div>
            <div class="circle"></div>
        </div>
        <div class="level">
            <div class="prize">
              
            </div>
            <div class="circle"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.marriage {
    position: absolute;
    left: 2.5rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    width: 100px;
    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0);
}

.level {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
}

.prize {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(calc(-150% - 0.5rem), -50%);
    // background-color: rgba(0, 0, 255, 0.116);
    width: 50%;
    aspect-ratio: 1 / 1;
}

.circle {
    width: 45%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    box-shadow: 0 1px 5px 5px rgba(0, 0, 0, 0.219);;
    // background-color: rgb(238, 201, 35);
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin.webp");
}

.money {
    transform: scale(0.85);
}

.doubleMoney {
     transform: scale(0.92);
}

.sun, .city {
 transform: scale(0.9);
}

.top, .left, .right {
    position: absolute;
    width: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50px;
    // background-color: red;
}

.top {
    // background-color: #666666;
    top: 0;
    transform: translate(-50%, -85%);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
}

.left {
    left: 0;
       background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
     background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
    transform: translate(50%, -35%);

       rotate: -90deg;
    transform-origin: center;
}

.right {
       background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    left: auto;
    right: 0;
    rotate: 90deg;
    transform: translate(-52%, -33%);
    transform-origin: center;
       background-image: url("/src/assets/games/gameAssets/brianboru/ozdobnik.png");
}

</style>
