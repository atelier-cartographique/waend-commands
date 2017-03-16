"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Region_1 = require("../Region");
const Transform_1 = require("../Transform");
function panRegion(dir, val) {
    const extent = Region_1.default.get().extent;
    T = new Transform_1.default();
    dir = dir.toUpperCase();
    if ('N' === dir) {
        T.translate(0, val);
    }
    else if ('S' === dir) {
        T.translate(0, -val);
    }
    else if ('E' === dir) {
        T.translate(val, 0);
    }
    else if ('W' === dir) {
        T.translate(-val, 0);
    }
    const NE = T.mapVec2([extent[2], extent[3]]);
    const SW = T.mapVec2([extent[0], extent[1]]);
    const newExtent = [SW[0], SW[1], NE[0], NE[1]];
    Region_1.default.push(newExtent);
    return this.end(newExtent);
}
exports.default = {
    name: 'pan',
    command: panRegion
};
