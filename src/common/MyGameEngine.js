'use strict';

import TwoVector from 'lance/serialize/TwoVector';
import Paddle from './Paddle';
import Ball from './Ball';
const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import PlayerAvatar from './PlayerAvatar';

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
    }

    registerClasses(serializer) {
        serializer.registerClass(Paddle);
        serializer.registerClass(Ball);
    }

    start() {

        super.start();

        //assigns newly joined players to player number
        this.on('postStep', () => { this.postStepHandleBall(); });
        this.on('objectAdded', (object) => {
            if (object.class === Ball) {
                this.ball = object;
            } else if (object.playerId === 1) {
                this.paddle1 = object;
            } else if (object.playerId === 2) {
                this.paddle2 = object;
            } else if (object.playerId === 3) {
                this.paddle3 = object;
            } else if (object.playerId === 4) {
                this.paddle4 = object;
            }
        });
    }

    initGame() {

        // create the paddle objects
        this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(PADDING, 0), playerId: 1 }));
        this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(WIDTH - PADDING, 0), playerId: 2 }));
        this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(PADDING, 0), playerId: 3 }));
        this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(WIDTH - PADDING, 0), playerId: 4 }));
        this.addObjectToWorld(new Ball(this, null, { position: new TwoVector(WIDTH /2, HEIGHT / 2) }));
    }

    postStepHandleBall() {
        if (!this.ball)
            return;

        // CHECK LEFT EDGE:
        if (this.ball.position.x <= PADDING + PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle1.y && this.paddle3.y && this.ball.position.y <= this.paddle1.position.y && this.paddle3.position.y + PADDLE_HEIGHT &&
            this.ball.velocity.x < 0) {

            // ball moving left hit team 1 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = PADDING + PADDLE_WIDTH + 1;
        } else if (this.ball.position.x <= 0) {

            // ball hit left wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = 0;
            console.log(`team 2 scored`);
        }

        // CHECK RIGHT EDGE:
        if (this.ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle2.position.y && this.paddle4.position.y && this.ball.position.y <= this.paddle2.position.y && this.paddle4.position.y + PADDLE_HEIGHT &&
            this.ball.velocity.x > 0) {

            // ball moving right hits team 2 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
        } else if (this.ball.position.x >= WIDTH ) {

            // ball hit right wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH - 1;
            console.log(`team 1 scored`);
        }

        // ball hits top
        if (this.ball.position.y <= 0) {
            this.ball.position.y = 1;
            this.ball.velocity.y *= -1;
        } else if (this.ball.position.y >= HEIGHT) {
            // ball hits bottom
            this.ball.position.y = HEIGHT - 1;
            this.ball.velocity.y *= -1;
        }

    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player paddle tied to the player socket
        let playerPaddle = this.world.queryObject({ playerId });
        if (playerPaddle) {
            if (inputData.input === 'up') {
                playerPaddle.position.y -= 5;
            } else if (inputData.input === 'down') {
                playerPaddle.position.y += 5;
            }
        }
    }
}
