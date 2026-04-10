import statuses from "../../../../../../server/models/games/brianboru/config/statuses";

const buildingStatuses = [
    statuses.BUILD_CITY,
    statuses.BUILD_CITY_REGION,
    statuses.BUILD_BOUGHT_CITY,
    statuses.BUILD_FIRST_CITY,
];

const getCitiesColors = (cityId, props) => {
    const owner = props.cities[cityId]
        ? props.cities[cityId].owner.color.hex
        : "transparent";

    const hover =
        buildingStatuses.includes(props.status) &&
        props.citiesToBuild.includes(cityId)
            ? props.you.color.hex
            : "transparent";

    return `--owner: ${owner}; --hoverColor: ${hover}; color: hsl(from var(--owner) h s calc(l * 0.8))`;
};

export default getCitiesColors;
