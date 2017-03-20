"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const Promise = require("bluebird");
const waend_shell_1 = require("waend-shell");
const waend_lib_1 = require("waend-lib");
const setRegion = (_ctx, _sys, argv) => {
    const fromEnv = waend_shell_1.getenv('DELIVERED');
    let extent;
    if ((argv.length < 4) && (!fromEnv)) {
        return Promise.reject(new Error('MissingArguments'));
    }
    if (argv.length >= 4) {
        extent = new waend_lib_1.Extent([
            parseFloat(argv[0]),
            parseFloat(argv[1]),
            parseFloat(argv[2]),
            parseFloat(argv[3])
        ]);
    }
    else if (fromEnv) {
        try {
            extent = new waend_lib_1.Extent(fromEnv);
        }
        catch (_e) {
            extent = null;
        }
    }
    else {
        extent = null;
    }
    if (!extent) {
        return Promise.reject(new Error('NothingAsAnExtent'));
    }
    waend_shell_1.region.push(extent);
    return Promise.resolve(waend_shell_1.region.get().getArray());
};
exports.setRegionCmd = {
    command: setRegion,
    name: 'region-set'
};
const getRegion = (_ctx, _sys, _argv) => {
    const r = waend_shell_1.region.get();
    return Promise.resolve(r.getArray());
};
exports.getRegionCmd = {
    command: getRegion,
    name: 'region-get'
};
const popRegion = (_ctx, _sys, _argv) => {
    const r = waend_shell_1.region.pop();
    if (!r) {
        return Promise.reject(new Error('NoMoreRegionToPop'));
    }
    return Promise.resolve(r.getArray());
};
exports.popRegionCmd = {
    command: popRegion,
    name: 'region-pop'
};
const getCenter = (_ctx, sys, _argv) => {
    const r = waend_shell_1.region.get();
    const center = r.getCenter().getCoordinates();
    sys.stdout.write([{ text: `[${center[0]} ${center[1]}]` }]);
    return Promise.resolve(center);
};
exports.getCenterCmd = {
    command: getCenter,
    name: 'region-center'
};
const printRegion = (_ctx, sys, argv) => {
    const r = waend_shell_1.region.get();
    const NE = r.getTopRight().getCoordinates();
    const SW = r.getBottomLeft().getCoordinates();
    let f = '%d %d %d %d';
    if (argv.length >= 1) {
        f = argv[0];
    }
    sys.stdout.write([{ text: util_1.format(f, SW[0], SW[1], NE[0], NE[1]) }]);
    return Promise.resolve(r.getArray());
};
exports.printRegionCmd = {
    command: printRegion,
    name: 'region-print'
};
const bufferRegion = (_ctx, _sys, argv) => {
    if (argv.length === 0) {
        return Promise.reject(new Error('MissingArgument'));
    }
    const r = waend_shell_1.region.get();
    r.buffer(parseFloat(argv[0]));
    waend_shell_1.region.push(r);
    return Promise.resolve(r.getArray());
};
exports.bufferRegionCmd = {
    command: bufferRegion,
    name: 'region-buffer'
};
