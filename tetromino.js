class Tetromino {
    constructor(pieces, colors) {
        this.colors = colors;
        this.pieces = pieces;

        this.futurePieces = [];

        for (var i = 0; i < show; i++) {
            this.futurePieces.push(rand(0, 7));
        }
        this.next();
    }

    /* Moves the piece down by one row and checks if the piece can still move */
    update() {
        if (!this.move(new Vec2(0, 1))) {
            for (var i = 0; i < this.piece.length; i++) {
                playfield.append(new Vec2(this.piece[i].x + this.pos.x, this.piece[i].y + this.pos.y), colors[this.type]);
            }
            this.next();
        }
    }

    getPiece() {
        var blocks = [];

        for (var i = 0; i < this.piece.length; i++) {
            blocks.push(new Vec2(this.pos.x + this.piece[i].x, this.pos.y + this.piece[i].y));
        }

        return blocks;
    }

    getType() {
        return this.type;
    }

    getFuturePieces() {
        return this.futurePieces;
    }

    getPieceTypes() {
        return this.pieces;
    }

    /* Moves the piece according to the provided 2D vector */
    move(vec) {
        var newPiece = [];
        
        for (var i = 0; i < this.piece.length; i++) {
            newPiece.push(new Vec2(this.piece[i].x + vec.x, this.piece[i].y + vec.y));
        }

        // Moves the piece if its new location is possible
        if (playfield.canMove(newPiece, this.pos)) {
            this.pos.sum(vec);
            return true;
        }
        return false;
    }

    /* Rotates the current falling piece */
    rotate() {
        if (this.type === 1) {
            return;
        }

        var newPiece = [];
        
        for (var i = 0; i < this.piece.length; i++) {
            newPiece.push(new Vec2((this.piece[i].y * -1), this.piece[i].x));
        }

        // Set the piece to the rotated state if it's possible
        if (playfield.canMove(newPiece, new Vec2(this.pos.x, this.pos.y))) {
            this.piece = newPiece;
        }
    }

    drop() {
        while (this.move(new Vec2(0, 1)) && !paused) {

        }
    }

    /* Creates the next piece and set the previous one as the current piece */
    next() {
        this.type = this.futurePieces.shift();
        this.piece = this.pieces[this.type][0];
        this.futurePieces.push(rand(0, 7));
        this.pos = new Vec2(rand(this.pieces[this.type][1], this.pieces[this.type][2]), -2);
    }
}
