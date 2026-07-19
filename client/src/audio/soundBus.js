import { reactive, shallowReactive } from "vue";

const FADE_STEP_MS = 16;
const VOLUME_FLOOR_DB = -40;

function sliderToGain(v) {
    return v <= 0 ? 0 : Math.pow(10, (VOLUME_FLOOR_DB * (1 - v / 100)) / 20);
}

class SoundBus {
    constructor() {
        this.effects = shallowReactive({});

        this.state = reactive({
            effectsMuted: false,
            effectsVolume: 50,
            musicMuted: false,
            musicVolume: 40,
            soundtrackPlaying: false,
        });

        this.sharedUrl = null;
        this.sharedAudio = null;
        this.overrideUrl = null;
        this.overrideAudio = null;
        this.currentAudio = null;

        this._fadeToken = 0;
    }

    setSharedMusic(url) {
        if (this.sharedUrl === url && this.sharedAudio) {
            if (!this.overrideAudio) this._crossTo(this.sharedAudio);
            return;
        }
        this.sharedUrl = url;
        this.sharedAudio = this._createAudio(url);
        if (!this.overrideAudio) {
            this._crossTo(this.sharedAudio);
        }
    }

    enterMusic(url) {
        if (this.overrideUrl === url && this.overrideAudio) return;
        if (this.overrideAudio) this.overrideAudio.pause();

        this.overrideUrl = url;
        this.overrideAudio = this._createAudio(url);
        this._crossTo(this.overrideAudio);
    }

    exitMusic() {
        if (this.overrideAudio) this.overrideAudio.pause();
        this.overrideAudio = null;
        this.overrideUrl = null;
        this._crossTo(this.sharedAudio);
    }

    resumeMusic() {
        if (!this.currentAudio) return;
        this.currentAudio.volume = this.state.musicMuted
            ? 0
            : sliderToGain(this.state.musicVolume);
        this.currentAudio
            .play()
            .then(() => {
                this.state.soundtrackPlaying = true;
            })
            .catch(() => {
                this.state.soundtrackPlaying = false;
            });
    }

    isSoundtrackNotPlaying() {
        return !this.state.soundtrackPlaying;
    }

    _createAudio(url) {
        const audio = new Audio(url);
        audio.preload = "auto";
        audio.loop = true;
        audio.volume = 0;
        return audio;
    }

    _crossTo(next, fadeDuration = 500) {
        const prev = this.currentAudio;
        if (prev === next) return;

        if (next) {
            next.currentTime = 0;
            next.play().catch(() => {
                this.state.soundtrackPlaying = false;
            });
        }

        this.currentAudio = next;
        this.state.soundtrackPlaying = !!next;

        const myFade = ++this._fadeToken;
        const targetVol = this.state.musicMuted
            ? 0
            : sliderToGain(this.state.musicVolume);
        const steps = Math.max(1, fadeDuration / FADE_STEP_MS);
        const stepOut = prev ? prev.volume / steps : 0;
        const stepIn = targetVol / steps;

        const fade = () => {
            if (myFade !== this._fadeToken) return;

            if (prev) prev.volume = Math.max(0, prev.volume - stepOut);
            if (next) next.volume = Math.min(targetVol, next.volume + stepIn);

            const prevDone = !prev || prev.volume <= 0;
            const nextDone = !next || next.volume >= targetVol;

            if (!prevDone || !nextDone) {
                requestAnimationFrame(fade);
            } else if (prev) {
                prev.pause();
            }
        };
        fade();
    }

    preload(name, url, type = "effect", poolSize = 1) {
        if (type === "music") return;

        const vol = this.state.effectsMuted
            ? 0
            : sliderToGain(this.state.effectsVolume);
        const pool = [];
        for (let i = 0; i < poolSize; i++) {
            const audio = new Audio(url);
            audio.preload = "auto";
            audio.volume = vol;
            pool.push(audio);
        }
        this.effects[name] = pool;
    }

    playEffect(name) {
        const pool = this.effects[name];
        if (!pool || !pool.length) return;
        const audio = pool.find((a) => a.paused) || pool[0];
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    setMusicVolume(v) {
        this.state.musicVolume = v;
        if (!this.state.musicMuted && this.currentAudio) {
            this.currentAudio.volume = sliderToGain(v);
        }
    }

    setEffectsVolume(v) {
        this.state.effectsVolume = v;
        if (!this.state.effectsMuted) {
            const gain = sliderToGain(v);
            Object.values(this.effects).forEach((pool) =>
                pool.forEach((a) => (a.volume = gain)),
            );
        }
    }

    toggleMusicMute(forced) {
        this.state.musicMuted = forced ?? !this.state.musicMuted;
        if (this.currentAudio) {
            this.currentAudio.volume = this.state.musicMuted
                ? 0
                : sliderToGain(this.state.musicVolume);
        }
    }

    toggleEffectsMute(forced) {
        this.state.effectsMuted = forced ?? !this.state.effectsMuted;
        const v = this.state.effectsMuted
            ? 0
            : sliderToGain(this.state.effectsVolume);
        Object.values(this.effects).forEach((pool) =>
            pool.forEach((a) => (a.volume = v)),
        );
    }

    unload(name) {
        const pool = this.effects[name];
        if (pool) pool.forEach((a) => a.pause());
        delete this.effects[name];
    }

    unloadAll() {
        Object.keys(this.effects).forEach((k) => this.unload(k));
        if (this.overrideAudio) this.overrideAudio.pause();
        if (this.sharedAudio) this.sharedAudio.pause();
        this.overrideAudio = null;
        this.overrideUrl = null;
        this.sharedAudio = null;
        this.sharedUrl = null;
        this.currentAudio = null;
        this.state.soundtrackPlaying = false;
    }
}

export const soundBus = new SoundBus();
