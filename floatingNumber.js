export class FloatingNumber {
    constructor(x, y, number, type, context) {
        this.x = x;
        this.y = y;
        this.number = number;
        this.type = type;
        this.context = context;

        this.alpha = 1;
        this.dy = -1;
        this.life = 60;
    }

    update() {
        this.y += this.dy;
        this.alpha -= 1 / this.life;
        if (this.alpha < 0) this.alpha = 0;
    }

    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.font = 'bold 20px Arial';
        this.context.textAlign = 'center';
        if (this.type === 'heal') {
            this.context.fillStyle = 'green';
            this.context.fillText(`+${this.number}`, this.x, this.y);
        } else if (this.type === 'damage') {
            this.context.fillStyle = 'red';
            this.context.fillText(`-${this.number}`, this.x, this.y);
        }
        this.context.restore();
    }
}
