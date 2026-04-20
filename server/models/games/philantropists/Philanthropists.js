import Game from "../../Game.js";
import Timer from "../eurobusiness/modules/Timer.js";

export default class Philanthropists extends Game {
    constructor(players, endGame, lobbyId, playerClass) {
        super(players, endGame, lobbyId, playerClass);

        this.gracze = Array.from(this.players.values());

        this.gracze.forEach((gracz, index) => {
            gracz.setData("index", () => index);
        });

        this.active = false;
        this.development = true;

        this.timer = new Timer(60);

        // przejścia dookoła stołu w ciągu jednego tury
        this.fazy = 8;
        this.faza = 3;

        // Ile razy zmienia się znacznik pierwszego gracza
        this.tura = 1;
        this.tury = 4;

        this.czat = [];

        this.coAktualnieKupil = [];

        this.firstPlayerIndex = 0;
        this.whosTurn = 0;

        this.dalFilantropie = false;

        this.ceny = [
            0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
            90, 100, 110, 120, 130, 140, 150, 165, 180, 195, 210, 230, 250,
        ];

        // TOP

        this.podsumowanieFazy = false;

        this.messages = [];

        this.koniecGry = false;
        this.ktoraKartaManipulacji = 1;

        this.kartyGraczy = [];

        this.czyMozeSprzedac = true;
        this.czyMozekupic = true;

        this.licznikSprzedazyLubKupowania = 0;

        this.soundToPlay = null;

        this.bank = {
            wegiel: 10,
            zboze: 10,
            kawa: 10,
            guma: 10,
            herbata: 10,
            sol: 10,
        };

        this.plansza = [
            {
                current: 8,
                type: "wegiel",
            },
            {
                current: 8,
                type: "zboze",
            },
            {
                current: 8,
                type: "kawa",
            },
            {
                current: 8,
                type: "guma",
            },
            {
                current: 8,
                type: "herbata",
            },
            {
                current: 8,
                type: "sol",
            },
        ];

        this.start();
    }

    shuffle(array) {
        let currentIndex = array.length;

        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
    }

    generujKartyGry() {
        const wartosci = [-2, 2, -4, 4, -6, 6, 2, 4, 6, -2, -4, -6];
        const typy = ["sol", "wegiel", "herbata", "guma", "kawa", "zboze"];
        const karty = [];

        for (const wartosc of wartosci) {
            for (const typ of typy) {
                karty.push({
                    wartosc,
                    typ,
                });
            }
        }

        this.shuffle(karty);

        const kartyGraczy = [];

        for (let j = 0; j < this.gracze.length; j++) {
            const kl = [];

            for (let i = 0; i < 8; i++) {
                let randomIndex = Math.floor(Math.random() * karty.length);

                while (!karty[randomIndex]) {
                    randomIndex = Math.floor(Math.random() * karty.length);
                }

                kl.push(karty[randomIndex]);
                karty[randomIndex] = null;
            }

            kartyGraczy.push(kl);
        }

        this.kartyGraczy = kartyGraczy;
    }

    cenaKarty(typ) {
        for (const karta of this.plansza) {
            if (karta.type === typ) {
                return this.ceny[karta.current];
            }
        }
    }

    generujPodsumowanieFilantropii() {
        const podsumowanie = [];
        for (const gracz of this.gracze) {
            const kartyGracza = [];
            let index = 0;
            for (const karta of gracz.filantropiaKarty) {
                if (!karta) {
                    index++;
                    continue;
                }

                kartyGracza.push({
                    typ: karta,
                    cena: this.cenaKarty(karta),
                });

                gracz.filantropiaKarty[index] = null;
                gracz.filantropiaHajs += this.cenaKarty(karta);

                this.bank[karta]++;
                index++;
            }

            podsumowanie.push({
                nick: gracz.username,
                karty: kartyGracza,
            });
        }

        this.podsumowanieFilantropii = podsumowanie;
    }

