class Playfield {
    constructor() {
        this.grid = new Array(10);
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(20);
            for (var j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j] = -1;
            }
        }
    }

    /* Destroys all full rows and moves floating rows down */
    update() {
        var rows = this.scan();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] === 10) {
                for (var j = 0; j < this.grid.length; j++) {
                    this.grid[j][i] = -1;
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
                        this.grid[k][j - 1] = -1;
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
                if (this.grid[i][j] !== -1) {
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
                if (this.grid[i][j] !== -1) {
                    graphics.drawBlock(new Vec2(i, j), this.grid[i][j]);
                }
            }
        }
    }

    /* Adds the block to the grid with it's color */
    append(block, color) {
        if (block.y < 0) {
            game.gameOver();
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
                if (this.grid[xp][yp] !== -1) {
                    return false;
                }
            }
        }
        return true;
    }
}
