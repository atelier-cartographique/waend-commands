"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_shell_1 = require("waend-shell");
const waend_util_1 = require("waend-util");
const createGroup = (ctx, sys, options) => {
    const uid = options.parent.user;
    return (ctx.binder
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
const createLayer = (ctx, sys, options) => {
    const parent = options.parent;
    if (parent.pathType === 'group') {
        const uid = parent.user;
        const gid = parent.group;
        return (ctx.binder
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
    }
    return Promise.reject('WrongParentType');
};
const createFeature = (ctx, sys, options) => {
    const parent = options.parent;
    if (parent.pathType === 'layer') {
        const uid = parent.user;
        const gid = parent.group;
        const lid = parent.layer;
        return (ctx.binder
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
    }
    return Promise.reject('WrongParentType');
};
const parseArgv = (ctx, argv) => {
    const fromDelivered = waend_shell_1.getenv('DELIVERED');
    if (argv.length < 2) {
        return null;
    }
    const what = argv[0];
    const parent = waend_util_1.getPathComponents(ctx.resolve(argv[1]));
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
