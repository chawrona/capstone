const contracts = [
    // EARLY GAME: 4-5 surowców, 1-2 rodzaje.
    // Każdy surowiec ma tutaj swoje "momenty chwały", nikt nie jest pominięty.
    [
        {
            title: "Świerkowa szafa",
            requirements: [["wood", 4]],
            available: true,
            icon: "1.png",
        },
        {
            title: "Kamienna ścieżka",
            requirements: [["stone", 4]],
            available: true,
            icon: "2.png",
        },
        {
            title: "Kamienne fundamenty",
            requirements: [
                ["stone", 3],
                ["brick", 2],
            ],
            available: true,
            icon: "3.png",
        },
        {
            title: "Ceglany mur",
            requirements: [["brick", 4]],
            available: true,
            icon: "4.png",
        },
        {
            title: "Żeliwne zawiasy",
            requirements: [["iron", 4]],
            available: true,
            icon: "5.png",
        },
        {
            title: "Wózek",
            requirements: [
                ["wood", 3],
                ["iron", 1],
            ],
            available: true,
            icon: "6.png",
        },
        {
            title: "Studnia",
            requirements: [
                ["stone", 2],
                ["wheat", 2], // Zboże jako wyżywienie/opłacenie kopaczy studni
            ],
            available: true,
            icon: "7.png",
        },
        {
            title: "Dębowa szafa",
            requirements: [
                ["wood", 3],
                ["iron", 2],
            ],
            available: true,
            icon: "8.png",
        },
        {
            title: "Palenisko",
            requirements: [
                ["brick", 3],
                ["iron", 1],
            ],
            available: true,
            icon: "9.png",
        },
        {
            title: "Jesionowy stół",
            requirements: [
                ["wood", 3],
                ["wheat", 1],
            ],
            available: true,
            icon: "10.png",
        },
        {
            title: "Narzędzia",
            requirements: [
                ["iron", 3],
                ["wood", 2],
            ],
            available: true,
            icon: "11.png",
        },
        {
            title: "Zapas prowiantu", // Zmiana nazwy z "Kupka drewna"
            requirements: [["wheat", 4]],
            available: true,
            icon: "12.png",
        },
    ],
    // MID GAME: 6-7 surowców, 2-3 rodzaje.
    // Zboże i cegła wchodzą na pełnej rotacji. Pojawiają się pierwsze luksusy.
    [
        {
            title: "Żelazny pług",
            requirements: [
                ["iron", 4],
                ["wood", 2],
            ],
            available: true,
            icon: "13.png",
        },
        {
            title: "Most",
            requirements: [
                ["stone", 3],
                ["wood", 2],
                ["iron", 2],
            ],
            available: true,
            icon: "14.png",
        },
        {
            title: "Stoisko",
            requirements: [
                ["wood", 3],
                ["wheat", 2],
                ["silk", 1],
            ],
            available: true,
            icon: "15.png",
        },
        {
            title: "Parter gospody",
            requirements: [
                ["brick", 4],
                ["wheat", 2],
                ["wood", 1],
            ],
            available: true,
            icon: "16.png",
        },
        {
            title: "Ceglany dach",
            requirements: [
                ["brick", 4],
                ["iron", 2],
            ],
            available: true,
            icon: "17.png",
        },
        {
            title: "Stodoła",
            requirements: [
                ["wheat", 4],
                ["wood", 2],
            ],
            available: true,
            icon: "18.png",
        },
        {
            title: "Dzwon",
            requirements: [
                ["iron", 3],
                ["brick", 2],
                ["stone", 1],
            ],
            available: true,
            icon: "19.png",
        },
        {
            title: "Ceglany piec",
            requirements: [
                ["brick", 3],
                ["stone", 3],
                ["wheat", 1],
            ],
            available: true,
            icon: "20.png",
        },
        {
            title: "Żelazna brama",
            requirements: [
                ["iron", 4],
                ["stone", 2],
            ],
            available: true,
            icon: "21.png",
        },
        {
            title: "Piec",
            requirements: [
                ["stone", 4],
                ["brick", 2],
                ["wood", 1],
            ],
            available: true,
            icon: "22.png",
        },
        {
            title: "Obelisk",
            requirements: [
                ["stone", 5],
                ["iron", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "23.png",
        },
        {
            title: "Łóżko",
            requirements: [
                ["wood", 4],
                ["wheat", 2],
                ["silk", 1],
            ],
            available: true,
            icon: "24.png",
        },
    ],
    // LATE GAME: Równo 8 surowców, 3-4 rodzaje.
    // Mieszanka wszystkiego. Zmusza graczy do posiadania pełnego plecaka i logistyki.
    [
        {
            title: "Fontanna",
            requirements: [
                ["stone", 4],
                ["brick", 2],
                ["iron", 1],
                ["glass", 1],
            ],
            available: true,
            icon: "25.png",
        },
        {
            title: "Tron",
            requirements: [
                ["iron", 3],
                ["wood", 2],
                ["silk", 2],
                ["amber", 1],
            ],
            available: true,
            icon: "26.png",
        },
        {
            title: "Szklarnia",
            requirements: [
                ["brick", 3],
                ["wheat", 2], // Zboże dla roślin
                ["glass", 2],
                ["wood", 1],
            ],
            available: true,
            icon: "27.png",
        },
        {
            title: "Królewskie łoże",
            requirements: [
                ["wood", 4],
                ["silk", 2],
                ["wheat", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "28.png",
        },
        {
            title: "Obserwatorium",
            requirements: [
                ["stone", 3],
                ["iron", 2],
                ["glass", 2],
                ["brick", 1],
            ],
            available: true,
            icon: "29.png",
        },
        {
            title: "Szlacheckie lustro",
            requirements: [
                ["glass", 3],
                ["iron", 2],
                ["wood", 2],
                ["amber", 1],
            ],
            available: true,
            icon: "30.png",
        },
        {
            title: "Witraż",
            requirements: [
                ["stone", 2],
                ["brick", 2],
                ["iron", 2],
                ["glass", 2],
            ],
            available: true,
            icon: "31.png",
        },
        {
            title: "Królewskie szaty",
            requirements: [
                ["silk", 3],
                ["wheat", 3],
                ["iron", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "32.png",
        },
        {
            title: "Odnowa katedry",
            requirements: [
                ["stone", 3],
                ["brick", 3],
                ["iron", 1],
                ["glass", 1],
            ],
            available: true,
            icon: "33.png",
        },
        {
            title: "Marmurowa wanna",
            requirements: [
                ["stone", 4],
                ["brick", 1],
                ["wheat", 1],
                ["amber", 2],
            ],
            available: true,
            icon: "34.png",
        },
        {
            title: "Gobelin",
            requirements: [
                ["silk", 3],
                ["wheat", 3],
                ["wood", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "35.png",
        },
        {
            title: "Karoca",
            requirements: [
                ["iron", 3],
                ["wood", 3],
                ["silk", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "36.png",
        },
    ],
];

export default contracts;
