/* Start keyboard event listener */
document.addEventListener("keydown", keyPush);

/* Basic settings */
var maxLevel = 10;          // Default 10
var speed = 60;             // Default 60
var divisor = 1.2;          // Default 1.2
var show = 3;               // Default 3 : Max 6

/* List of scoring */
var scores = [40, 100, 300, 1200];

var pieces = [
    [[new Vec2(-1,  0), new Vec2( 0,  0), new Vec2( 1, 0), new Vec2(2, 0)], 1, 7],  // I
    [[new Vec2(-1, -1), new Vec2( 0, -1), new Vec2(-1, 0), new Vec2(0, 0)], 1, 9],  // O
    [[new Vec2( 0, -1), new Vec2(-1,  0), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9],  // T
    [[new Vec2( 0, -1), new Vec2( 1, -1), new Vec2(-1, 0), new Vec2(0, 0)], 1, 9],  // S
    [[new Vec2(-1, -1), new Vec2( 0, -1), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9],  // Z
    [[new Vec2(-1, -1), new Vec2(-1,  0), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9],  // J
    [[new Vec2( 1, -1), new Vec2(-1,  0), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9]   // L
];

/* Background class to maybe implement backgroung images someday */
class Background {
    constructor(color) {
        this.color = color;
    }

    
}

/* The hearth of the game */
function mainLoop() {
    if (!paused && !dead) {
        graphics.drawBackground();
        graphics.drawState();
        if (a === 0) {
            active.update();
            a = speed;
        }
        a--;
        graphics.drawBlocks(active.getPiece(), active.getType());
        graphics.drawFuture(active.getFuturePieces());
        playfield.update();
    } else if (!dead) {
        graphics.pause();
    } else {
        paused = false;
        graphics.gameOver();
    }
}

/* Restart the game by resetting everything */
function reset() {
    playfield = new Playfield();
    active = new Tetromino(pieces);

    score = 0;
    lines = 0;
    level = 1;
    speed = 60;
    dead = false;
    a = 0;
}

/* Temporary function to toggle pause on mobile devices */
function togglePause() {
    if (paused) {
        paused = false;
    } else {
        paused = true;
    }
}

/* Function to create random? positive integers */
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function action(n) {
    if (!paused) {
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
                active.drop();
                break;
            case 82:        // R
                reset();
                break;
            case 27:        // ESC
                paused = true;
                break;
        }
    } else {
        switch(n) {
            case 27:        // ESC
                paused = false;
                break;
        }
    }
}

/* Function to handle keyboard events */
function keyPush(evt) {
    if([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
    }
    action(evt.keyCode);
}

/* Finally starting the game */
var graphics = new Graphics();
var playfield = new Playfield();
var active = new Tetromino(pieces);

var score = 0;
var lines = 0;
var level = 1;
var a = 0;
var paused = false;
var dead = false;
setInterval(mainLoop, 1000/120);
