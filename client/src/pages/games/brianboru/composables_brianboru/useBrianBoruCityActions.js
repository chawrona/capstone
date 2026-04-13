import statuses from "../../../../../../server/models/games/brianboru/config/statuses";
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
    let eventName = "defaultEventName";

    if (
        buildingStatusesMap[props.status] &&
        props.citiesToBuild.includes(cityId)
    ) {
        eventName = buildingStatusesMap[props.status];
    } else if (
        vikingsStatusesMap[props.status] &&
        props.citiesToVikings.includes(cityId)
    ) {
        eventName = vikingsStatusesMap[props.status];
    } else if (
        props.status === statuses.BUILD_CATHEDRAL &&
        props.citiesToCathedra.includes(cityId)
    ) {
        eventName = "chooseCathedral";
    } else if (
        props.status === statuses.CHOOSE_ATTACKED_CITY &&
        props.citiesToAttack.includes(cityId)
    ) {
        eventName = "chooseCityToAttack";
    } else if (
        props.status === statuses.REMOVE_VIKINGS &&
        props.citiesToRemoveVikings.includes(cityId)
    ) {
        eventName = "removeVikings";
    } else {
        return alert("Nie możesz wybrać tego miasta.");
    }

    store.emit("gameData", {
        data: cityId,
        eventName,
    });
};

export default chooseCity;
