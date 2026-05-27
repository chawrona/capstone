const data = {
    allowBuying: true, // Czy gracz może kupić
    allowSelling: true, // Czy gracz może sprzedać
    availableMovement: {
        0: {
            inner: [true, true, true],
            outer: [true, true, true, true, true, true, true, true],
        },
        5: {
            inner: [true, false, false],
            outer: [false, true, false, false, false, false, false, true],
        },
    }, // dostępne pola do poruszenia się dla poszczególnych rzemieślników
    cartsToBuy: 5, // możliwa ilość wózków do zakupienia
    circleRotation: 2, // ilość obróceń kół
    contracts: [
        {
            id: 1,
            required: [
                { amount: 7, type: "wood" },
                { amount: 4, type: "stone" },
            ],
            show: true,
            title: "Dębowa szafa",
        },
    ], // tablica kontraktów do wykupienia
    currentPlayer: {}, // gracz, który właśnie ma turę
    guilds: {
        inner: [null, null, { hex: "red", name: "red" }],
        outer: [
            null,
            null,
            { hex: "green", name: "green" },
            null,
            { hex: "green", name: "green" },
            null,
            { hex: "blue", name: "blue" },
            null,
        ],
    }, // STAN WSZYSTKICH GILDII NA MAPIE

    hiddenGoal: {
        task: "zadanie",
        title: "tytuł",
    }, // ukryty cel gracza

    innerPathCraftsmen: {
        0: [
            {
                color: "green",
                id: 0,
                type: "craftsmen",
            },
        ],
    }, // Dla każdego pola na ścieżce wewnętrznej lista Rzemieślników

    innerPositions: {
        amber: 2,
        glass: 0,
        silk: 1,
    }, // Pozycje kafelków w wewnętrznym pierścieniu

    innerPositions: {
        bricks: 7,
        gold: 2,
        iron: 6,
        stone: 4,
        stone_wheat: 5,
        wheat: 3,
        wood: 0,
        wood_wheat: 1,
    }, // Pozycje kafelków w zewnętrznym pierścieniu

    inventory: ["wood"], // ekwipunek gracza

    isYourTurn: false, // czy Twoja tura

    outerPathCraftsmen: {
        0: [
            {
                color: "green",
                id: 0,
                type: "craftsmen",
            },
        ],
    }, // Dla każdego pola na ścieżce zewnętrznej lista Rzemieślników
    player: {}, // {username: "Thinkofistodo", color: {hex: #333, name: "red"}} // AKTUALNY GRACZ, KTÓRYM JESTEŚ
    players: [
        {
            contracts: 0, // liczba wypełnionych kontraktów,
            craftsmen: 2, // liczba rzemieślników,
            player: {}, // {username: "Thinkofistodo", color: {hex: #333, name: "red"}}
        },
    ],

    round: 1, // numer rundy

    statuses: ["status1", "status2"], // Co możesz robić

    traderLocked: false, // boolean
    turn: 1, // numer tury
};

const events = [
    "kup",
    "sprzedaj",
    "odblokuj handlarza",
    "zakończ turę",
    "kup wózek",
    "kup rzemieślnika",
    "postaw rzemieślnika",
    "kup handlarza",
    "postaw handlarza",
    "przesuń się pionkiem",
    "kup kontrakt",
    "odśwież kontrakt",
    "zakręć kołem",
    "kup gildię",
];
