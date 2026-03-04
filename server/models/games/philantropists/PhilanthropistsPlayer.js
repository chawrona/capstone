import Player from "../../Player.js";

export default class PhilanthropistsPlayer extends Player {
    constructor(username, color, publicId) {
        super(username, color, publicId);
        this.lastOrder = null;
        this.karty = [];
        this.filantropiaHajs = 0;
        this.filantropiaKarty = [null, null, null, null];
        this.hajs = 300;
    }
}
