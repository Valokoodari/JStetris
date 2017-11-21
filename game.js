/* Global canvas, context, and time */
var canv = document.getElementById("tetrisCanvas");
var ctx = canv.getContext("2d");
//var d = new Date();

/* Start keyboard event listener */
document.addEventListener("keydown", keyPush);

/* Basic settings */
var bgColor = "#2D2D2D";    // Default #2D2D2D
var gridSize = 40;          // Default 40
//var speed = 12;             // Default 12

/* Color palette for tetrominos */
var colors = [
    "#008FFF",  // I
    "#8FFF00",  // O
    "#FF008F",  // T
    "#008FFF",  // S
    "#8FFF00",  // Z
    "#FF008F",  // J
    "#008FFF"   // L
];


/* Simple 2D vector class (for now) */
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/* Class to store blocks with their colors */
class Block {
    constructor(pos, color) {
        this.x = pos.x;
        this.y = pos.y;
        this.color = color;
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

class Playfield {
    constructor() {
        this.grid = [];
    }

    update() {
        this.draw();
    }

    draw() {
        for (var i = 0; i < this.grid.length; i++) {
            ctx.fillStyle = colors[this.grid[i].color];
            ctx.fillRect(this.grid[i].x * gridSize, this.grid[i].y * gridSize, gridSize, gridSize);
        }
    }

    append(block, color) {
        this.grid.push(new Block(block, color));
    }

    canMoveDown(piece, pos) {
        for (var i = 0; i < piece.length; i++) {
            if (piece[i].y + pos.y > canv.height / gridSize - 2) {
                return false;
            }
            for (var j = 0; j < this.grid.length; j++) {
                if (piece[i].x + pos.x === this.grid[j].x && piece[i].y + pos.y + 1 === this.grid[j].y) {
                    return false;
                }
            }
        }
        return true;
    }

    canMoveRight(piece, pos) {
        for (var i = 0; i < piece.length; i++) {
            if (piece[i].x + pos.x >= canv.width / gridSize - 1) {
                return false;
            }
            for (var j = 0; j < this.grid.length; j++) {
                if (piece[i].x + pos.x + 1 === this.grid[j].x && piece[i].y + pos.y === this.grid[j].y) {
                    return false;
                }
            }
        }
        return true;
    }

    canMoveLeft(piece, pos) {
        for (var i = 0; i < piece.length; i++) {
            if (piece[i].x + pos.x <= 0) {
                return false;
            }
            for (var j = 0; j < this.grid.length; j++) {
                if (piece[i].x + pos.x - 1 === this.grid[j].x && piece[i].y + pos.y === this.grid[j].y) {
                    return false;
                }
            }
        }
        return true;
    }
}

/* Class for the falling block */
class Tetromino {
    constructor() {
        this.reset();
    }

    update() {
        if (playfield.canMoveDown(this.block, this.pos)) {
            this.pos.y++;
            this.draw();
        } else {
            for (var i = 0; i < this.block.length; i++) {
                playfield.append(new Vec2(this.block[i].x + this.pos.x, this.block[i].y + this.pos.y), this.type);
            }
            this.reset();
        }
    }

    draw() {
        if (this.pos.y >= 0) {
            ctx.fillStyle = colors[this.type];
            for (var i = 0; i < this.block.length; i++) {
                ctx.fillRect((this.pos.x + this.block[i].x) * gridSize, (this.pos.y + this.block[i].y) * gridSize, gridSize, gridSize);
            }
        }
    }

    right() {
        if (playfield.canMoveRight(this.block, this.pos)) {
            this.pos.x++;
            background.draw();
            playfield.draw();
            this.draw();
        }
    }

    left() {
        if (playfield.canMoveLeft(this.block, this.pos)) {
            this.pos.x--;
            background.draw();
            playfield.draw();
            this.draw();
        }
    }

    reset() {
        this.type = rand(7);
        this.block = blocks[this.type][0];
        this.pos = new Vec2(rand(11 - blocks[this.type][1]), 0);
    }
}


/* The hearth of the game */
function gameLoop() {
    background.update();
    
    if (a === 0) {
        active.update();
        a = 5;
    } else {
        active.draw();
        a--;
    }
    
    playfield.update();
}

/* Function to create random? positive integers */
function rand(max) {
    return Math.floor(Math.random() * max);
}

/* Function to handle keyboard events */
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37:        // Left Arrow
            active.left();
            break;
        case 38:        // Up Arrow
            // rotate 
            break;
        case 39:        // Right Arrow
            active.right();
            break;
        case 40:        // Down Arrow
            // drop
            break;
        case 82:        // R
            // restart
            break;
    }
}


/* Templates for all possible tetrominos */
var blocks = [
    [[new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1), new Vec2(3, -1)], 4],  // I
    [[new Vec2(0, -2), new Vec2(1, -2), new Vec2(0, -1), new Vec2(1, -1)], 3],  // O
    [[new Vec2(1, -2), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 3],  // T
    [[new Vec2(1, -2), new Vec2(2, -2), new Vec2(0, -1), new Vec2(1, -1)], 3],  // S
    [[new Vec2(0, -2), new Vec2(1, -2), new Vec2(1, -1), new Vec2(2, -1)], 3],  // Z
    [[new Vec2(0, -2), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 3],  // J
    [[new Vec2(2, -2), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 3]   // L
];


/* Finally starting the game */
var background = new Background(bgColor);
var playfield = new Playfield();
var active = new Tetromino();
var a = 5; 
setInterval(gameLoop, 1000/60);
