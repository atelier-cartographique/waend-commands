"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
function detach(path) {
    let comps = path.split('/');
    if (comps[0].length === 0) {
        comps = comps.slice(1);
    }
    const uid = comps[0];
    const gid = comps[1];
    const lid = comps[2];
    if (!!uid && !!gid && !!lid) {
        return this.binder.detachLayerFromGroup(uid, gid, lid);
    }
    return bluebird_1.default.reject('wrong argument, expecting /user_id/group_id/layer_id');
}
exports.default = {
    name: 'detach',
    command: detach
};