    thisGraczOrder(index) {
        const tabelaWynikow = [];
        for (const gracz of this.gracze) {
            tabelaWynikow.push({
                hajs: gracz.hajs,
                index: gracz.data.index,
                filantropiaHajs: gracz.filantropiaHajs,
            });
        }

        tabelaWynikow.sort((a, b) => {
            return b.hajs - a.hajs;
        });

        let indexGraczaZnajmniejszaFilantropia = 0;

        for (let i = 0; i < tabelaWynikow.length; i++) {
            const gracz = tabelaWynikow[i];
            if (
                tabelaWynikow[indexGraczaZnajmniejszaFilantropia]
                    .filantropiaHajs > gracz.filantropiaHajs
            ) {
                indexGraczaZnajmniejszaFilantropia = i;
            }

            if (
                tabelaWynikow[indexGraczaZnajmniejszaFilantropia]
                    .filantropiaHajs === gracz.filantropiaHajs
            ) {
                if (
                    tabelaWynikow[indexGraczaZnajmniejszaFilantropia].hajs <
                    gracz.hajs
                ) {
                    indexGraczaZnajmniejszaFilantropia = i;
                }
            }
        }

        const graczPrzegrany = tabelaWynikow.splice(
            indexGraczaZnajmniejszaFilantropia,
            1,
        )[0];
        tabelaWynikow.push(graczPrzegrany);

        for (const w of tabelaWynikow) {
            if (w.index === index) {
                return tabelaWynikow.indexOf(w);
            }
        }

        return "Something went really wrong";
    }

    orderKolor(index) {
        if (index === 0) return "zloto";
        if (index === 1) return "srebro";
        if (index === 2) return "braz";
        if (index === this.gracze.length - 1) return "ostatni";
        return "none";
    }

    generujPodsumowanieWynikow() {
        const podsumowanie = [];
        for (const gracz of this.gracze) {
            podsumowanie.push({
                name: gracz.username,
                dotacje: gracz.filantropiaHajs,
                hajs: gracz.hajs,
                hajsf: gracz.filantropiaHajs,
                kolor: this.orderKolor(this.thisGraczOrder(gracz.data.index)),
                lastOrder: gracz.lastOrder ? gracz.lastOrder : gracz.data.index,
                order: this.thisGraczOrder(gracz.data.index),
            });

            gracz.lastOrder = this.thisGraczOrder(gracz.data.index);
        }
        this.podsumowanieWynikow = podsumowanie;
        this.koniecDane = podsumowanie.sort((a, b) => a.order - b.order);
    }

    generujDaneDoRekordow() {
        const podsumowanie = [];

        for (const gracz of this.gracze) {
            podsumowanie.push({
                name: gracz.username,
                hajs: gracz.hajs,
                hajsf: gracz.filantropiaHajs,
            });
        }

        podsumowanie.sort((a, b) => a.hajs - b.hajs);

        let minHajsfIndex = 0;
        for (let i = 1; i < podsumowanie.length; i++) {
            if (podsumowanie[i].hajsf < podsumowanie[minHajsfIndex].hajsf) {
                minHajsfIndex = i;
            }
        }

        podsumowanie.splice(minHajsfIndex, 1);

        return podsumowanie.sort();
    }

    start() {
        this.koniecGry = false;
        this.czat = [];
        this.messages = [];

        this.active = true;

        this.podsumowanieFazy = false;

        const liczbaGraczy = this.gracze.length;

        this.tury = liczbaGraczy;
        this.tura = 1;
        this.dalFilantropie = false;
        this.faza = 1;
        this.fazy = 8;

        this.licznikSprzedazyLubKupowania = 0;
        this.graczCoRobi = "Czeka";
        this.ktoraKartaManipulacji = 1;
        this.czyMozeSprzedac = true;
        this.czyMozekupic = true;

        this.bank = {
            wegiel: 10,
            zboze: 10,
            kawa: 10,
            guma: 10,
            herbata: 10,
            sol: 10,
        };

        this.plansza = [
            {
                current: 8,
                type: "wegiel",
            },
            {
                current: 8,
                type: "zboze",
            },
            {
                current: 8,
                type: "kawa",
            },
            {
                current: 8,
                type: "guma",
            },
            {
                current: 8,
                type: "herbata",
            },
            {
                current: 8,
                type: "sol",
            },
        ];
        this.timer.setTimer(60);
        this.startTimer();
        this.generujKartyGry();
    }

    startTimer() {
        this.intervalId = setInterval(() => {
            if (!this.paused) {
                this.timer.subtract(1);

                if (this.timer.isTimerZero()) {
                    console.log("Robi się automatyczne");

                    this.useEventEmmiter(this.dalej());
                }
            }
        }, 1000);
    }

