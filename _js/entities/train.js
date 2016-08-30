import {ImageEntity} from "./entity";
import {RailPart} from "./station";
import {images, createCanvas, createRotatedCanvases} from "../images";
import {normalizeDegree} from "../util/rotation";

function createTrain(player, color) {
    const canvas = createCanvas(16, 16);
    const ctx = canvas.getContext("2d");
    if (player) {
        ctx.drawImage(images["train"], 0, 0, 16, 16);
        // LEGACY TRIANGLE
        // ctx.translate(8, 8);
        // ctx.rotate(get90DegreeAngle(180).radians);
        // ctx.translate(-8, -8);
        // ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(7, 15);
        // ctx.lineTo(8, 15);
        // ctx.lineTo(15, 0);
        // ctx.closePath();
        // ctx.fillStyle = color;
        // ctx.fill();
    } else {
        ctx.fillStyle = "gray";
        ctx.fillRect(1, 1, 15, 15);
        ctx.fillStyle = color;
        ctx.fillRect(4, 4, 8, 8);
    }
    return canvas;
}

const DELAY = 1000;
export class Train extends ImageEntity {
    constructor(x, y, color = "black", player = true, station = null) {
        super(x, y, 1, 1, "train");
        this.color = color;
        this.images = createRotatedCanvases(createTrain(player, color));
        this.renderOrder = 1;
        this.rotation = 0;
        this.cargo = [];
        this.station = station;
        this.player = player;
    }

    set rotation(rot) {
        rot = normalizeDegree(rot);
        this.__rotation = rot;
        this.image = this.images.chooseImage(rot);
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

    pushCargo(cargo, source) {
        const cargoWagon = new Train(this.x, this.y, cargo, false, source);
        cargoWagon.rotation = this.rotation;
        this.attachedGame.addEntity(cargoWagon);
        const moves = this.cargo.push(cargoWagon);
        for (let i = 0; i < moves; i++) {
            cargoWagon.moveBackward();
        }
    }

    pushToStation() {
        if (this.cargo.length === 0) {
            return false;
        }
        for (let i = this.cargo.length - 1; i >= 0; i--) {
            const cargo = this.cargo[i];
            if (this.station !== cargo.station && this.station.tryPushCargo(cargo.color)) {
                this.cargo.splice(i, 1);
                for (let j = i; j < this.cargo.length; j++) {
                    this.cargo[j].moveForward();
                }
                this.attachedGame.removeEntity(cargo);
                // woo! points!
                this.attachedGame.score += 25;
                return true;
            }
        }
        return false;
    }

    pullFromStation() {
        const cargo = this.station.tryPopCargo();
        if (cargo === null) {
            return false;
        }
        this.pushCargo(cargo, this.station);
        return true;
    }

    checkCargo(time) {
        if (!this.player) {
            // not for us
            return;
        }
        const railParts = this.attachedGame.getEntitiesAt(this.x, this.y).filter(e => e instanceof RailPart);
        if (this.station) {
            if (railParts.length === 0) {
                // No more rail!
                this.station = null;
                return;
            }
            if (time >= this.lastStationTick + DELAY) {
                this.lastStationTick = time;
                if (!this.pushToStation()) {
                    this.pullFromStation();
                }
            }
        } else {
            if (railParts.length !== 0) {
                // Attached rail!
                const rail = railParts[0];
                // Get station
                this.station = rail.station;
                this.lastStationTick = time;
            }
        }
    }

    draw(draw, zero, time) {
        this.checkCargo(time);
        super.draw(draw, zero, time);
    }

    onKeyboard(e) {
        if (!this.player) {
            // not for us
            return;
        }
        if (e.which == 87) {
            // 'w' key
            if (this.moveForward()) {
                this.cargo.forEach(c => c.moveForward());
            }
            return true;
        } else if (e.which == 83) {
            // 's' key
            if (this.moveBackward()) {
                this.cargo.forEach(c => c.moveBackward());
            }
            return true;
        }
    }

}