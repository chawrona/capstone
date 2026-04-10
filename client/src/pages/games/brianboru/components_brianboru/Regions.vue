<script setup>
import Points from "@/assets/games/gameAssets/brianboru/points.png";
import Regions from "@/assets/games/gameAssets/brianboru/map_icon.png";
</script>

<template>
    <div class="regions">

        <div class="row">
            <div class="col1">
                <img :src="Points" class="icon">
            </div>
            <div class="col2">
                <img :src="Regions" class="icon">
            </div>
        </div>
        <div class="row">
            <div class="col1">0</div>
            <div class="col2">1-2</div>
        </div>
        <div class="row">
            <div class="col1">1</div>
            <div class="col2">3-4</div>
        </div>
        <div class="row">
            <div class="col1">3</div>
            <div class="col2">5</div>
        </div>
        <div class="row">
            <div class="col1">5</div>
            <div class="col2">6</div>
        </div>
        <div class="row">
            <div class="col1">7</div>
            <div class="col2">7</div>
        </div>
        <div class="row">
            <div class="col1">10</div>
            <div class="col2">8</div>
        </div>
        
    </div>
</template>

<style scoped>
.regions {
     display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 6.52rem;
    right: 218px;
    padding: .5rem 0.0rem;
    border-radius: 0.15rem;
    gap: 0.25rem;



    width: 75px;
}

.row {
    display: flex;
    border-radius: 0.15rem;
    background-color: #ffffff36;
    box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.314);
    .col1, .col2 {
         padding: 0.06rem;
    }

    &:nth-of-type(2n) {
        background-color: #277bdb7a;

          
        .col1, .col2 {
            padding: 0.05rem;
        }
    }

    &:first-of-type {
        padding-block: 0.1rem;

        .icon {
            transform: translateY(1px);
        }
    }

    &:last-of-type {
        .col1, .col2 {
            padding: 0.15rem;
        }
    }
}

.col1, .col2 {
    display: grid;
    place-items: center;
    text-align: center;
    width: 50%;
    font-size: 0.8rem;
    font-weight: 650;
}

.col1 {
    font-weight: 500;
}

.icon {
    width: 60%;
     filter: drop-shadow(2px 2px 25px rgba(208, 226, 247, 0.683))
    drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.473));
    margin-bottom: 5px;
}
</style>