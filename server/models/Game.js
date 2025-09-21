import Player from "./Player";

export default class Game {
    constructor(players, endGame) {
        this.endGame = endGame;
        this.players = new Map();
        this.playersQueue = [];
        this.currentPlayerIndex = 0;
        this.data = {};
        this.createPlayers(players);
        this.createTurnOrder();
        this.initializeGameData();
    }

    initializeGameData(){
        this.data.addedWood = 0;   
    }

    createTurnOrder(){
        for (let i = this.playersQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); 
            [this.playersQueue[i], this.playersQueue[j]] = [this.playersQueue[j], this.playersQueue[i]]; 
        }
    }

    createPlayers(players){
        for(const player of players){
            this.players.set(player.publicId, new Player(player.username, player.color, player.publicId));
            this.playersQueue.push(player.publicId);
        }
    }

    nextTurn(){
        this.currentPlayerIndex++;
        if(this.currentPlayerIndex === this.playersQueue.length){
            this.currentPlayerIndex = 0;
        }
    }

    processGameData(data){
        try {
            return this[data.eventName](data);
        } catch {
            return [{
                target: data.publicId,
                eventName: "error",
                error: "Nieprawidłowa akcja"
            }]     
        }
    }

    dataWithTarget(){
        return [	
            {
                target: "lobby",
                eventName: "gameData",
                data: this.data
            }
        ]
    }

    addWood(data){
        const player = this.players.get(data.publicId);
        player.setData("wood", (oldWood) => oldWood + 5);
        this.data.addedWood++;
        return [this.dataWithTarget()];
    }
    
    sayHello(data){
        return [	
            {
                target: data.publicId,
                eventName: "gameData",
                data: "Hello"
            }
        ]
    }
}