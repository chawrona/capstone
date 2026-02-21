export default class Dialogs {
    constructor(game) {
        this.game = game;
    }

    closeDialog(data) {
        const player = this.game.getPlayer(data.publicId);
        player.setData("dialogs", (dialogs) => {
            dialogs.shift();
            return dialogs;
        });
    }

    generateDialogsQueue(publicId) {
        const player = this.game.getPlayer(publicId);
        const dialogs = player.getData("dialogs");

        const data = [];

        data.push({
            target: publicId,
            eventName: "dialogs",
            data: dialogs,
        });

        return data;
    }

    addDialog(player, dialog) {
        player.setData("dialogs", (dialogs) => {
            dialogs.push(dialog);
            return dialogs;
        });
    }

    getDialog(player) {
        return player.getData("dialogs")[0];
    }
}
