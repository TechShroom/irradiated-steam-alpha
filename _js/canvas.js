export class Canvas {
    constructor(htmlCtx) {
        this.context = htmlCtx;
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    noStateLeak(painter) {
        this.context.save();
        try {
            painter(this.context);
        } finally {
            this.context.restore();
        }
    }

    stroke(painter) {
        this.context.beginPath();
        painter(this.context);
        this.context.stroke();
    }

    fill(painter) {
        this.context.beginPath();
        painter(this.context);
        this.context.fill();
    }

}
export class Drawable {
    draw(draw, zero, time) {
        draw.context.fillText("draw not overridden!!!!!!! " + this, 0, 0);
    }
}