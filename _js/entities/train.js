import {ImageEntity} from "./entity";
import {images} from "../images";
const trainImage = images["train"];
export class Train extends ImageEntity {
    constructor(x, y, color = "black") {
        super(x, y, 1, 1, "train");
        this.color = color;
        this.renderOrder = 1;
        this.rotation = 0;
    }

    set rotation(rot) {
        this.__rotation = rot;
        this.image = trainImage.chooseImage((rot + 90) % 360);
    }

    get rotation() {
        return this.__rotation;
    }

    doRailCheck(offX, offY, newRotation) {
        const rail = this.attachedGame.getEntitiesAt(this.x + offX, this.y + offY);
        if (rail.length > 0) {
            this.x += offX;
            this.y += offY;
            this.rotation = newRotation;
            return true;
        }
    }

    moveForward() {
        // Look for a rail forward, or 90 left/right
        if (this.rotation === 0) {
            if (this.doRailCheck(1, 0, 0)) {
                return true;
            }
            if (this.doRailCheck(0, 1, 90)) {
                return true;
            }
            return !!this.doRailCheck(0, -1, 270);
        }
        if (this.rotation === 90) {
            if (this.doRailCheck(0, 1, 90)) {
                return true;
            }
            if (this.doRailCheck(1, 0, 0)) {
                return true;
            }
            return !!this.doRailCheck(-1, 0, 180);
        }
        if (this.rotation === 180) {
            if (this.doRailCheck(-1, 0, 180)) {
                return true;
            }
            if (this.doRailCheck(0, 1, 90)) {
                return true;
            }
            return !!this.doRailCheck(0, -1, 270);
        }
        if (this.rotation === 270) {
            if (this.doRailCheck(0, -1, 270)) {
                return true;
            }
            if (this.doRailCheck(1, 0, 0)) {
                return true;
            }
            return !!this.doRailCheck(-1, 0, 180);
        }
    }

    moveBackward() {
        // Look for a rail backward, or 90 left/right
        if (this.rotation === 0) {
            if (this.doRailCheck(-1, 0, 0)) {
                return true;
            }
            if (this.doRailCheck(0, 1, 270)) {
                return true;
            }
            return !!this.doRailCheck(0, -1, 90);
        }
        if (this.rotation === 90) {
            if (this.doRailCheck(0, -1, 90)) {
                return true;
            }
            if (this.doRailCheck(1, 0, 180)) {
                return true;
            }
            return !!this.doRailCheck(-1, 0, 0);
        }
        if (this.rotation === 180) {
            if (this.doRailCheck(1, 0, 180)) {
                return true;
            }
            if (this.doRailCheck(0, 1, 270)) {
                return true;
            }
            return !!this.doRailCheck(0, -1, 90);
        }
        if (this.rotation === 270) {
            if (this.doRailCheck(0, 1, 270)) {
                return true;
            }
            if (this.doRailCheck(1, 0, 180)) {
                return true;
            }
            return !!this.doRailCheck(-1, 0, 0);
        }
    }

    onKeyboard(e) {
        console.log(e.which);
        if (e.which == 87) {
            // 'w' key
            this.moveForward();
            return true;
        } else if (e.which == 83) {
            // 's' key
            this.moveBackward();
            return true;
        }
    }

}