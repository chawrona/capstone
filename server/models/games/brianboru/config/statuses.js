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
};

export default statuses;
