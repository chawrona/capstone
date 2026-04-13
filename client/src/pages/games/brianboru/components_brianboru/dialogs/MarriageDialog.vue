<script setup>
const props = defineProps(["marriage", "closeDialog"]);
import Letter from "@/assets/games/gameAssets/brianboru/letter.png";

</script>

<template>
    <div class="dialog">
        <h1 class="dialogTitle">Propozycja małżeństwa</h1>

        <div class="dialogContent">
            <div>

                <p><b class="marriageName">{{ marriage.name }}</b> 
                    
                    
                    {{marriage.region && marriage.region !== "Vikings" ? "z regionu ": "" }}
                    <b>
                        {{marriage.region && marriage.region !== "Vikings" ? marriage.region : "" }}
                    </b><br>
                    szuka kogoś do poślubienia
                    
                </p>
                
            </div>
            <div class="wrapper">
                <p>
                
                (Kliknij na kościół, aby sprawdzić posag)
                </p>
                
            </div>
            
            
        </div>

                <button class="dialogButton yellowButton" @click="props.closeDialog">  dalej <img :src="Letter" class="icon"></button>

    </div>
</template>

<style scoped>
.dialog {
    position: absolute;
    top: 50%;
    z-index: 30;
    font-family: "MedievalSharp";
    left: 50%;
    transform: translate(-50%, -65%);

    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    color: white;
    font-weight: normal;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.74);
    border-radius: 0.5rem;
    background-image: url("/src/assets/games/gameAssets/brianboru/pergamin_yellow.jpg");
    background-size: cover;
    gap: 0rem;

    height: 300px;
    width: 600px;
    justify-content: space-between;
    padding: 2rem 1rem;
    box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.685);

    .dialogTitle {
        letter-spacing: 1px;
        font-size: 2rem;
    }

    .dialogContent {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        text-align: center;

        line-height: 1.2;
     
        font-size: 1.5rem;

        width: 85%;
    }

    .marriageIcon {
        transform: translateY(-10px);
        height: 50px;
        border-radius: 0.25rem;
    }

    .dialogButton {
        position: relative;
        font-size: 1.25rem;
        border: none;
        border-radius: 0.25rem;
        color: transparent;
        
    }

    .wrapper {
        margin-top: 0.5rem;;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.85rem;
        font-family: sans-serif;
        color: rgb(255, 255, 255);
    }

     .icon {
        position: absolute;
        left: 50%;
        top: 50%;
        display: inline-block;
        height: 27px;
        transform: translate(-50%, -50%);
    }

}

.marriageName {
    display: inline-block;
    margin-bottom: 0.3rem;
}
</style>