    generujDaneKoniecGry() {
        const daneKoniec = [];
        for (const gracz of this.gracze) {
            daneKoniec.push(gracz.username);
        }

        // @TO-DO posortować
        // daneKoniec.sort((a, b) => {
        //     let z = 0;
        //     let x = 0;

        //     for (const gracz of this.gracze) {
        //         if (a === gracz.username) z ;
        //     }

        //     return x - z;
        // });

        return daneKoniec;
    }

    // @event
    dalej() {
        this.timer.setTimer(60);

        if (this.faza % 2 === 0 && this.ktoraKartaManipulacji < 3) {
            this.automatycznaManipulacja();
        }

        this.whosTurn++;

        this.coAktualnieKupil = [];

        if (this.whosTurn > this.gracze.length - 1) this.whosTurn = 0;

        if (this.whosTurn === this.firstPlayerIndex) {
            this.faza++;

            if (this.faza > this.fazy) {
                this.faza = 1;

                this.tura++;
                this.timer.setTimer(60);

                for (const gracz of this.gracze) {
                    gracz.hajs += this.tura - 1 * 25;
                }

                if (this.tura > this.tury) {
                    this.generujPodsumowanieFilantropii();
                    this.generujPodsumowanieWynikow();
                    this.podsumowanieFazy = true;
                    this.koniecGry = true;

                    this.faza = this.fazy;
                    this.tura = this.tury;

                    this.endGame();
                    this.active = false;
                    clearInterval(this.intervalId);
                    return this.wyslijObiektyGraczom();
                } else {
                    this.log("Nowa tura");
                }

                this.firstPlayerIndex++;
                this.generujPodsumowanieFilantropii();
                this.generujPodsumowanieWynikow();
                this.generujKartyGry();
                this.podsumowanieFazy = true;
            } else {
                this.podsumowanieFazy = false;
                this.log(
                    `Nowa faza - ${this.faza % 2 == 0 ? "manipulacja" : "kupowanie/sprzedawanie"}`,
                );

                if (this.faza % 2 === 0) {
                    this.log("Rynek się stabilizuje");

                    const wartosci = this.plansza.map((s) => s.current);
                    const posortowane = [...wartosci].sort((a, b) => a - b);
                    const mediana =
                        posortowane[Math.floor(posortowane.length / 2)];

                    const min = Math.min(...wartosci);
                    const max = Math.max(...wartosci);
                    const roznica = max - min;

                    const ponizej40 = wartosci.filter((v) => v < 40).length;
                    const ponizej55 = wartosci.filter((v) => v < 55).length;

                    for (const surowiec of this.plansza) {
                        const odchylenie = surowiec.current - mediana;

                        if (Math.abs(odchylenie) > 9) {
                            let krokMinus = 2;
                            let krokPlus = 2;

                            if (roznica > 160) krokMinus += 2;
                            else if (roznica > 125) krokMinus += 1;

                            // zwiększanie kroku dodawania
                            if (ponizej40 <= 2) krokPlus += 1;
                            if (ponizej55 === 1) krokPlus += 1;

                            if (odchylenie > 0) {
                                surowiec.current -= krokMinus;
                            } else {
                                surowiec.current += krokPlus;
                            }

                            surowiec.current = Math.max(
                                0,
                                Math.min(
                                    surowiec.current,
                                    this.ceny.length - 1,
                                ),
                            );
                        }
                    }
                }
            }

            this.whosTurn = this.firstPlayerIndex;
        }
        this.uzylPrawej = false;
        this.uzylLewej = false;
        this.ktoraKartaManipulacji = 1;
        this.czyMozeSprzedac = true;
        this.czyMozekupic = true;
        this.dalFilantropie = false;
        this.licznikSprzedazyLubKupowania = 0;
        this.graczCoRobi = this.faza % 2 === 0 ? "Manipuluje" : "Czeka";

        this.logGracz("rozpoczyna ruch");
        return this.wyslijObiektyGraczom();
    }

    logGracz(wydarzenie, color) {
        const currentGracz = this.gracze[this.whosTurn].username;
        this.log(`${currentGracz} ${wydarzenie}`, color);
    }

    log(wiadomosc, color = "white") {
        this.czat.push({
            wiadomosc,
            color,
            id: Math.random().toString(36).substring(2, 12),
        });

        if (this.czat.length > 40) this.czat.shift();
    }

