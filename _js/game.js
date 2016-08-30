import {Drawable} from "./canvas";
import {Entity} from "./entities/entity";
import $ from "jquery";
const $score = $("#score");
export class Game extends Drawable {
    constructor() {
        super();
        this.entities = [];
        this.renderLevels = {};
        this.score = 0;
    }

    onClick(event, correctedX, correctedY) {
        // Probably need to optimize this if there are too many entities.
        this.entities.forEach(e => {
            if (e.boundsContains(correctedX, correctedY)) {
                e.onClick(event, correctedX, correctedY);
            }
        })
    }

    set score(amt) {
        this.__score = amt;
        $score.text("Score: " + this.score);
    }

    get score() {
        return this.__score;
    }

    getEntitiesAt(x, y) {
        // TODO this might be optimizable for the small grid?
        return this.entities.filter(e => e.x == x && e.y == y);
    }

    onKeyboard(event) {
        let any = false;
        this.entities.forEach(e => {
            any |= e.onKeyboard(event);
        });
        return any;
    }

    addEntity(e) {
        if (!(e instanceof Entity)) {
            throw new Error("That ain't no entity I ever seen.");
        }
        this.entities.push(e);
        const renderOrder = e.renderOrder;
        const renderLevel = this.renderLevels[renderOrder] || (this.renderLevels[renderOrder] = []);
        renderLevel.push(e);
        e.attachedGame = this;
    }

    removeEntity(e) {
        e.attachedGame = undefined;
        this.entities.splice(this.entities.indexOf(e), 1);
        const renderLevel = this.renderLevels[e.renderOrder];
        renderLevel.splice(renderLevel.indexOf(e), 1);
    }

    draw(draw, zero, time) {
        const levels = Object.keys(this.renderLevels).sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));
        levels.forEach(l => {
            this.renderLevels[l].forEach(e => e.draw(draw, zero, time));
        });
    }
}