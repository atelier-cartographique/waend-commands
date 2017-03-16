"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Region_1 = require("../Region");
function bufferRegion(arg) {
    const extent = Region_1.default.get();
    const newExtent = extent.buffer(parseFloat(arg || 0));
    Region_1.default.push(newExtent);
    return this.end(newExtent);
}
exports.default = {
    name: 'zoom',
    command: bufferRegion
};
