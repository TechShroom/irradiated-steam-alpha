import {Train} from "./train";
import {Rail} from "./rail";
function cb(f) {
    return function callSub() {
        const args = Array.prototype.slice.call(arguments);
        const cb = args.shift();
        const ret = f.apply(undefined, args);
        cb(ret);
    }
}
const registry = {
    "train": cb((x, y, color) => new Train(x, y, color)),
    "rail": cb((x, y, rot, image) => new Rail(x, y, rot, image))
};
export default {
    get: (type) => {
        return registry[type];
    }
};