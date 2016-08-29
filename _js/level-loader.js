import EntityRegistry from "./entities/registry";
export function loadLevel(name, game) {
    return loadLevelJson(name).then(json => {
        const addEntity = data => {
            const type = Object.keys(data)[0];
            const create = EntityRegistry.get(type);
            const args = [e => {
                game.addEntity(e);
            }].concat(data[type]);
            create.apply(undefined, args);
        };
        json.entities.forEach(addEntity);
        // Pop first object from railLines, aliases
        const railLines = json["railLines"];
        const aliases = railLines.shift();
        railLines.forEach(line => {
            let [start, end] = line.map(e => aliases[e]);
            if (start[0] == end[0]) {
                // x equal, vertical line.
                const rot = start[1] < end[1] ? 0 : 180;
                const x = start[0];
                const min = Math.min(start[1], end[1]);
                const max = Math.max(start[1], end[1]);
                for (let y = min; y <= max; y++) {
                    addEntity({"rail": [x, y, rot]});
                }
            } else {
                // y equal, horiz line.
                const rot = start[0] < end[0] ? 90 : 270;
                const y = start[1];
                const min = Math.min(start[0], end[0]);
                const max = Math.max(start[0], end[0]);
                for (let x = min; x <= max; x++) {
                    addEntity({"rail": [x, y, rot]});
                }
            }
        });
    });
}

export function loadLevelJson(name) {
    // Hijack AMD to load levels for us.
    return new Promise((res, rej) => {
        require(["text!../levels/" + name + ".json"],
            level => res(JSON.parse(level)), err => rej(err));
    });
}