    leweKartyGracza(index) {
        return this.kartyGraczy[index];
    }

    praweKartyGracza(index) {
        if (index === 0) {
            return this.kartyGraczy[this.kartyGraczy.length - 1];
        }

        return this.kartyGraczy[index - 1];
    }

    uzyjManipulacji(data, isAuto) {
        const [ktoraStrona, index] = data.data;

        if (ktoraStrona === "prawa" && this.uzylPrawej) {
            return console.log(
                "Gracz próbował użyć karty manipulacji ze strony, z której już brał kartę.",
            );
        } else if (this.uzylLewej && ktoraStrona !== "prawa") {
            return console.log(
                "Gracz próbował użyć karty manipulacji ze strony, z której już brał kartę.",
            );
        }

        const karty =
            ktoraStrona === "prawa"
                ? this.praweKartyGracza(this.whosTurn)
                : this.leweKartyGracza(this.whosTurn);

        const karta = karty[index];

        if (!karta) return;

        const wartosc = karta.wartosc;
        const typ = karta.typ;

        const mnoznik = this.ktoraKartaManipulacji === 1 ? 1 : 0.5;

        for (const surowiec of this.plansza) {
            if (surowiec.type === typ) {
                surowiec.current += wartosc * mnoznik;
                if (surowiec.current < 0) {
                    surowiec.current = 0;
                }
                if (surowiec.current > this.ceny.length - 1)
                    surowiec.current = this.ceny.length - 1;
            }
        }

        this.ktoraKartaManipulacji++;

        this.soundToPlay = `manipulate${this.ktoraKartaManipulacji}`;

        karty[index] = null;

        this.logGracz(
            `manipuluje ${wartosc > 0 ? "+" + wartosc : wartosc}`,
            this.getLogKolor(typ),
        );

        if (ktoraStrona === "prawa") this.uzylPrawej = true;
        else this.uzylLewej = true;

        if (this.ktoraKartaManipulacji === 3 && !isAuto) return this.dalej();

        return this.wyslijObiektyGraczom();
    }

    uzyjlosowejkartymanipulacji(ktoraStrona) {
        const karty =
            ktoraStrona === "prawa"
                ? this.praweKartyGracza(this.whosTurn)
                : this.leweKartyGracza(this.whosTurn);

        let losowyIndexNiepustejKarty = null;

        while (losowyIndexNiepustejKarty === null) {
            const index = Math.floor(Math.random() * karty.length);
            if (karty[index]) losowyIndexNiepustejKarty = index;
        }

        this.uzyjManipulacji(
            { data: [ktoraStrona, losowyIndexNiepustejKarty] },
            true,
        );
    }

    automatycznaManipulacja() {
        if (this.uzylPrawej && !this.uzylLewej) {
            this.uzyjlosowejkartymanipulacji("lewa");
        }

        if (!this.uzylPrawej && this.uzylLewej) {
            this.uzyjlosowejkartymanipulacji("prawa");
        }

        if (!this.uzylPrawej && !this.uzylLewej) {
            if (Math.random() < 0.5) {
                this.uzyjlosowejkartymanipulacji("prawa");
                this.uzyjlosowejkartymanipulacji("lewa");
            } else {
                this.uzyjlosowejkartymanipulacji("lewa");
                this.uzyjlosowejkartymanipulacji("prawa");
            }
        }
    }

    getLogKolor(typ) {
        return (
            {
                wegiel: "#63645d",
                zboze: "#fdd05d",
                kawa: "#b61e1a",
                guma: "#b16d24",
                herbata: "#5e9b3d",
                sol: "#f8faf8",
                filantropia: "#d5c8a8",
            }[typ] || "#ffffff"
        );
    }

    lewyGracz(index) {
        if (index === 0) {
            return this.gracze[this.gracze.length - 1].username;
        }

        return this.gracze[index - 1].username;
    }

    prawyGracz(index) {
        if (index === this.gracze.length - 1) return this.gracze[0].username;
        return this.gracze[index + 1].username;
    }

    wyslijObiektyGraczom() {
        const dataToSend = [];
        for (const gracz of this.gracze) {
            dataToSend.push(this.wyslijObiektGraczowi(gracz));
        }
        return dataToSend;
    }

