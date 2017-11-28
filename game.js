class Game {
    constructor(scores, score, lines, level, a, speed) {
        this.scores = scores;

        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.a = a;
        this.speed = speed;

        this.newGame();
        this.start();
    }

    loop() {
        if (state === 0) {
            graphics.drawBackground();
            graphics.drawState(this.score, this.lines, this.level);
            if (this.a === 0) {
                active.update();
                this.a = this.speed;
            }
            this.a--;
            graphics.drawBlocks(active.getPiece(), active.getType());
            graphics.drawFuture(active.getFuturePieces(), active.getFuturePieceTypes());
            playfield.update();
        } else if (state === 1) {
            graphics.pause();
        } else {
            graphics.gameOver();
        }
    }

    newGame() {    
        playfield = new Playfield();
        active = new Tetromino();

        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.a = 0;
        this.speed = 60;
        state = 0;
    }

    gameOver() {
        state= 2;
    }

    togglePause() {
        if (state === 1) {
            state = 0;
        }
        if (state === 0) {
            state = 1;
        }
    }

    start() {
        setInterval(this.loop, 1000/120);
    }
    
    action(n) {
        if (state !== 1) {
            switch(n) {
                case 37:        // Left Arrow
                case 65:        // A
                    active.move(new Vec2(-1, 0));
                    break;
                case 38:        // Up Arrow
                case 87:        // W
                    active.rotate();
                    break;
                case 39:        // Right Arrow
                case 68:        // D
                    active.move(new Vec2(1, 0));
                    break;
                case 40:        // Down Arrow
                case 83:        // S
                    active.move(new Vec2(0, 1));
                    break;
                case 82:        // R
                    this.newGame();
                    break;
                case 27:        // ESC
                    state = 1;
                    break;
            }
        } else {
            switch(n) {
                case 27:        // ESC
                    state = 0;
                    break;
            }
        }
    }
}
