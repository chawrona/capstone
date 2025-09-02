import { randomInt } from "crypto";

const adjectives = [
    "Fast",
    "Happy",
    "Silent",
    "Clever",
    "Brave",
    "Lucky",
    "Wild",
    "Calm",
    "Swift",
    "Mighty",
];

const animals = [
    "Tiger",
    "Eagle",
    "Fox",
    "Wolf",
    "Bear",
    "Hawk",
    "Shark",
    "Lion",
    "Panda",
    "Falcon",
];

export default function generateUsername() {
    const adjective = adjectives[randomInt(0, adjectives.length)];
    const animal = animals[randomInt(0, animals.length)];
    const number = randomInt(1000, 9999); // czterocyfrowy numer dla unikalności

    return `${adjective}${animal}${number}`;
}
