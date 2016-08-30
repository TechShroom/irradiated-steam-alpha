import {RotatedImageEntity, ImageEntity} from "./entity";
import {createCanvas, rotatedCanvas} from "../images";
import {get90DegreeAngle} from "../util/rotation";

function createRailImage(color) {
    const canvas = createCanvas(16, 16);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 16, 16);
    return canvas;
}

export class RailPart extends ImageEntity {

    static create(x, y, rotation, color) {
        const rot = get90DegreeAngle(rotation);
        const r90 = rot.addDegrees(-90);
        const attachedPart = new AttachedPart(x + r90.x, y + r90.y, rot.degrees, color);
        const railPart = new RailPart(x, y, rotatedCanvas(rot.degrees, createRailImage(worldOfColors[color])), attachedPart);
        return [railPart, attachedPart];
    }

    constructor(x, y, image, station) {
        super(x, y, 1, 1, image);
        this.station = station;
    }

    getLogic() {
        return this.station;
    }

}
const worldOfColors = ["red", "orange", "green", "blue"];
const TIME_BETWEEN_SPAWNS = 3000;
/**
 * Actually holds the logic of the station.
 */
export class AttachedPart extends RotatedImageEntity {

    constructor(x, y, rotation, color) {
        super(x, y, 1, 1, rotation, "station");
        this.rotation = get90DegreeAngle(rotation);
        this.capacity = 4;
        this.color = color;
        this.colorString = worldOfColors[color];
        const copy = worldOfColors.slice();
        copy.splice(color, 1);
        this.picker = copy;
        this.cargoOut = [];
        this.cargoIn = [];
        this.mostRecentSpawn = 0;
    }

    tryPushCargo(cargo) {
        if (this.cargoIn.length >= this.capacity || this.colorString !== cargo) {
            return false;
        }
        this.cargoIn.push(cargo);
        return true;
    }

    tryPopCargo() {
        if (this.cargoOut.length <= 0) {
            return null;
        }
        return this.cargoOut.shift();
    }

    draw(draw, zero, time) {
        super.draw(draw, zero, time);
        if (time >= this.mostRecentSpawn + TIME_BETWEEN_SPAWNS) {
            this.mostRecentSpawn = time;
            if (this.cargoOut.length < this.capacity) {
                // ~25% chance to spawn
                if ((Math.random() * 100) < 25) {
                    const index = Math.floor(Math.random() * this.picker.length);
                    this.cargoOut.push(this.picker[index]);
                }
            }
            if (this.cargoIn.length > 0) {
                // de-spawn one
                this.cargoIn.pop();
            }
        }
        // here's the fun part -- all the cargo is colors :D
        draw.noStateLeak(ctx => {
            const rot = this.rotation;
            const deg = rot.degrees;
            let x = this.realX + this.rotation.x * 16;
            let y = this.realY + this.rotation.y * 16;
            // Appropriate modifications to x/y for rotations
            if (deg === 90) {
                // Add x
                x += this.realWidth;
            } else if (deg === 180) {
                // Add y, add x
                x += this.realWidth;
                y += this.realHeight;
            } else if (deg === 270) {
                // Add y
                y += this.realHeight;
            }
            ctx.translate(x, y);
            ctx.rotate(rot.addDegrees(180).radians);
            this.cargoOut.forEach((c, i) => {
                ctx.fillStyle = c;
                ctx.fillRect(0, i * 3 + 2, 6, 2);
            });
            this.cargoIn.forEach((c, i) => {
                ctx.fillStyle = c;
                ctx.fillRect(10, i * 3 + 2, 6, 2);
            });
        });
    }

}