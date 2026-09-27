import { onMounted, onUnmounted } from "vue";

import StreetLamp from "@/assets/games/gameAssets/yetanotherhungariandefense/lamp.webp";

export default class GameEngine {
    constructor(canvas) {
        this.canvasParameters = {
            height: 950,
            middle: [960, 475],
            middleTileX: 27,
            middleTileY: 14,
            tileSize: 35,
            tilesX: 53,
            tilesY: 27,
            width: 1920,
        };

        this.lastTime = 0;
        this.time = 0;
        this.frameId = 0;

        onMounted(async () => {
            this.canvas = canvas.value;
            this.context = this.canvas.getContext("2d");
            this.setupCanvas();
            await this.loadAssets();

            this.lastTime = performance.now();
            this.frameId = requestAnimationFrame((now) => this.tick(now));
        });

        onUnmounted(() => {
            cancelAnimationFrame(this.frameId);
        });
    }

    setupCanvas() {
        this.canvas.height = this.canvasParameters.height;
        this.canvas.width = this.canvasParameters.width;
        this.context.font = "24px sans-serif";
        this.context.textBaseline = "top";
    }

    async loadAssets() {
        this.assets = {};
        const lamp = new Image();
        lamp.src = StreetLamp;
        await lamp.decode();

        this.assets.lamp = lamp;
    }

    getAsset(asset) {
        return this.assets[asset];
    }

    getMiddlePoint(x, y) {
        return [x / 2, y / 2];
    }

    // Main game engine loop
    tick(now) {
        // Czyszczenie całego canvasu
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const dt = now - this.lastTime;
        this.lastTime = now;
        this.time += dt;

        const lamp = this.getAsset("lamp");
        const [lampX, lampY] = this.getMiddlePoint(35, 140);
        this.context.drawImage(lamp, 960 - lampX, 475 - 35 - lampY, 35, 140);

        this.context.fillText((this.time / 1000).toFixed(1), 0, 0);

        this.frameId = requestAnimationFrame((now) => this.tick(now));
    }
}

// To do
// Zrobić pętlę renderowania
// Wyświetlać gracza
// Gracz chodzi
// Kolizja gracza z lampą

// Inni gracze i inne moby nie mają kolizji lokalnie, każdy gracz ma kolizje u siebie
// natomiast postacie AI, ex. zombie, mają kolizję sprawdzaną na serwerze

// Dodanie innych graczy
// Kolizja z innymi graczami
