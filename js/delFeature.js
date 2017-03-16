"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
function delFeature(id) {
    const binder = this.binder;
    const shell = this.shell;
    const self = this;
    const uid = this.getUser();
    const gid = this.getGroup();
    const lid = this.getLayer();
    const fid = this.getFeature() || id;
    const inFeature = !!(this.getFeature());
    const resolver = (resolve, reject) => {
        binder.delFeature(uid, gid, lid, fid)
            .then(() => {
            shell.historyPushContext([uid, gid, lid])
                .then(() => {
                resolve(0);
            })
                .catch(reject);
        })
            .catch(reject);
    };
    if (uid && gid && lid && fid) {
        if (inFeature) {
            return (new bluebird_1.default(resolver));
        }
        else {
            return binder.delFeature(uid, gid, lid, fid);
        }
    }
    return bluebird_1.default.reject('MissigArgumentOrWrongContext');
}
exports.default = {
    name: 'del_feature',
    command: delFeature
};
