class Graphics {
    constructor() {
        // Initialize the main canvas
        this.canv = document.getElementById("tetrisCanvas");
        this.ctx = this.canv.getContext("2d");
        // Initialize the secondary canvas
        this.sCanv = document.getElementById("sideCanvas");
        this.sdp = this.sCanv.getContext("2d");

        this.gridSize = 40;
        this.bgColor = "#2D2D2D";
        this.grColor = "#262626";
        // Color palette for tetrominos
        this.colors = [
            "#54C7FC",  // I
            "#FFCD00",  // O
            "#FF9600",  // T
            "#FF2851",  // S
            "#0076FF",  // Z
            "#44DB5E",  // J
            "#FF3824"   // L
        ];
    }

    drawBackground() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
        this.ctx.fillStyle = this.grColor;
        for (var i = 0; i < 10; i++) {
            this.ctx.fillRect(i * this.gridSize, 0, 1, this.canv.height);
        }
        for (var i = 0; i < 20; i++) {
            this.ctx.fillRect(0, i * this.gridSize, this.canv.width, 1);
        }
        this.sdp.fillStyle = this.bgColor;
        this.sdp.fillRect(0, 0, this.sCanv.width, this.sCanv.height);
    }

    drawState(score, lines, level) {
        this.sdp.fillStyle = "#008FFF";
        this.sdp.font = "30px Roboto";
        this.sdp.fillText("Score: " + score, 10, 30);
        this.sdp.fillText("Lines: " + lines, 10, 70);
        this.sdp.fillText("Level: " + level, 10, 110);
    }

    drawBlock(pos, color) {
        this.ctx.fillStyle = this.colors[color];
        if (pos.x >= 0 && pos.x <= 10 && pos.y >= 0 && pos.y <= 20) {
            this.ctx.fillRect(pos.x * this.gridSize, pos.y * this.gridSize, this.gridSize, this.gridSize);
        }
    }

    drawBlocks(blocks, color) {
        for (var i = 0; i < blocks.length; i++) {
            this.drawBlock(blocks[i], color);
        }
    }

    drawFuture(future, colors) {
        for (var i = 0; i < future.length; i++) {
            this.sdp.fillStyle = this.colors[colors[i]];
            var piece = future[i][0];
            
            for (var j = 0; j < piece.length; j++) {
                this.sdp.fillRect((piece[j].x + 2) * this.gridSize - 20, (piece[j].y + 4) * this.gridSize + 20 + 3 * i * this.gridSize, this.gridSize, this.gridSize);
            }
        }
    }

    pause() {
        this.ctx.fillStyle = "#008FFF";
        this.ctx.font = "30px Roboto";
        this.ctx.fillText("Paused.", 10, 30);
    }

    gameOver() {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(70, 335, 260, 150);
        this.ctx.fillStyle = "#FF0000";
        this.ctx.font = "50px Roboto";
        this.ctx.fillText("Game Over", 90, 400);
        this.ctx.font = "30px Roboto";
        this.ctx.fillText("Press R to Restart", 92, 450);
    }
}
