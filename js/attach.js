"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_util_1 = require("waend-util");
const attach = (ctx, _sys, argv) => {
    if (argv.length < 2) {
        return Promise.reject(new Error('TooFewArguments'));
    }
    const groupComps = waend_util_1.getPathComponents(ctx.resolve(argv[0]));
    const layerComps = waend_util_1.getPathComponents(ctx.resolve(argv[1]));
    if (groupComps && layerComps
        && groupComps.pathType === 'group'
        && layerComps.pathType === 'layer') {
        return ctx.binder.attachLayerToGroup(groupComps.user, groupComps.group, layerComps.layer);
    }
    return Promise.reject('wrong argument, expecting groupPath layerPath');
};
exports.command = {
    name: 'attach',
    command: attach
};