    getPlayer(publicId) {
        for (const gracz of this.gracze) {
            if (gracz.publicId === publicId) return gracz;
        }
    }

    gameDataRequest(data) {
        return [this.wyslijObiektGraczowi(this.getPlayer(data.publicId))];
    }

    wyslijObiektGraczowi(gracz) {
        return {
            target: gracz.publicId,
            eventName: "gameData",
            data: {
                ...this.data(),
                karty: gracz.karty,
                filantropiaHajs: gracz.filantropiaHajs,
                filantropiaKarty: gracz.filantropiaKarty,
                hajs: gracz.hajs,

                lewyNick: this.prawyGracz(gracz.data.index),
                leweKarty: this.leweKartyGracza(gracz.data.index),
                praweKarty: this.praweKartyGracza(gracz.data.index),
                prawyNick: this.lewyGracz(gracz.data.index),

                graczCoRobi: this.coRobiGracz(
                    this.whosTurn === gracz.data.index,
                ),
                lobbyId: this.lobbyId,
                nick: gracz.username,
                soundToPlay: this.soundToPlay,
                jestesPierwszymGraczem:
                    gracz.data.index === this.firstPlayerIndex,
                twojaTura: this.whosTurn === gracz.data.index,
            },
        };
    }

    coRobiGracz(czyJegoTura) {
        const aktualnyGracz = this.gracze[this.whosTurn];

        if (czyJegoTura) {
            switch (this.graczCoRobi) {
                case "Czeka":
                    return `Kup/Sprzedaj`;
                case "Kupuje":
                    return `Kupujesz (${this.licznikSprzedazyLubKupowania}/3)`;
                case "Sprzedaje":
                    return `Sprzedajesz (${this.licznikSprzedazyLubKupowania}/3)`;
                case "Manipuluje":
                    return `Manipulujesz rynkiem (${this.ktoraKartaManipulacji}/2)`;
                case "Skonczyl":
                    return this.dalFilantropie ||
                        aktualnyGracz.filantropiaKarty.indexOf(null) === -1
                        ? "Koniec ruchu"
                        : "Filantropia?";
            }
        } else {
            switch (this.graczCoRobi) {
                case "Czeka":
                    return `${this.nickAktualnegoGracza()} myśli...`;
                case "Kupuje":
                    return `${this.nickAktualnegoGracza()} kupuje (${this.licznikSprzedazyLubKupowania}/3)`;
                case "Sprzedaje":
                    return `${this.nickAktualnegoGracza()} sprzedaje (${this.licznikSprzedazyLubKupowania}/3)`;
                case "Manipuluje":
                    return `${this.nickAktualnegoGracza()} manipuluje rynkiem (${this.ktoraKartaManipulacji}/2)`;
                case "Skonczyl":
                    return this.dalFilantropie
                        ? `${this.nickAktualnegoGracza()} Kończy turę`
                        : `${this.nickAktualnegoGracza()} zastanawia się nad filantropią`;
            }
        }
    }

    nickAktualnegoGracza() {
        return this.gracze[this.whosTurn].username;
    }

    data() {
        return {
            podsumowanieFazy: this.podsumowanieFazy,
            active: this.active,
            ceny: this.ceny,
            koniecGry: this.koniecGry,
            fazy: this.fazy,
            faza: this.faza,
            mozeManipulować: this.ktoraKartaManipulacji < 3,
            podsumowanieFilantropii: this.podsumowanieFilantropii,
            podsumowanieWynikow: this.podsumowanieWynikow,
            tura: this.tura,
            tury: this.tury,
            gracze: this.gracze.map((p) => {
                return {
                    name: p.username,
                    filantropiaHajs: p.filantropiaHajs,
                    filantropiaKarty: p.filantropiaKarty,
                };
            }),
            pauza: false,
            rekordy: this.rekordy,
            czat: this.czat,
            koniecDane: this.koniecDane,
            timer: this.timer.getTimer(),
            manilupujemy: this.faza % 2 === 0,
            licznikSprzedazyLubKupowania: this.licznikSprzedazyLubKupowania,
            nickAktualnegoGracza: this.nickAktualnegoGracza(),

            dalFilantropie: this.dalFilantropie,
            firstPlayerIndex: this.firstPlayerIndex,
            whosTurn: this.whosTurn,

            plansza: this.plansza,
            bank: this.bank,
        };
    }

