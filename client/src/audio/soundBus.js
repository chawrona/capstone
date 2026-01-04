import { reactive, ref } from "vue";

class SoundBus {
    constructor() {
        this.effects = reactive({});

        this.music = reactive({});

        // Aktualnie grająca muzyka
        this.currentMusic = null;

        // głośność
        this.musicVolume = 0.05;
        this.effectsVolume = 1.0;

        // Mute
        this.musicMuted = false;
        this.effectsMuted = false;

        // Sprawdzanie czy podkład gra
        this.soundtrackPlaying = ref(false);
    }

    resetSoundtrack(url) {
        this.unload("soundtrack");
        this.preload("soundtrack", url, "music");
        this.playMusic("soundtrack");
        this.soundtrackPlaying.value = true;
    }

    isSoundtrackNotPlaying() {
        return !this.soundtrackPlaying.value;
    }

    // =============== PRELOAD ===============
    preload(name, url, type = "effect", poolSize = 1) {
        if (type === "music") {
            const audio = new Audio(url);
            audio.preload = "auto";
            audio.volume = this.musicMuted ? 0 : this.musicVolume;
            this.music[name] = audio;
            return;
        }

        // efekty z poolowaniem
        const pool = [];
        for (let i = 0; i < poolSize; i++) {
            const audio = new Audio(url);
            audio.preload = "auto";
            audio.volume = this.effectsMuted ? 0 : this.effectsVolume;
            pool.push(audio);
        }
        this.effects[name] = pool;
    }

    // =============== PLAY EFFECT WITH POOLING ===============
    playEffect(name) {
        const pool = this.effects[name];
        if (!pool) return;

        // znajdź pierwszy wolny obiekt Audio
        const audio = pool.find((a) => a.paused) || pool[0];

        audio.currentTime = 0;
        audio.play();
        console.log("PLAYED");
    }

    // =============== MUSIC WITH CROSS-FADE ===============
    async playMusic(name, fadeDuration = 500) {
        this.stopMusic();
        const next = this.music[name];
        if (!next) return;
        this.soundtrackPlaying.value = true;
        next.loop = true;
        next.volume = this.musicMuted ? 0 : 0; // zaczyna od 0 przy cross-fade

        // jeśli żadnej nie ma – po prostu odpal
        if (!this.currentMusic) {
            next.volume = this.musicMuted ? 0 : this.musicVolume;
            next.play().catch(() => {
                this.soundtrackPlaying.value = false;
                console.log(
                    "Nie było poprzedniej muzyki, a następna ma błąd w graniu (1)",
                );
            });
            this.currentMusic = next;
            return;
        }

        const prev = this.currentMusic;

        // jeśli gra ta sama – nic nie rób
        if (prev === next) {
            return console.log("Gra ta sama muzyka");
        }

        console.log("Robimy fade");

        next.currentTime = 0;
        next.play().catch(() => {
            this.soundtrackPlaying.value = false;
            console.log(
                "Nie było poprzedniej muzyki, a następna ma błąd w graniu (2)",
            );
        });

        // crossfade
        const step = 16;
        const steps = fadeDuration / step;
        const volStepOut = this.musicVolume / steps;
        const volStepIn = this.musicVolume / steps;

        return new Promise((resolve) => {
            const fade = () => {
                // fade out poprzedniej
                if (!this.musicMuted) {
                    prev.volume = Math.max(0, prev.volume - volStepOut);
                    next.volume = Math.min(
                        this.musicVolume,
                        next.volume + volStepIn,
                    );
                }

                if (prev.volume > 0 || next.volume < this.musicVolume) {
                    requestAnimationFrame(fade);
                } else {
                    prev.pause();
                    this.currentMusic = next;
                    resolve();
                }
            };
            fade();
        });
    }

    stopMusic() {
        if (this.currentMusic) {
            console.log(this.currentMusic);
            console.log("Pauzujemy");

            this.currentMusic.pause();
            console.log(this.currentMusic);
            console.log("Stop music robi soundtrackPlaying na false");

            this.soundtrackPlaying.value = false;
        }
    }

    // =============== GLOBAL VOLUME / MUTE ===============
    setMusicVolume(v) {
        this.musicVolume = v;
        if (!this.musicMuted && this.currentMusic) {
            this.currentMusic.volume = v;
        }
    }

    setEffectsVolume(v) {
        this.effectsVolume = v;
        Object.values(this.effects).forEach((pool) =>
            pool.forEach((a) => (a.volume = v)),
        );
    }

    muteMusic(mute = true) {
        this.musicMuted = mute;
        if (this.currentMusic) {
            this.currentMusic.volume = mute ? 0 : this.musicVolume;
        }
    }

    muteEffects(mute = true) {
        this.effectsMuted = mute;
        Object.values(this.effects).forEach((pool) =>
            pool.forEach((a) => (a.volume = mute ? 0 : this.effectsVolume)),
        );
    }

    // =============== UNLOAD ===============
    unload(name) {
        delete this.effects[name];
        delete this.music[name];
    }

    unloadAll() {
        Object.keys(this.effects).forEach((k) => delete this.effects[k]);
        Object.keys(this.music).forEach((k) => delete this.music[k]);
        this.currentMusic = null;
        // this.soundtrackPlaying.value = false;
    }
}

export const soundBus = new SoundBus();
