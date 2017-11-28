/* Basic settings for the game */
var scores =  [40, 100, 300, 1200];


/* Start keyboard event listener */
document.addEventListener("keydown", keyPush);

/* Function to create random? positive integers */
function rand(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

/* Function to handle keyboard events */
function keyPush(evt) {
    if([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
    }
    game.action(evt.keyCode);
}

var graphics = new Graphics();
var playfield = new Playfield();
var active = new Tetromino();
var state = 0;

var score = 0;
var lines = 0;
var level = 1;

this.a = 0;
this.speed = 60;

var game = new Game(scores, score, lines, level, a, speed);
