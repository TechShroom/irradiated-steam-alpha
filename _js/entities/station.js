import {RotatedImageEntity} from "./entity";
import {get90DegreeAngle} from "../util/rotation";

export class RailPart extends RotatedImageEntity {

    static create(x, y, rotation) {
        const rot = get90DegreeAngle(rotation);
        const r90 = rot.addDegrees(-90);
        const attachedPart = new AttachedPart(x + r90.x, y + r90.y, rot.degrees);
        const railPart = new RailPart(x, y, rot.degrees, attachedPart);
        return [railPart, attachedPart];
    }

    constructor(x, y, rotation, station) {
        super(x, y, 1, 1, rotation, "railStation");
        this.station = station;
    }

    getLogic() {
        return this.station;
    }

}
/**
 * Actually holds the logic of the station.
 */
export class AttachedPart extends RotatedImageEntity {

    constructor(x, y, rotation) {
        super(x, y, 1, 1, rotation, "station");
        this.rotation = get90DegreeAngle(rotation);
        this.capacity = 4;
        this.cargoOut = ["red", "green", "blue", "hsl(50, 60%, 50%)"];
        this.cargoIn = ["orange"];
    }

    tryPushCargo(cargo) {
        if (this.cargoIn.length >= this.capacity) {
            return false;
        }
        this.cargoIn.push(cargo);
        return true;
    }

    tryPopCargo(cargo) {
        if (this.cargoOut.length <= 0) {
            return null;
        }
        return this.cargoOut.shift();
    }

    draw(draw, zero, time) {
        super.draw(draw, zero, time);
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
                ctx.fillRect(0, i * 3, 7, 2);
            });
            this.cargoIn.forEach((c, i) => {
                ctx.fillStyle = c;
                ctx.fillRect(8, i * 3, 7, 2);
            });
        });
    }

}