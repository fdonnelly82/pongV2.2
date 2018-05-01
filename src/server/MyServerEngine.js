'use strict';

import ServerEngine from 'lance/ServerEngine';
import PlayerAvatar from '../common/PlayerAvatar';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame();

        this.players = {
            player1: null,
            player2: null,
            player3: null,
            player4: null
        };
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        // attach newly connected player an available paddle
        if (this.players.player1 === null) {
            this.players.player1 = socket.id;
            this.gameEngine.paddle1.playerId = socket.playerId;
        } else if (this.players.player2 === null) {
            this.players.player2 = socket.id;
            this.gameEngine.paddle2.playerId = socket.playerId;
        } else if(this.players.player3 === null){
            this.players.player3 = socket.id;
            this.gameEngine.paddle3.playerId = socket.playerId;
        } else if(this.players.player4 === null){
            this.players.player4 = socket.id;
            this.gameEngine.paddle4.playerId = socket.playerId;
        }
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        //disconects the player if they close the browser window
        if (this.players.player1 == socketId) {
            console.log('Player 1 disconnected');
            this.players.player1 = null;
        } else if (this.players.player2 == socketId) {
            console.log('Player 2 disconnected');
            this.players.player2 = null;
        } else if (this.players.player3 == socketId){
            console.log('Player 3 disconnected');
            this.players.player3 = null;
        } else if (this.players.player4 == socketId){
            console.log('Player 4 disconnected');
            this.players.player4 = null;
        }
    }
}
