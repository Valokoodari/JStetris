/* Global canvas, context, and time */
var canv = document.getElementById("tetrisCanvas");
var ctx = canv.getContext("2d");
var sCanv = document.getElementById("scoreCanvas");
var scr = sCanv.getContext("2d");
//var d = new Date();

/* Start keyboard event listener */
document.addEventListener("keydown", keyPush);

/* Basic settings */
var bgColor = "#2D2D2D";    // Default #2D2D2D
var gridSize = 40;          // Default 40
var speed = 8;             // Default 8

/* Color palette for tetrominos */
var colors = [
    "#0064B3",  // I
    "#0072CC",  // O
    "#0081E6",  // T
    "#008FFF",  // S
    "#1A9AFF",  // Z
    "#33A5FF",  // J
    "#4DB1FF"   // L
];

/* List of scoring */
var scores = [40, 100, 300, 1200];

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
        scr.fillStyle = this.color;
        scr.fillRect(0, 0, canv.width, canv.height);
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
        var rows = this.scan();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] === 10) {
                for (var j = 0; j < this.grid.length; j++) {
                    this.grid[j][i] = "0";
                }
            }
        }
        var dest = -1;
        var cont = 0;
        rows = this.scan();
        for (var i = 0; i < this.grid[0].length; i++) {
            if (rows[i] > 0) {
                cont++;
            }
            if (rows[i] === 0 && cont > 0) {
                dest++;
                for (var j = i; j > 0; j--) {
                    for (var k = 0; k < this.grid.length; k++) {
                        this.grid[k][j] = this.grid[k][j - 1];
                        this.grid[k][j - 1] = "0";
                    }
                }
            }
        }
        if (dest >= 0) {
            score += scores[dest];
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

    canMove(piece, pos) {
        for (var i = 0; i < piece.length; i++) {
            if (piece[i].x + pos.x < 0 || piece[i].x + pos.x > canv.width / gridSize - 1) {
                return false;
            }
        }
        return true;
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
        if (playfield.canMoveDown(this.piece, this.pos)) {
            this.pos.y++;
        } else {
            for (var i = 0; i < this.piece.length; i++) {
                playfield.append(new Vec2(this.piece[i].x + this.pos.x, this.piece[i].y + this.pos.y), colors[this.type]);
            }
            this.reset();
        }
    }

    draw() {
        if (this.pos.y >= 0) {
            ctx.fillStyle = colors[this.type];
            for (var i = 0; i < this.piece.length; i++) {
                ctx.fillRect((this.pos.x + this.piece[i].x) * gridSize, (this.pos.y + this.piece[i].y) * gridSize, gridSize, gridSize);
            }
        }
    }

    right() {
        if (playfield.canMoveRight(this.piece, this.pos)) {
            this.pos.x++;
        }
    }

    left() {
        if (playfield.canMoveLeft(this.piece, this.pos)) {
            this.pos.x--;
        }
    }

    rotate() {
        // Don't rotate squares
        if (this.type === 1) {
            return;
        }

        // Array to store the possible new block
        var nPiece = [];
        
        for (var i = 0; i < this.piece.length; i++) {
            nPiece.push(new Vec2(this.piece[i].y * -1, this.piece[i].x));
        }

        if (playfield.canMove(nPiece, this.pos)) {
            this.piece = nPiece;
        }
    }

    drop() {
        while (playfield.canMoveDown(this.piece, this.pos)) {
            this.pos.y++;
        }
    }

    reset() {
        this.type = rand(0, 7);
        this.piece = blocks[this.type][0];
        this.pos = new Vec2(rand(blocks[this.type][1], blocks[this.type][2]), -2);
    }
}


/* The hearth of the game */
function mainLoop() {
    background.draw();
    scr.fillStyle = "#008FFF";
    scr.font = "30px Roboto";
    scr.fillText(score, 10, 30);
    if (a === 0) {
        active.update();
        playfield.update();
        a = speed;
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
            active.rotate()
            break;
        case 39:        // Right Arrow
            active.right();
            break;
        case 40:        // Down Arrow
            active.drop();
            break;
        case 82:        // R
            // restart
            break;
    }
}


/* Templates for all possible tetrominos */
var blocks = [
    [[new Vec2(-1, 0), new Vec2( 0, 0), new Vec2( 1, 0), new Vec2(2, 0)], 1, 7],    // I (Final)
    [[new Vec2(-1, 0), new Vec2( 0, 0), new Vec2(-1, 1), new Vec2(0, 1)], 1, 9],    // O
    [[new Vec2( 0, 0), new Vec2(-1, 1), new Vec2( 0, 1), new Vec2(1, 1)], 1, 9],    // T
    [[new Vec2( 0, 0), new Vec2( 1, 0), new Vec2(-1, 1), new Vec2(0, 1)], 1, 9],    // S
    [[new Vec2(-1, 0), new Vec2( 0, 0), new Vec2( 0, 1), new Vec2(1, 1)], 1, 9],    // Z
    [[new Vec2(-1, 0), new Vec2(-1, 1), new Vec2( 0, 1), new Vec2(1, 1)], 1, 9],    // J
    [[new Vec2( 1, 0), new Vec2(-1, 1), new Vec2( 0, 1), new Vec2(1, 1)], 1, 9]     // L
];


/* Finally starting the game */
var background = new Background(bgColor);
var playfield = new Playfield();
var active = new Tetromino();
var score = 0;
var a = 0; 
setInterval(mainLoop, 1000/60);
