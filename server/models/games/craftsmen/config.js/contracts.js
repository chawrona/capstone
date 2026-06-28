const contracts = [
    // EARLY GAME (18 kontraktów): 4-5 surowców, 1-2 rodzaje.
    [
        {
            title: "Świerkowa szafa",
            requirements: [["wood", 4]],
            available: true,
            icon: "1.png",
            points: 1,
        },
        {
            title: "Kamienna ścieżka",
            requirements: [["stone", 4]],
            available: true,
            icon: "2.png",
            points: 1,
        },
        {
            title: "Kamienne fundamenty",
            requirements: [
                ["stone", 3],
                ["brick", 2],
            ],
            available: true,
            icon: "3.png",
            points: 1,
        },
        {
            title: "Ceglany mur",
            requirements: [["brick", 4]],
            available: true,
            icon: "4.png",
            points: 1,
        },
        {
            title: "Żeliwne zawiasy",
            requirements: [["iron", 4]],
            available: true,
            icon: "5.png",
            points: 1,
        },
        {
            title: "Wózek",
            requirements: [
                ["wood", 3],
                ["iron", 1],
            ],
            available: true,
            icon: "6.png",
            points: 1,
        },
        {
            title: "Studnia",
            requirements: [
                ["stone", 2],
                ["wheat", 2],
            ],
            available: true,
            icon: "7.png",
            points: 1,
        },
        {
            title: "Dębowa szafa",
            requirements: [
                ["wood", 3],
                ["iron", 2],
            ],
            available: true,
            icon: "8.png",
            points: 1,
        },
        {
            title: "Palenisko",
            requirements: [
                ["brick", 3],
                ["iron", 1],
            ],
            available: true,
            icon: "9.png",
            points: 1,
        },
        {
            title: "Jesionowy stół",
            requirements: [
                ["wood", 3],
                ["wheat", 1],
            ],
            available: true,
            icon: "10.png",
            points: 1,
        },
        {
            title: "Narzędzia",
            requirements: [
                ["iron", 3],
                ["wood", 2],
            ],
            available: true,
            icon: "11.png",
            points: 1,
        },
        {
            title: "Zapas prowiantu",
            requirements: [["wheat", 4]],
            available: true,
            icon: "12.png",
            points: 1,
        },
        {
            title: "Żelazny pług",
            requirements: [
                ["iron", 4],
                ["wood", 1],
            ],
            available: true,
            icon: "13.png",
            points: 1,
        },
        {
            title: "Most",
            requirements: [
                ["stone", 3],
                ["wood", 2],
            ],
            available: true,
            icon: "14.png",
            points: 1,
        },
        {
            title: "Stoisko",
            requirements: [
                ["wood", 3],
                ["wheat", 2],
            ],
            available: true,
            icon: "15.png",
            points: 1,
        },
        {
            title: "Parter gospody",
            requirements: [
                ["brick", 4],
                ["wood", 1],
            ],
            available: true,
            icon: "16.png",
            points: 1,
        },
        {
            title: "Ceglany dach",
            requirements: [
                ["brick", 3],
                ["iron", 2],
            ],
            available: true,
            icon: "17.png",
            points: 1,
        },
        {
            title: "Stodoła",
            requirements: [
                ["wheat", 4],
                ["wood", 1],
            ],
            available: true,
            icon: "18.png",
            points: 1,
        },
    ],
    // MID GAME (10 kontraktów): Ściśle 5-6 surowców w sumie, 2-3 rodzaje.
    [
        {
            title: "Dzwon",
            requirements: [
                ["iron", 3],
                ["brick", 2],
                ["stone", 1],
            ],
            available: true,
            icon: "19.png",
            points: 2,
        },
        {
            title: "Ceglany piec",
            requirements: [
                ["brick", 3],
                ["stone", 2],
                ["wheat", 1],
            ],
            available: true,
            icon: "20.png",
            points: 2,
        },
        {
            title: "Żelazna brama",
            requirements: [
                ["iron", 4],
                ["stone", 2],
            ],
            available: true,
            icon: "21.png",
            points: 2,
        },
        {
            title: "Piec",
            requirements: [
                ["stone", 3],
                ["brick", 2],
                ["wood", 1],
            ],
            available: true,
            icon: "22.png",
            points: 2,
        },
        {
            title: "Obelisk",
            requirements: [
                ["stone", 3],
                ["iron", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "23.png",
            points: 2,
        },
        {
            title: "Łóżko",
            requirements: [
                ["wood", 2],
                ["wheat", 1],
                ["silk", 1],
            ],
            available: true,
            icon: "24.png",
            points: 2,
        },
        {
            title: "Fontanna",
            requirements: [
                ["stone", 3],
                ["brick", 1],
            ],
            available: true,
            icon: "25.png",
            points: 2,
        },
        {
            title: "Tron",
            requirements: [
                ["iron", 1],
                ["wood", 1],
                ["silk", 1],
            ],
            available: true,
            icon: "26.png",
            points: 2,
        },
        {
            title: "Szklarnia",
            requirements: [
                ["brick", 3],
                ["wheat", 1],
                ["glass", 1],
            ],
            available: true,
            icon: "27.png",
            points: 2,
        },
        {
            title: "Królewskie łoże",
            requirements: [
                ["wood", 3],
                ["silk", 1],
            ],
            available: true,
            icon: "28.png",
            points: 2,
        },
    ],
    // LATE GAME (8 kontraktów):
    // Zawsze dokładnie 2 rodzaje zwykłych surowców (ilość 1-3 każdego).
    // Surowce luksusowe (silk/amber/glass) maksymalnie do wartości 4.
    [
        {
            title: "Obserwatorium",
            requirements: [
                ["stone", 4],
                ["glass", 3],
            ],
            available: true,
            icon: "29.png",
            points: 3,
        },
        {
            title: "Szlacheckie lustro",
            requirements: [
                ["iron", 3],
                ["wood", 1],
                ["glass", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "30.png",
            points: 3,
        },
        {
            title: "Witraż",
            requirements: [
                ["stone", 1],
                ["brick", 1],
                ["glass", 3],
            ],
            available: true,
            icon: "31.png",
            points: 3,
        },
        {
            title: "Królewskie szaty",
            requirements: [
                ["wheat", 2],
                ["iron", 2],
                ["silk", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "32.png",
            points: 3,
        },
        {
            title: "Odnowa katedry",
            requirements: [
                ["stone", 2],
                ["brick", 2],
                ["glass", 3],
            ],
            available: true,
            icon: "33.png",
            points: 3,
        },
        {
            title: "Marmurowa wanna",
            requirements: [
                ["stone", 2],
                ["wheat", 1],
                ["amber", 3],
            ],
            available: true,
            icon: "34.png",
            points: 3,
        },
        {
            title: "Gobelin",
            requirements: [
                ["wood", 4],
                ["silk", 2],
            ],
            available: true,
            icon: "35.png",
            points: 3,
        },
        {
            title: "Karoca",
            requirements: [
                ["iron", 2],
                ["wood", 2],
                ["silk", 1],
                ["amber", 1],
            ],
            available: true,
            icon: "36.png",
            points: 3,
        },
    ],
];

export default contracts;
