import Player from "../../Player.js";
import dialogs from "./config/dialogs.js";
import statuses from "./config/statuses.js";

export default class BrianBoruPlayer extends Player {
    constructor(username, color, publicId) {
        super(username, color, publicId);
    }

    initalizeData() {
        this.setData("church", () => 0);
        this.setData("points", () => 10);
        this.setData("vikings", () => 0);
        this.setData("suns", () => 1);
        this.setData("money", () => 5);
        this.setData("firstPlayer", () => false);
        this.setData("lockedCards", () => new Set());
        this.setData("cards", () => []);
        this.setData("dialogs", () => []);

        this.addDialog(dialogs.FIRST_PLAYER)
            .addDialog(dialogs.VIKINGS)
            .addDialog(dialogs.MARRIAGE)
            .addDialog(dialogs.REJECT_CARDS);

        this.setStatus(statuses.REJECT_CARDS);
    }

    setStatus(status) {
        this.setData("status", () => status);
        return this;
    }

    addDialog(dialog) {
        this.setData("dialogs", (oldDialogs) => {
            oldDialogs.push(dialog);
            return oldDialogs;
        });

        return this;
    }

    getStatus() {
        return this.getData("status");
    }

    setFirstPlayer() {
        this.setData("firstPlayer", () => true);
        return this;
    }

    removeFirstPlayer() {
        this.setData("firstPlayer", () => false);
    }

    generateData() {
        return {
            username: this.username,
            publicId: this.publicId,
            color: this.color,
            church: this.getData("church"),
            points: this.getData("points"),
            vikings: this.getData("vikings"),
            suns: this.getData("suns"),
            money: this.getData("money"),
            firstPlayer: this.getData("firstPlayer"),
        };
    }

    getPlayerStatus() {
        const playerStatus = this.getData("status");

        if (playerStatus === statuses.REJECT_CARDS_WAITING) {
            return "Oczekiwanie na innych graczy";
        }

        if (playerStatus === statuses.REJECT_CARDS) {
            return `Odrzucanie kart`;
        }

        return null;
    }
}
