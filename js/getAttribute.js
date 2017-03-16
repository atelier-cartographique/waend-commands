"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_util_1 = require("waend-util");
const { getDomForModel, appendText, DIV } = waend_util_1.dom;
const makeOutput = (sys, model) => (k) => {
    const wrapper = DIV();
    const key = DIV();
    const value = getDomForModel(model, k, 'div', 'key-value');
    appendText(k)(key);
    wrapper.appendChild(key);
    wrapper.appendChild(value);
    sys.stdout.write([{
            fragment: wrapper,
            text: k
        }]);
};
const xxx = (sys, key) => (model) => {
    const result = key ? model.get(key, null) : model.getData();
    const keys = key ? [key] : Object.keys(result);
    keys.forEach(makeOutput(sys, model));
    return model;
};
const getUser = (ctx, sys, key, components) => {
    const uid = components.user;
    return (ctx.binder
        .getUser(uid)
        .then(xxx(sys, key)));
};
const getGroup = (ctx, sys, key, components) => {
    const uid = components.user;
    const gid = components.group;
    return (ctx.binder
        .getGroup(uid, gid)
        .then(xxx(sys, key)));
};
const getLayer = (ctx, sys, key, components) => {
    const uid = components.user;
    const gid = components.group;
    const lid = components.layer;
    return (ctx.binder
        .getLayer(uid, gid, lid)
        .then(xxx(sys, key)));
};
const getFeature = (ctx, sys, key, components) => {
    const uid = components.user;
    const gid = components.group;
    const lid = components.layer;
    const fid = components.feature;
    return (ctx.binder
        .getFeature(uid, gid, lid, fid)
        .then(xxx(sys, key)));
};
const getAttr = (ctx, sys, argv) => {
    if (argv.length === 0) {
        return Promise.reject(new Error('MissingArguments'));
    }
    const components = waend_util_1.getPathComponents(ctx.resolve(argv[0]));
    if (!components) {
        return Promise.reject(new Error('InvalidPath'));
    }
    const key = argv[1];
    if (components.pathType === 'feature') {
        return getFeature(ctx, sys, key, components);
    }
    else if (components.pathType === 'layer') {
        return getLayer(ctx, sys, key, components);
    }
    else if (components.pathType === 'group') {
        return getGroup(ctx, sys, key, components);
    }
    else {
        return getUser(ctx, sys, key, components);
    }
};
exports.command = {
    name: 'get',
    command: getAttr
};
