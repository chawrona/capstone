import Player from "../../Player.js";
import hiddenTasks from "./config.js/hiddenTasks.js";

export default class CraftsmenPlayer extends Player {
    constructor(username, color, publicId) {
        super(username, color, publicId);
    }

    initalizeData() {
        this.setData("contracts", () => 0);
        this.setData("craftsmen", () => 1);
        this.setData("trader", () => false);
        this.setData("trading", () => {
            return {
                buyAmount: 1,
                sellAmount: 3,
                allowBuying: true,
                allowSelling: true,
                resource: "wood",
            };
        });
        this.setData("craftsmanCost", () => {
            return [
                ["wheat", 3],
                ["iron", 2],
            ];
        });
        this.setData("cartCost", () => {
            return [["wood", 1]];
        });
        this.setData("guildCost", () => {
            return [
                ["stone", 1],
                ["brick", 2],
            ];
        });
        this.setData("rotateCost", () => [["iron", 1]]);
        this.setData("coins", () => 5);
        this.setData("maxInventorySpace", () => 6);
        this.setData("canBuyCraftsman", () => true);
        this.setData("canBuyCart", () => true);
        this.setData("inventory", () => {
            const resources = {
                wood: 0,
                stone: 0,
                wheat: 0,
                brick: 0,
                iron: 0,
                glass: 0,
                amber: 0,
                silk: 0,
            };
            if (this.data.turnOrder === 1) resources.wheat = 1;
            if (this.data.turnOrder === 2) resources.wood = 1;
            if (this.data.turnOrder === 3) {
                resources.wood = 1;
                resources.wheat = 1;
            }
            return resources;
        });

        this.setData("hiddenTask", () => {
            return structuredClone(hiddenTasks).sort(
                () => Math.random() - 0.5,
            )[0];
        });

        this.setData("stats", () => ({
            resourcesGained: {
                wood: 0,
                stone: 0,
                wheat: 0,
                brick: 0,
                iron: 0,
                glass: 0,
                amber: 0,
                silk: 0,
            },
            coinsFromGuild: 0,
            coinsFromStanding: 0,
            coinsPaidToOthers: 0,
            rotations: 0,
            rerolls: 0,
            amberSpent: 0,
            tradesBought: 0,
            tradeSoldAmount: 0,
            tradesBoughtAmount: 0,
            tradesSold: 0,
        }));
    }

    getFreeInventorySpace() {
        const inventory = this.getData("inventory");
        return (
            this.getData("maxInventorySpace") -
            Object.values(inventory).reduce((sum, val) => sum + val, 0)
        );
    }
}
