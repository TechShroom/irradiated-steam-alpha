import {RotatedImageEntity} from "./entity";

export class Rail extends RotatedImageEntity {

    constructor(x, y, rotation) {
        super(x, y, 1, 1, rotation, "rail");
    }

}