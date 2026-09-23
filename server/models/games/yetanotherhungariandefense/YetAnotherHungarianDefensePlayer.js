import Player from "../../Player.js";

export default class YetAnotherHungarianDefensePlayer extends Player {
    constructor(username, color, publicId) {
        super(username, color, publicId);
    }

    initalizeData() {
        // tu startowe dane gracza, np. this.setData("points", () => 0);
    }
}
