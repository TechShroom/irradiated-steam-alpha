import {RotatedImageEntity} from "./entity";
import {get90DegreeAngle} from "../util/rotation";

export class RailPart extends RotatedImageEntity {

    static create(x, y, rotation) {
        const rot = get90DegreeAngle(rotation);
        const railPart = new RailPart(x, y, rot.degrees);
        const r90 = rot.addDegrees(-90);
        const attachedPart = new AttachedPart(x + r90.x, y + r90.y, r90.degrees);
        return [railPart, attachedPart];
    }

    constructor(x, y, rotation) {
        super(x, y, 1, 1, rotation, "railStation");
    }

}
export class AttachedPart extends RotatedImageEntity {

    constructor(x, y, rotation) {
        super(x, y, 1, 1, rotation, "station");
    }

}