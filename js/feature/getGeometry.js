"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function getGeometry() {
    const self = this;
    const args = lodash_1.default.toArray(arguments);
    const format = args.shift();
    const sys = self.sys;
    const geom = self.data.getGeometry();
    sys.stdout.write(JSON.stringify(geom.toGeoJSON()));
    return self.end(geom);
}
exports.default = {
    name: 'getGeometry',
    command: getGeometry
};
