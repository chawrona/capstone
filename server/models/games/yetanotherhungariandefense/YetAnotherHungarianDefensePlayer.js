import Player from "../../Player.js";

export default class YetAnotherHungarianDefensePlayer extends Player {
    constructor(username, color, publicId) {
        super(username, color, publicId);
    }

    initalizeData() {
        this.data = {
            position: {
                x: 0,
                y: 0,
            },
            speed: 5,
        };
    }

    moveRandomly() {
        const angle = Math.random() * Math.PI * 2;

        this.data.position.x += Math.cos(angle) * 10;
        this.data.position.y += Math.sin(angle) * 10;

        this.normalizePosition();
    }

    normalizePosition() {
        this.data.position.x = Math.max(
            0,
            Math.min(1920, this.data.position.x),
        );
        this.data.position.y = Math.max(0, Math.min(950, this.data.position.y));
    }

    updatePosition(data) {
        let x = 0;
        let y = 0;
        if (data.up) y -= 1;
        if (data.down) y += 1;
        if (data.left) x -= 1;
        if (data.right) x += 1;

        const length = Math.hypot(x, y);

        if (length > 0) {
            x /= length;
            y /= length;
            this.data.position.x += x * this.data.speed * data.dt;
            this.data.position.y += y * this.data.speed * data.dt;
        }

        this.normalizePosition();
    }
}
