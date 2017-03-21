"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_util_1 = require("waend-util");
const { getDomForModel } = waend_util_1.dom;
const printModel = (ctx, sys) => (model) => {
    const modelPath = ctx.resolve(model.id);
    sys.stdout.write([{
            text: model.id,
            fragment: getDomForModel(model, 'name', 'div', 'model-name'),
            commands: [`cc ${modelPath}`]
        }]);
};
const listGroups = (ctx, sys, components) => {
    return (ctx.binder
        .getGroups(components.user)
        .then((groups) => {
        groups.forEach(printModel(ctx, sys));
        return groups;
    }));
};
const listLayers = (ctx, sys, components) => {
    return (ctx.binder
        .getLayers(components.user, components.group)
        .then((layers) => {
        layers.forEach(printModel(ctx, sys));
        return layers;
    }));
};
const listFeatures = (ctx, sys, components) => {
    return (ctx.binder
        .getFeatures(components.user, components.group, components.layer)
        .then((features) => {
        features.forEach(printModel(ctx, sys));
        return features;
    }));
};
const list = (ctx, sys, argv) => {
    if (argv.length === 0) {
        return Promise.reject(new Error('MissingArguments'));
    }
    const components = waend_util_1.getPathComponents(ctx.resolve(argv[0]));
    if (!components) {
        return Promise.reject(new Error('InvalidPath'));
    }
    if (components.pathType === 'feature') {
        return Promise.resolve([]);
    }
    else if (components.pathType === 'layer') {
        return listFeatures(ctx, sys, components);
    }
    else if (components.pathType === 'group') {
        return listLayers(ctx, sys, components);
    }
    else {
        return listGroups(ctx, sys, components);
    }
};
exports.command = {
    name: 'ls',
    command: list
};
