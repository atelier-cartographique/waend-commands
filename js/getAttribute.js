"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_util_1 = require("waend-util");
const waend_shell_1 = require("waend-shell");
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
const getUser = (sys, key, components) => {
    const uid = components.user;
    return (waend_shell_1.Context.binder
        .getUser(uid)
        .then(xxx(sys, key)));
};
const getGroup = (sys, key, components) => {
    const uid = components.user;
    const gid = components.group;
    return (waend_shell_1.Context.binder
        .getGroup(uid, gid)
        .then(xxx(sys, key)));
};
const getLayer = (sys, key, components) => {
    const uid = components.user;
    const gid = components.group;
    const lid = components.layer;
    return (waend_shell_1.Context.binder
        .getLayer(uid, gid, lid)
        .then(xxx(sys, key)));
};
const getFeature = (sys, key, components) => {
    const uid = components.user;
    const gid = components.group;
    const lid = components.layer;
    const fid = components.feature;
    return (waend_shell_1.Context.binder
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
        return getFeature(sys, key, components);
    }
    else if (components.pathType === 'layer') {
        return getLayer(sys, key, components);
    }
    else if (components.pathType === 'group') {
        return getGroup(sys, key, components);
    }
    else {
        return getUser(sys, key, components);
    }
};
exports.command = {
    name: 'get',
    command: getAttr
};
