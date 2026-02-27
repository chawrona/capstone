const cities = {
    1: { region: "Northern Uí Néill", type: "red" },
    2: { region: "Northern Uí Néill", type: "red" },
    3: { region: "Northern Uí Néill", type: "blue" },
    4: { region: "Northern Uí Néill", type: "yellow" },

    5: { region: "Ulaid", type: "yellow" },
    6: { region: "Ulaid", type: "blue" },
    7: { region: "Ulaid", type: "red" },

    8: { region: "Bréifne", type: "red" },
    9: { region: "Bréifne", type: "blue" },
    10: { region: "Bréifne", type: "yellow" },
    11: { region: "Bréifne", type: "red" },

    12: { region: "Connaught", type: "red" },
    13: { region: "Connaught", type: "red" },
    14: { region: "Connaught", type: "red" },
    15: { region: "Connaught", type: "yellow" },
    16: { region: "Connaught", type: "red" },
    17: { region: "Connaught", type: "blue" },
    18: { region: "Connaught", type: "yellow" },
    19: { region: "Connaught", type: "blue" },

    20: { region: "Southern Uí Néill", type: "red" },
    21: { region: "Southern Uí Néill", type: "blue" },
    22: { region: "Southern Uí Néill", type: "yellow" },
    23: { region: "Southern Uí Néill", type: "blue" },
    24: { region: "Southern Uí Néill", type: "yellow" },
    25: { region: "Southern Uí Néill", type: "red" },

    26: { region: "Dubhlinn", type: "yellow" },
    27: { region: "Dubhlinn", type: "red" },
    28: { region: "Dubhlinn", type: "blue" },

    29: { region: "Leinster", type: "yellow" },
    30: { region: "Leinster", type: "blue" },
    31: { region: "Leinster", type: "red" },
    32: { region: "Leinster", type: "yellow" },
    33: { region: "Leinster", type: "blue" },
    34: { region: "Leinster", type: "yellow" },
    35: { region: "Leinster", type: "yellow" },
    36: { region: "Leinster", type: "blue" },

    37: { region: "Munster", type: "blue" },
    38: { region: "Munster", type: "yellow" },
    39: { region: "Munster", type: "red" },
    40: { region: "Munster", type: "yellow" },
    41: { region: "Munster", type: "red" },
    42: { region: "Munster", type: "red" },
    43: { region: "Munster", type: "blue" },
    44: { region: "Munster", type: "red" },
};

const connections = {
    1: [2, 3],
    2: [1, 4, 5],
    3: [1, 4, 12],
    4: [2, 3, 10],

    5: [2, 6],
    6: [5, 7],
    7: [6, 11, 21],

    8: [9, 10, 15],
    9: [8, 11, 17, 22],
    10: [4, 8, 11],
    11: [7, 9, 10, 20],

    12: [3, 13, 15],
    13: [12, 14, 16],
    14: [13],
    15: [8, 12, 16, 17],
    16: [13, 15, 18],
    17: [9, 15, 19, 23],
    18: [16, 19, 38],
    19: [17, 18, 30, 37],

    20: [11, 21, 22],
    21: [7, 20, 24, 26],
    22: [9, 20, 23, 25],
    23: [17, 22, 25, 30],
    24: [21, 25, 27, 29],
    25: [22, 23, 24, 29],

    26: [21, 27],
    27: [24, 26, 28, 32],
    28: [27, 33],

    29: [24, 25, 30, 31],
    30: [19, 23, 29, 34],
    31: [29, 32, 34, 35],
    32: [27, 31, 33],
    33: [28, 32, 36],
    34: [30, 31, 35, 39],
    35: [31, 34, 36, 44],
    36: [33, 35],

    37: [19, 38, 40],
    38: [18, 37, 39],
    39: [34, 38, 40, 44],
    40: [37, 39, 41, 43],
    41: [40, 42],
    42: [41],
    43: [40, 44],
    44: [35, 39, 43],
};

const regions = {
    "Northern Uí Néill": {
        cities: [1, 2, 3, 4],
        points: 0,
        minCity: 0,
    },
    Ulaid: {
        cities: [5, 6, 7],
        points: 0,
        minCity: 0,
    },
    Bréifne: {
        cities: [8, 9, 10, 11],
        points: 0,
        minCity: 0,
    },
    Connaught: {
        cities: [12, 13, 14, 15, 16, 17, 18, 19],
        points: 0,
        minCity: 0,
    },
    "Southern Uí Néill": {
        cities: [20, 21, 22, 23, 24, 25],
        points: 0,
        minCity: 0,
    },
    Dubhlinn: {
        cities: [26, 27, 28],
        points: 0,
        minCity: 0,
    },
    Leinster: {
        cities: [29, 30, 31, 32, 33, 34, 35, 36],
        points: 0,
        minCity: 0,
    },
    Munster: {
        cities: [37, 38, 39, 40, 41, 42, 43, 44],
        points: 0,
        minCity: 0,
    },
};

export { cities, connections, regions };
