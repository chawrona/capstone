<script setup>
import { computed } from "vue";
import { soundBus } from "@/audio/soundBus";
import { useToast } from "vue-toast-notification";

const musicVolume = computed({
    get: () => soundBus.state.musicVolume,
    set: (v) => soundBus.setMusicVolume(v),
});

const effectsVolume = computed({
    get: () => soundBus.state.effectsVolume,
    set: (v) => soundBus.setEffectsVolume(v),
});

  const toast = useToast();


 

    const toggleMusicMute = () => {

        toast.info(soundBus.state.musicMuted ? "Odciszono muzykę" : "Wyciszono muzykę", {
            duration: 1000,
            position: "top-left",
        });
                soundBus.toggleMusicMute()
    };
    const toggleEffectsMute = () => {
      
        toast.info(soundBus.state.effectsMuted ? "Odciszono dźwięki" : "Wyciszono dźwięki", {
            duration: 1000,
            position: "top-left",
        });
          soundBus.toggleEffectsMute()
    };


</script>

<template>
  <div class="sound-settings">
      <h2 class="title">Ustawienia dźwięków</h2>
   
      <div class="rows">

   
    <div class="sound-row">
        <label for="music-volume">Muzyka</label>
        <input id="music-volume" type="range" min="0" max="100" v-model.number="musicVolume" />
        <button class="theme-button" @click="toggleMusicMute">
            {{ soundBus.state.musicMuted ? "Odcisz" : "Wycisz" }}
        </button>
    </div>

    <div class="sound-row">
        <label for="effects-volume">Efekty</label>
        <input id="effects-volume" type="range" min="0" max="100" v-model.number="effectsVolume" />
        <button class="theme-button" @click="toggleEffectsMute">
            {{ soundBus.state.effectsMuted ? "Odcisz" : "Wycisz" }}
        </button>
    </div>
       </div>

</div>
  
</template>

<style lang="scss">

.title {
    margin-bottom: 0.5rem;
}

.sound-settings {
        display: flex;
        flex-direction: column;
        align-items: center;
       
        padding: 1.75rem 2.5rem;
        border: 1px solid rgba(255, 230, 180, 0.2);
        max-width: 600px;
        width: 100%;
      
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

       background-image: url("/src/assets/infoBg.png");
        accent-color: #e0d4b0;
}


.rows {
 display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 1rem;
}

.sound-row {
    text-align: center;
    display: flex;
      gap: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
    flex-direction: column;
    
}

</style>