import {ImageEntity} from "./entity";
import {images} from "../images";

const railImage = images["rail"];
export class Rail extends ImageEntity {

    constructor(x, y, rotation) {
        super(x, y, 1, 1, "rail");
        this.rotation = rotation;
        this.image = railImage.chooseImage(this.rotation);
    }

}