    oddajFilantropia(data) {
        const [typ, index] = data.data;

        if (this.dalFilantropie) return;

        const aktualnyGracz = this.gracze[this.whosTurn];

        if (aktualnyGracz.karty.indexOf(typ) === -1) return;

        this.usunKarteGracza(aktualnyGracz.karty, typ);

        aktualnyGracz.filantropiaKarty[index] = typ;

        this.dalFilantropie = true;

        this.soundToPlay = `filantropia`;

        this.logGracz(`- filantropia`, this.getLogKolor("filantropia"));
        return this.wyslijObiektyGraczom();
    }

    // @event
    kup(data) {
        const typ = data.data;

        if (this.licznikSprzedazyLubKupowania === 3) {
            return (this.graczCoRobi = "Skonczyl");
        }

        const aktualnyGracz = this.gracze[this.whosTurn];

        let cena = 0;
        let typ2 = "";
        for (const surowiec of this.plansza) {
            if (surowiec.type === typ) {
                typ2 = surowiec.type;
                cena = this.ceny[surowiec.current];
                if (cena === 0) {
                    return;
                }
            }
        }

        if (aktualnyGracz.hajs < cena) {
            return;
        }

        if (this.bank[typ2] === 0) return;

        if (this.czyMozekupic) {
            this.czyMozeSprzedac = false;
        } else {
            return;
        }

        this.bank[typ2] -= 1;
        aktualnyGracz.hajs -= cena;
        aktualnyGracz.karty.push(typ);
        this.coAktualnieKupil.push(typ);

        if (
            this.coAktualnieKupil.length === 3 &&
            this.coAktualnieKupil[0] === this.coAktualnieKupil[1] &&
            this.coAktualnieKupil[1] === this.coAktualnieKupil[2]
        ) {
            for (const surowiec of this.plansza) {
                if (surowiec.type === this.coAktualnieKupil[1]) {
                    surowiec.current = Math.max(
                        0,
                        Math.min(surowiec.current - 1, this.ceny.length - 1),
                    );
                }
            }
        }

        this.licznikSprzedazyLubKupowania++;

        this.soundToPlay = `buy${this.licznikSprzedazyLubKupowania}`;

        if (this.licznikSprzedazyLubKupowania === 3) {
            this.graczCoRobi = "Skonczyl";
            this.czyMozekupic = false;
        }

        this.logGracz(`kupił za ${cena}$`, this.getLogKolor(typ));

        if (
            this.licznikSprzedazyLubKupowania === 3 &&
            this.dalFilantropie &&
            this.graczCoRobi === "Skonczyl"
        ) {
            return this.dalej();
        }

        return this.wyslijObiektyGraczom();
    }

    // @event
    sprzedaj(data) {
        const typ = data.data;

        if (this.czyMozeSprzedac) {
            this.czyMozekupic = false;
        } else {
            return;
        }

        if (this.licznikSprzedazyLubKupowania === 3) {
            return (this.graczCoRobi = "Skonczyl");
        }

        this.graczCoRobi = "Sprzedaje";

        const aktualnyGracz = this.gracze[this.whosTurn];

        let cena = 0;
        for (const surowiec of this.plansza) {
            if (surowiec.type === typ) {
                cena = this.ceny[surowiec.current];
                this.bank[surowiec.type] += 1;
            }
        }

        aktualnyGracz.hajs += cena;

        this.usunKarteGracza(aktualnyGracz.karty, typ);

        this.licznikSprzedazyLubKupowania++;

        this.soundToPlay = `sell${this.licznikSprzedazyLubKupowania}`;

        if (this.licznikSprzedazyLubKupowania === 3) {
            this.graczCoRobi = "Skonczyl";
            this.czyMozeSprzedac = false;
        }

        this.logGracz(`sprzedał kartę za ${cena}$`, this.getLogKolor(typ));

        if (
            this.licznikSprzedazyLubKupowania === 3 &&
            this.dalFilantropie &&
            this.graczCoRobi === "Skonczyl"
        ) {
            return this.dalej();
        }

        return this.wyslijObiektyGraczom();
    }

    usunKarteGracza(karty, typ) {
        const index = karty.indexOf(typ);
        if (index !== -1) karty.splice(index, 1);
    }
}
