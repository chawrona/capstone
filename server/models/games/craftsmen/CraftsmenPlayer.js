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
                ["wheat", 2],
                ["iron", 1],
            ];
        });
        this.setData("cartCost", () => {
            return [["wood", 1]];
        });
        this.setData("rotateCost", () => [["iron", 1]]);
        this.setData("coins", () => 15);
        this.setData("maxInventorySpace", () => 8);
        this.setData("canBuyCraftsman", () => true);
        this.setData("canBuyCart", () => true);
        this.setData("inventory", () => {
            const resources = {
                wood: 1,
                stone: 3,
                wheat: 2,
                brick: 3,
                iron: 2,
                glass: 0,
                amber: 0,
                silk: 0,
            };
            if (this.turnOrder === 1) resources.wheat = 1;
            if (this.turnOrder === 2) resources.wood = 1;
            if (this.turnOrder === 3) {
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
    }

    getFreeInventorySpace() {
        const inventory = this.getData("inventory");
        return (
            this.getData("maxInventorySpace") -
            Object.values(inventory).reduce((sum, val) => sum + val, 0)
        );
    }
}
