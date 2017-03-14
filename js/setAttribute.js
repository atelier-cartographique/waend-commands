"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_shell_1 = require("waend-shell");
const getPathComponents = (path) => {
    const comps = path.split('/');
    if (comps.length < 1) {
        return null;
    }
    return {
        user: comps[0],
        group: comps[1],
        layer: comps[2],
        feature: comps[3],
    };
};
const setUser = (components, key, value) => {
    const uid = components.user;
    return (waend_shell_1.Context.binder
        .getUser(uid)
        .then((model) => waend_shell_1.Context.binder.update(model, key, value)));
};
const setGroup = (components, key, value) => {
    const uid = components.user;
    const gid = components.group;
    return (waend_shell_1.Context.binder
        .getGroup(uid, gid)
        .then((model) => waend_shell_1.Context.binder.update(model, key, value)));
};
const setLayer = (components, key, value) => {
    const uid = components.user;
    const gid = components.group;
    const lid = components.layer;
    return (waend_shell_1.Context.binder
        .getLayer(uid, gid, lid)
        .then((model) => waend_shell_1.Context.binder.update(model, key, value)));
};
const setFeature = (components, key, value) => {
    const uid = components.user;
    const gid = components.group;
    const lid = components.layer;
    const fid = components.feature;
    return (waend_shell_1.Context.binder
        .getFeature(uid, gid, lid, fid)
        .then((model) => waend_shell_1.Context.binder.update(model, key, value)));
};
const setAttr = (ctx, _sys, argv) => {
    if (argv.length < 2) {
        return Promise.reject(new Error('TooFewArguments'));
    }
    const components = getPathComponents(ctx.resolve(argv[0]));
    if (!components) {
        return Promise.reject(new Error('InvalidPath'));
    }
    const fromDelivered = waend_shell_1.getenv('DELIVERED');
    const key = argv[1];
    let value;
    if (argv.length > 2) {
        value = JSON.parse(argv[2]);
    }
    else if (fromDelivered) {
        value = fromDelivered;
    }
    if (!value) {
        return Promise.reject(new Error('NoValue'));
    }
    if (components.feature) {
        return setFeature(components, key, value);
    }
    else if (components.layer) {
        return setLayer(components, key, value);
    }
    else if (components.group) {
        return setGroup(components, key, value);
    }
    else {
        return setUser(components, key, value);
    }
};
exports.command = {
    name: 'set',
    command: setAttr
};
