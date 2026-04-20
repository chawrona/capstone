import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
import { soundBus } from "../../../../audio/soundBus.js";
import { useAppStore } from "../../../../store/useAppStore";

const store = useAppStore();

const buildingStatusesMap = {
    [statuses.BUILD_BOUGHT_CITY]: "buildBoughtCity",
    [statuses.BUILD_CITY]: "marriageCityReward",
    [statuses.BUILD_CITY_REGION]: "marriageWinnerChooseReward",
    [statuses.BUILD_FIRST_CITY]: "buildFirstCity",
};

const vikingsStatusesMap = {
    [statuses.VIKINGS_SOMEONE_CITY]: "chooseSomeoneCityToVikings",
    [statuses.VIKINGS_YOUR_CITY]: "chooseYourCityToVikings",
};

const chooseCity = (cityId, props) => {
    let eventName = undefined;

    if (
        buildingStatusesMap[props.status] &&
        props.citiesToBuild.includes(cityId)
    ) {
        eventName = buildingStatusesMap[props.status];
        soundBus.playEffect("buildCity");
    } else if (
        vikingsStatusesMap[props.status] &&
        props.citiesToVikings.includes(cityId)
    ) {
        eventName = vikingsStatusesMap[props.status];
        soundBus.playEffect("attackVikings");
    } else if (
        props.status === statuses.BUILD_CATHEDRAL &&
        props.citiesToCathedra.includes(cityId)
    ) {
        eventName = "chooseCathedral";
        soundBus.playEffect("buildCathedra");
    } else if (
        props.status === statuses.CHOOSE_ATTACKED_CITY &&
        props.citiesToAttack.includes(cityId)
    ) {
        eventName = "chooseCityToAttack";
        soundBus.playEffect("chooseAttackCity");
    } else if (
        props.status === statuses.REMOVE_VIKINGS &&
        props.citiesToRemoveVikings.includes(cityId)
    ) {
        eventName = "removeVikings";
        soundBus.playEffect("removeVikings");
    }

    if (!eventName) return;

    store.emit("gameData", {
        data: cityId,
        eventName,
    });
};

export default chooseCity;
