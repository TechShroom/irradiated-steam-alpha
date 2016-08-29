import {Drawable} from "../canvas";
import {images} from "../images";
export class Entity extends Drawable {
    constructor(x = 0, y = 0, width = 1, height = 1) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.renderOrder = 0;
        this.attachedGame = undefined;
    }

    boundsContains(x, y) {
        const xPass = (this.realX <= x && x <= (this.realX + this.realWidth));
        const yPass = (this.realY <= y && y <= (this.realY + this.realHeight));
        return xPass && yPass;
    }

    set width(w) {
        if (w < 0) {
            throw new RangeError("width must be >=0");
        }
        this.__width = w;
    }

    get width() {
        return this.__width;
    }

    get realWidth() {
        return this.width * 16;
    }

    set height(h) {
        if (h < 0) {
            throw new RangeError("height must be >=0");
        }
        this.__height = h;
    }

    get height() {
        return this.__height;
    }

    get realHeight() {
        return this.height * 16;
    }

    set x(x) {
        if (x < 0) {
            throw new RangeError("x must be >=0");
        }
        this.__x = x;
    }

    get x() {
        return this.__x;
    }

    get realX() {
        return this.x * 16;
    }

    set y(y) {
        if (y < 0) {
            throw new RangeError("y must be >=0");
        }
        this.__y = y;
    }

    get y() {
        return this.__y;
    }

    get realY() {
        return this.y * 16;
    }

    draw(draw, zero, time) {
        draw.context.fillRect(this.realX, this.realY, this.realWidth, this.realHeight);
    }

    // Events
    onClick(event) {
    }
    onKeyboard(event) {
        return false;
    }
}

export class ImageEntity extends Entity {
    constructor(x, y, w, h, image) {
        super(x, y, w, h);
        this.image = images[image];
        if (!this.image) {
            throw new Error("No image for " + image);
        }
    }


    draw(draw, zero, time) {
        draw.context.drawImage(this.image, this.realX, this.realY, this.realWidth, this.realHeight);
    }
}