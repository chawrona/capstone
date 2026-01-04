import { soundBus } from "@/audio/soundBus";
import { useAppStore } from "@/store/useAppStore";

import actions from "./actions";

export function useGameActions(availableActions, dialogsOpen) {
    const store = useAppStore();
    const cooldowns = {};

    const canEmit = (action) => {
        if (
            dialogsOpen.value &&
            action !== actions.mortgagePropertyCard &&
            action !== actions.redeemPropertyCard
        )
            return true;

        if (!availableActions.value.includes(action)) return true;

        const now = Date.now();
        if (cooldowns[action] && now - cooldowns[action] < 500) return false;

        cooldowns[action] = now;
        return true;
    };

    const rollDice = () => {
        if (!canEmit(actions.rollDice)) return;
        store.emit("gameData", { eventName: "rollDice" });
        soundBus.playEffect("roll");
    };

    const buyHouse = (tileIndex) => {
        if (!canEmit(actions.buildHouse)) return;
        store.emit("gameData", { data: tileIndex, eventName: "buildHouse" });
        soundBus.playEffect("pay");
    };

    const sellHouse = (tileIndex) => {
        if (!canEmit(actions.rollDice)) return;
        store.emit("gameData", { data: tileIndex, eventName: "sellHouse" });
        soundBus.playEffect("roll");
    };

    const endTurn = () => {
        if (!canEmit(actions.endTurn)) return;
        store.emit("gameData", { eventName: "endTurn" });
    };

    const pickCommunityCard = () => {
        if (!canEmit(actions.pickCommunityCard)) return;
        store.emit("gameData", { eventName: "pickCommunityCard" });
        soundBus.playEffect("drawCard");
    };

    const pickChanceCard = () => {
        if (!canEmit(actions.pickChanceCard)) return;
        store.emit("gameData", { eventName: "pickChanceCard" });
        soundBus.playEffect("drawCard");
    };

    const payTax = () => {
        if (!canEmit(actions.payTax)) return;
        store.emit("gameData", { eventName: "payTax" });
        soundBus.playEffect("pay");
    };

    const payRent = () => {
        if (!canEmit(actions.payRent)) return;
        store.emit("gameData", { eventName: "payRent" });
        soundBus.playEffect("pay");
    };

    const payIncomeTax = () => {
        if (!canEmit(actions.payIncomeTax)) return;
        store.emit("gameData", { eventName: "payIncomeTax" });
        soundBus.playEffect("pay");
    };

    const buyBuilding = () => {
        if (!canEmit(actions.buyBuilding)) return;
        store.emit("gameData", { eventName: "buyBuilding" });
        soundBus.playEffect("pay");
    };

    const refuseToBuyBuilding = () => {
        if (!canEmit(actions.refuseToBuyBuilding)) return;
        store.emit("gameData", { eventName: "refuseToBuyBuilding" });
    };

    const bid = (bidIncrement) => {
        console.log("XD");

        if (!canEmit(actions.auction)) return;
        console.log("XD");

        store.emit("gameData", {
            data: bidIncrement,
            eventName: "auction",
        });
        soundBus.playEffect("pay");
    };

    const end = () => {
        if (!canEmit(actions.auction)) return;
        store.emit("gameData", {
            eventName: "endAuction",
        });
        soundBus.playEffect("pay");
    };

    const payJail = () => {
        if (!canEmit(actions.payJail)) return;
        store.emit("gameData", { eventName: "payJail" });
        soundBus.playEffect("pay");
    };

    const useOutOfJailCard = () => {
        if (!canEmit(actions.payJail)) return;
        store.emit("gameData", { eventName: "useOutOfJailCard" });
        soundBus.playEffect("drawCard");
    };

    const mortgagePropertyCard = (card) => {
        if (!canEmit(actions.mortgagePropertyCard)) return;
        store.emit("gameData", {
            data: card,
            eventName: "mortgagePropertyCard",
        });
        soundBus.playEffect("pay");
    };

    const redeemPropertyCard = (card) => {
        if (!canEmit(actions.redeemPropertyCard)) return;
        store.emit("gameData", {
            data: card,
            eventName: "redeemPropertyCard",
        });
        soundBus.playEffect("pay");
    };

    return {
        bid,
        buyBuilding,
        buyHouse,
        end,
        endTurn,
        mortgagePropertyCard,
        payIncomeTax,
        payJail,
        payRent,
        payTax,
        pickChanceCard,
        pickCommunityCard,
        redeemPropertyCard,
        refuseToBuyBuilding,
        rollDice,
        sellHouse,
        useOutOfJailCard,
    };
}
