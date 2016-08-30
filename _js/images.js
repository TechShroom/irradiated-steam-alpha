export function loadImage(image) {
    return new Promise((res, rej) => {
        require(["image!img/" + image + ".png"], img => res(img), err => rej(err));
    });
}

export function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export function rotatedCanvas(rot, railImage) {
    const canvas = createCanvas(railImage.width, railImage.height);
    const ctx = canvas.getContext("2d");
    ctx.translate(railImage.width / 2, railImage.height / 2);
    // canvas rotation is 90 deg off from math rotation -- fix here
    ctx.rotate(((rot + 90) * Math.PI) / 180);
    ctx.drawImage(railImage, -railImage.width / 2, -railImage.height / 2);
    return canvas;
}

export function createRotatedCanvases(img) {
    const canvas0 = rotatedCanvas(0, img);
    const canvas90 = rotatedCanvas(90, img);
    const canvas180 = rotatedCanvas(180, img);
    const canvas270 = rotatedCanvas(270, img);
    const images = [canvas0, canvas90, canvas180, canvas270];
    return {
        "images": images,
        chooseImage: rot => {
            if (rot === 0) {
                return canvas0;
            } else if (rot == 90) {
                return canvas90;
            } else if (rot == 180) {
                return canvas180;
            } else if (rot == 270) {
                return canvas270;
            }
            throw RangeError("not % 90");
        }
    };
}

const queue = [];
export const images = {};
function addImage(image, rightAngles = false) {
    queue.push(image);
    loadImage(image).then(img => {
        images[image] = rightAngles ? createRotatedCanvases(img) : img;
        queue.splice(queue.indexOf(image), 1);
    }).catch(err => console.error(err));
}
addImage("train", false);
addImage("rail", true);
addImage("railStation", true);
addImage("station", true);
export function runWhenAllLoaded(cb) {
    let interval = undefined;
    const loop = () => {
        if (interval === undefined) {
            // already completed.
            return;
        }
        if (queue.length === 0) {
            clearInterval(interval);
            interval = undefined;
            cb();
        }
    };
    interval = setInterval(loop, 10);
}