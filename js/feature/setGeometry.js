"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Geometry_1 = require("../../Geometry");
function setGeometry(geoJSON) {
    const self = this;
    const feature = self.data;
    let geom;
    if (geoJSON) {
        try {
            const data = JSON.parse(geoJSON);
            geom = new Geometry_1.default.Geometry(data);
        }
        catch (err) {
            return this.endWithError(err);
        }
    }
    else {
        geom = self.shell.env.DELIVERED;
    }
    return feature.setGeometry(geom);
}
exports.default = {
    name: 'setGeometry',
    command: setGeometry
};
