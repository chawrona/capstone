import Player from "../../Player.js";

export default class CraftsmenPlayer extends Player {
    constructor(username, color, publicId) {
        super(username, color, publicId);
    }

    initalizeData() {}

    setStatus(status) {
        this.setData("status", () => status);
        return this;
    }

    getStatus() {
        return this.getData("status");
    }

    generateData() {
        return {};
    }
}
