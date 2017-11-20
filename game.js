/* Global canvas, context, and time */
var canv = document.getElementById("tetrisCanvas");
var ctx = canv.getContext("2d");
//var d = new Date();

/* Start keyboard event listener */
document.addEventListener("keydown", keyPush);

/* Basic Settings */
var bgColor = "#2D2D2D";    // Default #2D2D2D
var gridSize = 40;          // Default 40
var speed = 12;             // Default 12


/* Simple 2D vector class (for now) */
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/* Background class to maybe implement backgroung images */
class Background {
    constructor(color) {
        this.color = color;
    }

    update() {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canv.width, canv.height);
    }
}

/* Class for the falling block */
class Tetromino {
    constructor() {
        this.type = rand(7);
        this.pos = new Vec2(rand(canv.width / gridSize), -2);
    }

    update() {
        if (this.pos.y + 1 < canv.height / gridSize) {
            this.pos.y++;
            this.draw();
        }
    }

    draw() {
        if (this.pos.y >= 0) {
            ctx.fillStyle = "#008FFF";
            ctx.fillRect(this.pos.x * gridSize, this.pos.y * gridSize, gridSize, gridSize);
        }
    }
}


/* The hearth of the game */
function gameLoop() {
    background.update();

    active.update();
}

/* Function to create random? positive integers */
function rand(max) {
    return Math.floor(Math.random() * max);
}

/* Function to handle keyboard events */
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37:        // Left Arrow
            // left
            break;
        case 38:        // Up Arrow
            // rotate 
            break;
        case 39:        // Right Arrow
            // right
            break;
        case 40:        // Down Arrow
            // drop
            break;
        case 82:        // R
            // restart
            break;
    }
}


/* Finally starting the game */
var background = new Background(bgColor);
var active = new Tetromino();
setInterval(gameLoop, 1000/speed);
