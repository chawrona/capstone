export default class PlayerLacksColorError extends Error {
    constructor(message = "Nie każdy gracz ma przydzielony kolor.") {
        super(message);
        this.name = "PlayerLacksColorError";
        this.code = "PLAYER_LACKS_COLOR";
    }
}
