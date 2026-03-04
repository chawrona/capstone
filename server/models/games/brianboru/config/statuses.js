const statuses = {
    WAITING: 0, // Oczekiwanie

    REJECT_CARDS: 1, // Odrzuć karty
    REJECT_CARDS_WAITING: 2, // Oczekiwanie, aż inni odrzucą karty

    MARRIAGE_END_PHASE_WAITING: 3, // Czekaj, aż inni wybudują miasta na koniec fazy małżeństw

    BUILD_CITY: 4, // Wybuduj miasto na normalnych zasadach
    BUILD_CITY_REGION: "region", // Wybuduj miasto w konkretnym regionie - w przyszłości inne regiony

    VIKINGS_YOUR_CITY: 5, // wybierz swoje miasto do ataku wikingów
    VIKINGS_SOMEONE_CITY: 6, // wybierz czyjeś miasto do ataku wikingów

    BUILD_CATHEDRAL: 7, // wybuduj katedrę

    CHOOSE_ATTACKED_CITY: 8,
    CHOOSE_FIRST_CARD: 9,
    CHOOSE_CARD: 10,
    CHOOSE_CARD_EFFECT: 11,

    BUILD_ATTACKED_CITY: 12, // wybuduj miasto, które wygrałeś
    BUILD_BOUGHT_CITY: 13, // wybuduj kupione miasto z karty

    REMOVE_VIKINGS: 14, // Usuń wikingów ze swojego miasta
};

export default statuses;
