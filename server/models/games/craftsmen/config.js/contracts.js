const contracts = [
    // EARLY GAME
    [
        {
            title: "Proste narzędzia",
            requirements: [
                ["iron", 2],
                ["wood", 1],
            ],
            available: true,
            icon: "proste_narzedzia",
        },
        {
            title: "Ceglany piec",
            requirements: [["brick", 4]],
            available: true,
            icon: "ceglany_piec",
        },
        {
            title: "Kamienna studnia",
            requirements: [
                ["stone", 3],
                ["wood", 1],
            ],
            available: true,
            icon: "kamienna_studnia",
        },
        {
            title: "Wóz z prowiantem",
            requirements: [
                ["wood", 2],
                ["wheat", 2],
            ],
            available: true,
            icon: "woz_z_prowiantem",
        },
        {
            title: "Dębowy stół",
            requirements: [["wood", 4]],
            available: true,
            icon: "debowy_stol",
        },
        {
            title: "Drewniany płot",
            requirements: [
                ["wood", 3],
                ["iron", 1],
            ],
            available: true,
            icon: "drewniany_plot",
        },
        {
            title: "Kamienne palenisko",
            requirements: [["stone", 4]],
            available: true,
            icon: "kamienne_palenisko",
        },
        {
            title: "Mała stodoła",
            requirements: [
                ["wood", 3],
                ["brick", 2],
            ],
            available: true,
            icon: "mala_stodola",
        },
        {
            title: "Żelazne okucia",
            requirements: [
                ["iron", 3],
                ["brick", 1],
            ],
            available: true,
            icon: "zelazne_okucia",
        },
        {
            title: "Zapasy na zimę",
            requirements: [
                ["wheat", 4],
                ["wood", 1],
            ],
            available: true,
            icon: "zapasy_na_zime",
        },
        {
            title: "Solidne fundamenty",
            requirements: [
                ["stone", 3],
                ["brick", 2],
            ],
            available: true,
            icon: "solidne_fundamenty",
        },
        {
            title: "Drewniany mostek",
            requirements: [
                ["wood", 4],
                ["stone", 1],
            ],
            available: true,
            icon: "drewniany_mostek",
        },
    ],
    // MID GAME
    [
        {
            title: "Dębowa szafa",
            requirements: [
                ["wood", 5],
                ["iron", 1],
            ],
            available: true,
            icon: "debowa_szafa",
        },
        {
            title: "Ceglany mur",
            requirements: [
                ["brick", 5],
                ["stone", 2],
            ],
            available: true,
            icon: "ceglany_mur",
        },
        {
            title: "Żelazna brama",
            requirements: [
                ["iron", 4],
                ["stone", 2],
            ],
            available: true,
            icon: "zelazna_brama",
        },
        {
            title: "Wygodne łoże",
            requirements: [
                ["wood", 4],
                ["silk", 1],
            ],
            available: true,
            icon: "wygodne_loze",
        },
        {
            title: "Warsztat kowala",
            requirements: [
                ["brick", 4],
                ["iron", 3],
            ],
            available: true,
            icon: "warsztat_kowala",
        },
        {
            title: "Kamienny pomnik",
            requirements: [["stone", 6]],
            available: true,
            icon: "kamienny_pomnik",
        },
        {
            title: "Stragan kupiecki",
            requirements: [
                ["wood", 5],
                ["silk", 1],
            ],
            available: true,
            icon: "stragan_kupiecki",
        },
        {
            title: "Miejski spichlerz",
            requirements: [
                ["brick", 5],
                ["wheat", 3],
            ],
            available: true,
            icon: "miejski_spichlerz",
        },
        {
            title: "Żelazny pług",
            requirements: [
                ["iron", 5],
                ["wood", 2],
            ],
            available: true,
            icon: "zelazny_plug",
        },
        {
            title: "Brukowana ulica",
            requirements: [
                ["stone", 5],
                ["iron", 1],
            ],
            available: true,
            icon: "brukowana_ulica",
        },
        {
            title: "Solidna karczma",
            requirements: [
                ["wood", 4],
                ["brick", 4],
            ],
            available: true,
            icon: "solidna_karczma",
        },
        {
            title: "Miedziany dzwon",
            requirements: [
                ["iron", 4],
                ["brick", 3],
            ],
            available: true,
            icon: "miedziany_dzwon",
        },
    ],
    // LATE GAME
    [
        {
            title: "Marmurowa łazienka",
            requirements: [
                ["stone", 4],
                ["glass", 1],
            ],
            available: true,
            icon: "marmurowa_lazienka",
        },
        {
            title: "Katedralny witraż",
            requirements: [
                ["glass", 2],
                ["iron", 3],
            ],
            available: true,
            icon: "katedralny_witraz",
        },
        {
            title: "Jedwabny gobelin",
            requirements: [
                ["silk", 3],
                ["wood", 3],
            ],
            available: true,
            icon: "jedwabny_gobelin",
        },
        {
            title: "Pałacowa fontanna",
            requirements: [
                ["stone", 6],
                ["glass", 1],
            ],
            available: true,
            icon: "palacowa_fontanna",
        },
        {
            title: "Królewski tron",
            requirements: [["silk", 5]],
            available: true,
            icon: "krolewski_tron",
        },
        {
            title: "Szklarnia herbowa",
            requirements: [
                ["glass", 3],
                ["silk", 3],
            ],
            available: true,
            icon: "szklarnia_herbowa",
        },
        {
            title: "Dworska sypialnia",
            requirements: [
                ["silk", 2],
                ["wood", 6],
            ],
            available: true,
            icon: "dworska_sypialnia",
        },
        {
            title: "Obserwatorium",
            requirements: [
                ["glass", 2],
                ["stone", 5],
            ],
            available: true,
            icon: "obserwatorium",
        },
        {
            title: "Lustrzana sala",
            requirements: [
                ["glass", 3],
                ["stone", 4],
            ],
            available: true,
            icon: "lustrzana_sala",
        },
        {
            title: "Złocony powóz",
            requirements: [
                ["wood", 6],
                ["iron", 4],
            ],
            available: true,
            icon: "zlocony_powoz",
        },
        {
            title: "Wielka katedra",
            requirements: [
                ["stone", 7],
                ["glass", 2],
            ],
            available: true,
            icon: "wielka_katedra",
        },
        {
            title: "Królewskie szaty",
            requirements: [
                ["silk", 4],
                ["iron", 1],
            ],
            available: true,
            icon: "krolewskie_szaty",
        },
    ],
];

export default contracts;
