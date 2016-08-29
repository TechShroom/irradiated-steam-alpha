import $ from "jquery";
import {loadLevel} from "./level-loader";
import {Game} from "./game";
import {Canvas} from "./canvas";
const $window = $(window);
const $canvas = $("#game");
const canvas = $canvas[0];
const ctx = canvas.getContext("2d");
const draw = new Canvas(ctx);

$canvas.click(event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    game.onClick(event, x, y);
});
$window.keydown(event => {
    if (game.onKeyboard(event)) {
        event.preventDefault();
    }
});

// CPU CONSERVATION - GO!
let rendering = true;
$window.blur(() => {
    rendering = false;
});
$window.focus(() => {
    rendering = true;
    window.requestAnimationFrame(drawLoop);
});

let firstShift = false;
let frames = [];
function updateFrames(time) {
    frames.push(time);
    while (frames[0] < (time - 1000)) {
        frames.shift();
        firstShift = true;
    }
    return firstShift ? frames.length : NaN;
}

let zero = undefined;
let game = undefined;
function drawLoop() {
    const time = new Date().getTime();
    const fps = updateFrames(time);
    if (zero === undefined) {
        zero = time;
    }
    draw.clearCanvas();
    ctx.fillText("FPS: " + fps, 10, 10);

    game.draw(draw, zero, time);

    if (rendering) {
        window.requestAnimationFrame(drawLoop);
    }
}
game = new Game();
loadLevel("level1", game).then(() => console.info("Loaded level!")).catch(err => console.error(err));
window.gameExported = game;
window.requestAnimationFrame(drawLoop);

