/* Global canvas, context, and time */
var canv = document.getElementById("tetrisCanvas");
var ctx = canv.getContext("2d");
var sCanv = document.getElementById("sideCanvas");
var sdp = sCanv.getContext("2d");
//var d = new Date();

/* Start keyboard event listener */
document.addEventListener("keydown", keyPush);

/* Basic settings */
var bgColor = "#2D2D2D";    // Default #2D2D2D
var gridSize = 40;          // Default 40
var speed = 12;              // Default 12

/* Color palette for tetrominos */
var colors = [
    "#54C7FC",  // I
    "#FFCD00",  // O
    "#FF9600",  // T
    "#FF2851",  // S
    "#0076FF",  // Z
    "#44DB5E",  // J
    "#FF3824"   // L
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
        sdp.fillStyle = this.color;
        sdp.fillRect(0, 0, sCanv.width, sCanv.height);
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
        var dest = 0;
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
        if (dest > 0) {
            score += level * scores[dest - 1];
            lines += dest;
            if (lines > 8) {
                level++;
                lines -= 8;
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
                if (this.grid[i][j] !== "0") {
                    row[j]++;
                }
            }
        }

        return row;
    }

    draw() {
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] !== "0") {
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
            var xp = piece[i].x + pos.x;
            var yp = piece[i].y + pos.y;

            if (xp < 0 || xp >= 10) {
                return false;
            }
            if (yp >= 20) {
                return false;
            }
            if (yp >= 0) {
                if (this.grid[xp][yp] !== "0") {
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
        this.nextType = rand(0, 7);
        this.nextPiece = blocks[this.nextType][0];
        this.reset();
    }

    update() {
        if (!this.move(new Vec2(0, 1))) {
            for (var i = 0; i < this.piece.length; i++) {
                playfield.append(new Vec2(this.piece[i].x + this.pos.x, this.piece[i].y + this.pos.y), colors[this.type]);
            }
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = colors[this.type];
        for (var i = 0; i < this.piece.length; i++) {
            if (this.piece[i].y + this.pos.y >= 0) {
                ctx.fillRect((this.pos.x + this.piece[i].x) * gridSize, (this.pos.y + this.piece[i].y) * gridSize, gridSize, gridSize);
            }
        }
    }

    drawNext() {
        sdp.fillStyle = colors[this.nextType];
        for (var i = 0; i < this.nextPiece.length; i++) {
            sdp.fillRect((this.nextPiece[i].x + 2) * gridSize - 20, (this.nextPiece[i].y + 2) * gridSize + 20, gridSize, gridSize);
        }
    }

    move(vec) {
        var newPiece = [];
        
        for (var i = 0; i < this.piece.length; i++) {
            newPiece.push(new Vec2(this.piece[i].x + vec.x, this.piece[i].y + vec.y));
        }

        if (playfield.canMove(newPiece, this.pos)) {
            this.pos.x += vec.x;
            this.pos.y += vec.y;
            return true;
        }
        return false;
    }

    rotate() {
        if (this.type === 1) {
            return;
        }

        var newPiece = [];
        
        for (var i = 0; i < this.piece.length; i++) {
            newPiece.push(new Vec2((this.piece[i].y * -1), this.piece[i].x));
        }

        if (playfield.canMove(newPiece, new Vec2(this.pos.x, this.pos.y))) {
            this.piece = newPiece;
        }
    }

    drop() {
        while (this.move(new Vec2(0, 1))) {

        }
    }

    reset() {
        this.type = this.nextType;
        this.piece = this.nextPiece;
        this.nextType = rand(0, 7);
        this.nextPiece = blocks[this.nextType][0];
        this.pos = new Vec2(rand(blocks[this.type][1], blocks[this.type][2]), -2);
    }
}


/* The hearth of the game */
function mainLoop() {
    background.draw();
    sdp.fillStyle = "#008FFF";
    sdp.font = "30px Roboto";
    sdp.fillText(score, 10, 30);
    if (a === 0) {
        active.update();
        playfield.update();
        a = speed;
    }
    a--;
    active.draw();
    active.drawNext();
    playfield.draw();
}

function clear() {
    playfield = new Playfield();
    active = new Tetromino();

    score = 0;
    lines = 0;
    level = 1;
    a = 0;
}

/* Function to create random? positive integers */
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

/* Function to handle keyboard events */
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37:        // Left Arrow
        case 65:        // A
            active.move(new Vec2(-1, 0));
            break;
        case 38:        // Up Arrow
        case 87:        // W
            active.rotate()
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
            clear();
            break;
    }
}


/* Templates for all possible tetrominos */
var blocks = [
    [[new Vec2(-1,  0), new Vec2( 0,  0), new Vec2( 1, 0), new Vec2(2, 0)], 1, 7],  // I
    [[new Vec2(-1, -1), new Vec2( 0, -1), new Vec2(-1, 0), new Vec2(0, 0)], 1, 9],  // O
    [[new Vec2( 0, -1), new Vec2(-1,  0), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9],  // T
    [[new Vec2( 0, -1), new Vec2( 1, -1), new Vec2(-1, 0), new Vec2(0, 0)], 1, 9],  // S
    [[new Vec2(-1, -1), new Vec2( 0, -1), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9],  // Z
    [[new Vec2(-1, -1), new Vec2(-1,  0), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9],  // J
    [[new Vec2( 1, -1), new Vec2(-1,  0), new Vec2( 0, 0), new Vec2(1, 0)], 1, 9]   // L
];


/* Finally starting the game */
var background = new Background(bgColor);
var playfield = new Playfield();
var active = new Tetromino();

var width = canv.width / gridSize;
var height = canv.height / gridSize;

var score = 0;
var lines = 0;
var level = 1;
var a = 0;
setInterval(mainLoop, 1000/60);
