import statuses from "../../../../../../server/models/games/brianboru/config/statuses";

export default function getCityState(cityId, region, props) {
    const {
        cities,
        citiesToAttack,
        citiesToBuild,
        citiesToCathedra,
        citiesToVikings,
        cityUnderAttack,
        status,
    } = props;

    const isStatus = (s) =>
        Array.isArray(s) ? s.includes(status) : status === s;

    return {
        [`${region.replace(/\s+/g, "")}_${cityId}`]: true,
        attacked: cityUnderAttack === cityId,

        attackedHover:
            isStatus(statuses.CHOOSE_ATTACKED_CITY) &&
            citiesToAttack.includes(cityId),
        canAttack:
            isStatus(statuses.CHOOSE_ATTACKED_CITY) &&
            citiesToAttack.includes(cityId),
        canBuild:
            isStatus([
                statuses.BUILD_CITY,
                statuses.BUILD_CITY_REGION,
                statuses.BUILD_BOUGHT_CITY,
                statuses.BUILD_FIRST_CITY,
            ]) && citiesToBuild.includes(cityId),
        canCathedra:
            isStatus(statuses.BUILD_CATHEDRAL) &&
            citiesToCathedra.includes(cityId),
        canVikings:
            isStatus([
                statuses.VIKINGS_SOMEONE_CITY,
                statuses.VIKINGS_YOUR_CITY,
            ]) && citiesToVikings.includes(cityId),

        cathedra: cities[cityId]?.cathedra,
        cathedra: true,
        cathedraHover: isStatus(statuses.BUILD_CATHEDRAL),
        city: true, // domyślna klasa dla każdego miasta
        hide:
            (isStatus([
                statuses.BUILD_CITY,
                statuses.BUILD_CITY_REGION,
                statuses.BUILD_BOUGHT_CITY,
                statuses.BUILD_FIRST_CITY,
            ]) &&
                !citiesToBuild.includes(cityId)) ||
            (isStatus(statuses.CHOOSE_ATTACKED_CITY) &&
                !citiesToAttack.includes(cityId) &&
                !Boolean(cities[cityId])),
        owned: Boolean(cities[cityId]),
        vikings: cities[cityId]?.vikings,
    };
}
