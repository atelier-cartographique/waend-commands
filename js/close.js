"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Geometry_1 = require("../Geometry");
function close(sGeom) {
    const self = this;
    const env = self.shell.env;
    const binder = self.binder;
    const stdout = self.sys.stdout;
    const stdin = self.sys.stdin;
    const terminal = self.shell.terminal;
    const current = self.current();
    const uid = current[0];
    const gid = current[1];
    const lid = current[2];
    let geom;
    try {
        geom = Geometry_1.default.format.GeoJSON.read(sGeom);
    }
    catch (err) {
        try {
            geom = Geometry_1.default.format.GeoJSON.read(self.sys.stdout.readSync());
        }
        catch (err) {
            try {
                if (env.DELIVERED
                    && env.DELIVERED.toGeoJSON) {
                    geom = env.DELIVERED;
                }
                else {
                    geom = Geometry_1.default.format.GeoJSON.read(env.DELIVERED);
                }
            }
            catch (err) {
                throw (err);
            }
        }
    }
    if ('LineString' === geom.getType()) {
        const coords = geom.getCoordinates();
        coords.push(coords[0]);
        const poly = new Geometry_1.default.Polygon([coords]);
        return this.end(poly);
    }
    else {
        return this.end(geom);
    }
    return this.end();
}
exports.default = {
    name: 'close',
    command: close
};
