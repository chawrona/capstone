import { soundBus } from "@/audio/soundBus";
import { useAppStore } from "@/store/useAppStore";

import actions from "../../../../../../server/models/games/craftsmen/config.js/actions.js";

export function useGameActions(availableActions) {
    const store = useAppStore();
    const cooldowns = {};

    const canEmit = (action) => {
        if (!availableActions().includes(action)) return false;

        const now = Date.now();
        if (cooldowns[action] && now - cooldowns[action] < 50) return false;

        cooldowns[action] = now;
        return true;
    };

    const newTurn = () => {
        if (!canEmit(actions.NEW_TURN)) return;
        store.emit("gameData", { eventName: "newTurn" });
    };

    const buyCart = () => {
        if (!canEmit(actions.BUY_CART)) return;

        store.emit("gameData", { eventName: "buyCart" });
    };

    const rotate = () => {
        if (!canEmit(actions.ROTATE)) return;
        store.emit("gameData", { eventName: "rotate" });
    };

    const buyCraftsman = () => {
        if (!canEmit(actions.BUY_CRAFTSMAN)) return;
        store.emit("gameData", { eventName: "buyCraftsman" });
    };

    const moveCraftsman = (ringType, fieldId, craftsmanId = null) => {
        if (!canEmit(actions.MOVE_CRAFTSMAN) && craftsmanId !== null) return;
        if (!canEmit(actions.PLACE_CRAFTSMAN) && craftsmanId === null) return;

        store.emit("gameData", {
            data: {
                craftsmanId,
                fieldId,
                ringType,
            },
            eventName: "moveCraftsman",
        });
    };

    const buildGuild = (guildData) => {
        if (!canEmit(actions.BUILD_GUILD)) return;
        store.emit("gameData", {
            data: {
                fieldId: guildData[1],
                ringType: guildData[0],
            },
            eventName: "buildGuild",
        });
    };

    const rerollContract = (contractId) => {
        if (!canEmit(actions.REROLL_CONTRACT)) return;
        store.emit("gameData", {
            data: contractId,
            eventName: "rerollContract",
        });
    };

    const completeContract = (contractId) => {
        if (!canEmit(actions.COMPLETE_CONTRACT)) return;
        store.emit("gameData", {
            data: contractId,
            eventName: "completeContract",
        });
    };

    return {
        buildGuild,
        buyCart,
        buyCraftsman,
        completeContract,
        moveCraftsman,
        newTurn,
        rerollContract,
        rotate,
    };
}
