const dialogs = {
    REJECT_CARDS: 0, // Odrzucanie kart
    FIRST_PLAYER: 1, // Kto jest pierwszym graczem

    MARRIAGE: 2, // nowa osoba do małżeństwa
    MARRIAGE_REWARDS: 3, // nagrody małżeństw
    MARRIAGE_REWARD_WINNING: 4, // Wygrałeś małżeństwo
    MARRIAGE_REWARD_CITY: 5, // wygrałeś miasto w małżeństwach, wybuduj je
    MARRIAGE_NO_WINNER: 6, // brak zwycięzcy w małżeństwach

    VIKINGS: 7, // nowa ilość wikingów
    VIKINGS_NO_ATTACK: 8, // nie ma ataku wikingów
    VIKINGS_REWARD: 9, // informacje o tym kto otrzymuje jakie nagrody
    VIKINGS_YOUR_CITY: 10, // masz wybrać swoje miasto do atakowania
    VIKINGS_ATTACK_INFO: 11, // informacje o tym kto jest atakowany
    VIKINGS_SOMEONE_CITY: 12, // masz wybrać czyjeś miasto do atakowania

    CHURCH: 13, // Informacje o kościele
    BUILD_CATHEDRAL: 14, // Informacja że budujesz katedrę
};

export default dialogs;
