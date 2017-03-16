"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const util_1 = require("util");
const Region_1 = require("../Region");
function setRegion(east, south, west, north) {
    const self = this;
    const env = self.shell.env;
    const terminal = self.shell.terminal;
    let extent = [
        parseFloat(west),
        parseFloat(south),
        parseFloat(east),
        parseFloat(north)
    ];
    if ((0 === arguments.length)
        && env.DELIVERED
        && env.DELIVERED.getExtent) {
        extent = env.DELIVERED.getExtent();
    }
    Region_1.default.push(extent);
    return self.end(Region_1.default.get().getArray());
}
function getRegion() {
    const r = Region_1.default.get();
    return this.end(r.getArray());
}
function popRegion() {
    const r = Region_1.default.pop();
    return this.end(r.getArray());
}
function getCenter() {
    const r = Region_1.default.get();
    const center = r.getCenter().getCoordinates();
    this.sys.stdout.write(center[0], ' ', center[1]);
    return this.end(center);
}
function printRegion(opt_format) {
    const r = Region_1.default.get();
    const NE = r.getTopRight().getCoordinates();
    const SW = r.getBottomLeft().getCoordinates();
    const f = '%d %d %d %d';
    this.sys.stdout.write(util_1.default.format(f, SW[0], SW[1], NE[0], NE[1]));
    return this.end(r.getArray());
}
function bufferRegion(arg) {
    const r = Region_1.default.get();
    r.buffer(parseFloat(arg) || 0);
    Region_1.default.push(r);
    return this.end(r.getArray());
}
function regionCommand() {
    const args = lodash_1.default.toArray(arguments);
    const action = args.shift();
    if ('set' === action) {
        return setRegion.apply(this, args);
    }
    else if ('get' === action) {
        return getRegion.apply(this, args);
    }
    else if ('pop' === action) {
        return popRegion.apply(this, args);
    }
    else if ('center' === action) {
        return getCenter.apply(this, args);
    }
    else if ('buffer' === action) {
        return bufferRegion.apply(this, args);
    }
    else if ('print' === action) {
        return printRegion.apply(this, args);
    }
    return this.endWithError('not a valid action');
}
exports.default = {
    name: 'region',
    command: regionCommand
};
