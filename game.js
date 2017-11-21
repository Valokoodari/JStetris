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

/* Background class to maybe implement backgroung images */
class Background {
    constructor(color) {
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canv.width, canv.height);
    }
}

class Playfield {
    constructor() {
        this.grid = new Array(10);
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(20);
            for (var j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j] = "0";
            }
        }
    }

    update() {
        var row = this.scan();
        for (var i = 0; i < row.length; i++) {
            if (row[i] === 10) {
                for (var j = 0; j < this.grid.length; j++) {
                    this.grid[j][i] = "0";
                }
            }
        }
        row = this.scan();
        for (var i = this.grid[0].length; i > 0; i--) {
            if (row[i] === 0) {
                for (var j = 0; j < this.grid.length; j++) {
                    this.grid[j][i] = this.grid[j][i - 1];
                    this.grid[j][i - 1] = "0";
                }
            }
        }
    }

    scan() {
        var row = new Array(this.grid[0].length);
        for (var i = 0; i < row.length; i++) {
            row[i] = 0;
        }
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j].charAt(0) === "#") {
                    row[j]++;
                }
            }
        }

        return row;
    }

    draw() {
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j].charAt(0) === "#") {
                    ctx.fillStyle = this.grid[i][j];
                    ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
                }
            }
        }
    }

    append(block, color) {
        this.grid[block.x][block.y] = color;
    }

    canMoveDown(piece, pos) {
        for (var i = 0; i < piece.length; i++) {
            if (piece[i].y + pos.y > canv.height / gridSize - 2) {
                return false;
            }
            if (piece[i].x + pos.x >= 0 && piece[i].y + pos.y >= -1) {
                if (this.grid[piece[i].x + pos.x][piece[i].y + pos.y + 1].charAt(0) === "#") {
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
            if (this.grid[piece[i].x + pos.x + 1][piece[i].y + pos.y].charAt(0) === "#") {
                return false;
            }
        }
        return true;
    }

    canMoveLeft(piece, pos) {
        for (var i = 0; i < piece.length; i++) {
            if (piece[i].x + pos.x <= 0) {
                return false;
            }
            if (this.grid[piece[i].x + pos.x - 1][piece[i].y + pos.y].charAt(0) === "#") {
                return false;
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
        } else {
            for (var i = 0; i < this.block.length; i++) {
                playfield.append(new Vec2(this.block[i].x + this.pos.x, this.block[i].y + this.pos.y), colors[this.type]);
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
        }
    }

    left() {
        if (playfield.canMoveLeft(this.block, this.pos)) {
            this.pos.x--;
        }
    }

    reset() {
        this.type = rand(0, 7);
        this.block = blocks[this.type][0];
        this.pos = new Vec2(rand(blocks[this.type][1], blocks[this.type][2]), 0);
    }
}


/* The hearth of the game */
function gameLoop() {
    background.draw();
    ctx.fillStyle = "#008FFF";
    ctx.fillText(a, 10, 10);
    if (a === 0) {
        active.update();
        playfield.update();
        a = 8;
    }
    a--;
    active.draw();
    playfield.draw();
}

/* Function to create random? positive integers */
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
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
    [[new Vec2(-1, -1), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 1, 7],  // I
    [[new Vec2(0, -2), new Vec2(1, -2), new Vec2(0, -1), new Vec2(1, -1)], 0, 8],   // O
    [[new Vec2(1, -2), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 0, 8],   // T
    [[new Vec2(1, -2), new Vec2(2, -2), new Vec2(0, -1), new Vec2(1, -1)], 0, 8],   // S
    [[new Vec2(0, -2), new Vec2(1, -2), new Vec2(1, -1), new Vec2(2, -1)], 0, 8],   // Z
    [[new Vec2(0, -2), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 0, 8],   // J
    [[new Vec2(2, -2), new Vec2(0, -1), new Vec2(1, -1), new Vec2(2, -1)], 0, 8]    // L
];


/* Finally starting the game */
var background = new Background(bgColor);
var playfield = new Playfield();
var active = new Tetromino();
var a = 0; 
setInterval(gameLoop, 1000/60);
