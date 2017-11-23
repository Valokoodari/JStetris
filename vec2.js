class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sum(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    copy() {
        return new Vec2(this.x, this.y);
    }
}