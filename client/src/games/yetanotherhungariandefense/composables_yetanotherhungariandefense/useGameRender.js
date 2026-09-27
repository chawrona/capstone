import { onMounted } from "vue";

import StreetLamp from "@/assets/games/gameAssets/yetanotherhungariandefense/lamp.webp";

const WIDTH = 1920;
const HEIGHT = 950;
const MIDDLE = [960, 475];
const TILE = 35;

// Gra ma 27 kafelków wysokości i 53 kafelki szerokości
// Środkowy kafelek to 14 i 27
// Każdy kafelek ma 35 na 35 pikseli

function getMiddlePoint(x, y) {
    return [x / 2, y / 2];
}

// Na starcie załadować wszystkie grafiki, może pomyśleć nad sprite sheetem, że jedna grafika z wszystkimi grafikami i tylko renderuje się wycinek jeden.
export default function useGameRender(cv) {
    const lamp = new Image();
    lamp.src = StreetLamp;

    onMounted(async () => {
        cv.value.height = HEIGHT;
        cv.value.width = WIDTH;
        const canvas = cv.value.getContext("2d");

        await lamp.decode();

        // Lampa ma wymiary 1x4 kafelki
        // lampa jest idealnie na środkowym kafelku w osi X, na jego środku
        // natomiast jest o jeden kafelek wyżej niż środek w osi Y, też na środku kafelka
        // Kolizja planowana jest na tylko kafelek na dole
        // Renderowanie gracza musi być przed i z lampą w zależności od tego czy jest wyżejczy niżej w osi Y
        const [lampX, lampY] = getMiddlePoint(35, 140);
        canvas.drawImage(lamp, 960 - lampX, 475 - 35 - lampY, 35, 140);
    });
}

// To do
// Zrobić pętlę renderowania
// Wyświetlać gracza
// Gracz chodzi
// Kolizja gracza z lampą

// Inni gracze i inne moby nie mają kolizji lokalnie, każdy gracz ma kolizje u siebie
// natomiast postacie AI, ex. zombie, mają kolizję sprawdzaną na serwerze

// Dodanie innych graczy
// Kolizja z innymi graczami
