"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_shell_1 = require("waend-shell");
const waend_util_1 = require("waend-util");
const createGroup = (_ctx, sys, options) => {
    const uid = options.parent.user;
    return (waend_shell_1.Context.binder
        .setGroup(uid, options.data)
        .then((model) => {
        const cmd = {
            commands: [`cc /${uid}/${model.id}`, 'get'],
            text: waend_util_1.getModelName(model)
        };
        sys.stdout.write([{ text: 'created map : ' }, cmd]);
        return model;
    }));
};
const createLayer = (_ctx, sys, options) => {
    const uid = options.parent.user;
    const gid = options.parent.group;
    return (waend_shell_1.Context.binder
        .setLayer(uid, gid, options.data)
        .then((model) => {
        const cmd = {
            commands: [`cc /${uid}/${gid}/${model.id}`, 'get'],
            text: waend_util_1.getModelName(model)
        };
        sys.stdout.write([{ text: 'created layer : ' }, cmd]);
        waend_shell_1.semaphore.signal('create:layer', model);
        return model;
    }));
};
const createFeature = (_ctx, sys, options) => {
    const uid = options.parent.user;
    const gid = options.parent.group;
    const lid = options.parent.layer;
    return (waend_shell_1.Context.binder
        .setFeature(uid, gid, lid, options.data, false)
        .then((model) => {
        const cmd = {
            commands: [`cc /${uid}/${gid}/${lid}/${model.id}`, 'get'],
            text: waend_util_1.getModelName(model)
        };
        sys.stdout.write([{ text: 'created feature : ' }, cmd]);
        waend_shell_1.semaphore.signal('create:feature', model);
        return model;
    }));
};
const getPathComponents = (path) => {
    const comps = path.split('/');
    if (comps.length < 1) {
        return null;
    }
    return {
        user: comps[0],
        group: comps[1],
        layer: comps[2],
    };
};
const parseArgv = (ctx, argv) => {
    const fromDelivered = waend_shell_1.getenv('DELIVERED');
    if (argv.length < 2) {
        return null;
    }
    const what = argv[0];
    const parent = getPathComponents(ctx.resolve(argv[1]));
    let data;
    if ((what !== 'group') && (what !== 'layer') && (what !== 'feature')) {
        return null;
    }
    if (!parent) {
        return null;
    }
    if (argv.length > 2) {
        data = JSON.parse(argv[2]);
    }
    else if (fromDelivered) {
        data = fromDelivered;
    }
    else {
        return null;
    }
    return { what, parent, data };
};
const create = (ctx, sys, argv) => {
    const options = parseArgv(ctx, argv);
    if (!options) {
        return Promise.reject(new Error('WrongArguments'));
    }
    switch (options.what) {
        case 'group':
            return createGroup(ctx, sys, options);
        case 'layer':
            return createLayer(ctx, sys, options);
        case 'feature':
            return createFeature(ctx, sys, options);
        default:
            return Promise.reject(new Error('InvalidCreateType'));
    }
};
exports.command = {
    name: 'new',
    command: create
};
