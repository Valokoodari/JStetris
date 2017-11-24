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
var maxLevel = 10;          // Default 10
var speed = 60;             // Default 60
var divisor = 1.2;          // Default 1.2
var show = 3;               // Default 3 : Max 6

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

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canv.width, canv.height);
        sdp.fillStyle = this.color;
        sdp.fillRect(0, 0, sCanv.width, sCanv.height);
    }
}

/* Class for storing frozen blocks and checking if movements are possible */
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

    /* Destroys all full rows and moves floating rows down */
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
            if (lines - level * 8 >= 0 && level < maxLevel) {
                level++;
                speed = Math.floor(speed / divisor);
            }
        }
        this.draw();
    }

    /* Function that return the amount of blocks on each row */
    scan() {
        var rows = new Array(this.grid[0].length);
        for (var i = 0; i < rows.length; i++) {
            rows[i] = 0;
        }
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] !== "0") {
                    rows[j]++;
                }
            }
        }

        return rows;
    }

    /* Draws all of the blocks in the playfield */
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

    /* Adds the block to the grid with it's color */
    append(block, color) {
        if (block.y < 0) {
            dead = true;
            return;
        }
        this.grid[block.x][block.y] = color;
    }

    /* Check if the piece can move to it's new position */
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

/* The hearth of the game */
function mainLoop() {
    if (!paused && !dead) {
        background.draw();
        sdp.fillStyle = "#008FFF";
        sdp.font = "30px Roboto";
        sdp.fillText(score, 10, 30);
        if (a === 0) {
            active.update();
            a = speed;
        }
        a--;
        drawBlocks(active.getPiece(), active.getType());
        drawFuture(active.getFuturePieces());
        playfield.update();
    } else if (!dead) { // Prints "Paused" to the top left corner if the game is paused
        ctx.fillStyle = "#008FFF";
        ctx.font = "30px Roboto";
        ctx.fillText("Paused.", 10, 30);
    } else {            // Prints "Game Over" if the game has been lost
        paused = false;
        ctx.fillStyle = "#000000";
        ctx.fillRect(70, 335, 260, 150);
        ctx.fillStyle = "#FF0000";
        ctx.font = "50px Roboto";
        ctx.fillText("Game Over", 90, 400);
        ctx.font = "30px Roboto";
        ctx.fillText("Press R to Restart", 92, 450);
    }
}

function drawBlocks(blocks, color) {
    ctx.fillStyle = colors[color];
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].x >= 0 && blocks[i].x <= 10 && blocks[i].y >= 0 && blocks[i].y <= 20) {
            ctx.fillRect(blocks[i].x * gridSize, blocks[i].y * gridSize, gridSize, gridSize);
        }
    }
}

function drawFuture(future) {
    for (var i = 0; i < future.length; i++) {
        var piece = pieces[future[i]][0];

        sdp.fillStyle = colors[future[i]];

        for (var j = 0; j < piece.length; j++) {
            sdp.fillRect((piece[j].x + 2) * gridSize - 20, (piece[j].y + 2) * gridSize + 20 + 3 * i * gridSize , gridSize, gridSize);
        }
    }
}

/* Restart the game by resetting everything */
function reset() {
    playfield = new Playfield();
    active = new Tetromino(pieces, colors);

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

/* Function to handle keyboard events */
function keyPush(evt) {
    if([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
    }
    if (!paused) {
        switch(evt.keyCode) {
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
        switch(evt.keyCode) {
            case 27:        // ESC
                paused = false;
                break;
        }
    }   
}

/* Finally starting the game */
var background = new Background(bgColor);
var playfield = new Playfield();
var active = new Tetromino(pieces, colors);

var score = 0;
var lines = 0;
var level = 1;
var a = 0;
var paused = false;
var dead = false;
setInterval(mainLoop, 1000/120);
