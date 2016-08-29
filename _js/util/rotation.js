class Rotation {
    constructor(radians, degrees, x, y) {
        this.__rad = radians;
        this.__deg = degrees;
        this.x = x !== undefined ? x : Math.sin(radians);
        this.y = y !== undefined ? y : Math.cos(radians);
    }

    get radians() {
        return this.__rad;
    }

    get degrees() {
        return this.__deg;
    }

    addDegrees(deg) {
        if (this.degrees % 90 === 0 && deg % 90 === 0) {
            // Raw 90 change
            return get90DegreeAngle(this.degrees + deg);
        }
        return createRotationDeg(this.degrees + deg);
    }
}
export function toDegrees(rad) {
    return (rad * 180) / Math.PI;
}
export function toRadians(deg) {
    return (deg * Math.PI) / 180;
}
export function normalizeDegree(deg) {
    if (0 <= deg && deg < 360) {
        return deg;
    }
    if (deg >= 360) {
        return deg % 360;
    }

    while (deg < 0) {
        deg += 360;
    }
    return deg;
}
export function createRotationRad(rad) {
    return new Rotation(rad, toDegrees(rad));
}
export function createRotationDeg(deg) {
    return new Rotation(toRadians(deg), deg);
}
const precalc = {
    0: new Rotation(0, 0, 1, 0),
    90: new Rotation(Math.PI / 2, 90, 0, 1),
    180: new Rotation(Math.PI, 180, -1, 0),
    270: new Rotation((Math.PI * 3) / 2, 270, 0, -1)
};
export function get90DegreeAngle(deg) {
    if (deg % 90 === 0) {
        deg = normalizeDegree(deg);
        return precalc[deg];
    }
    throw new Error("not % 90");
}
