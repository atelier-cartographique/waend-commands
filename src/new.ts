/*
 * app/lib/commands/create.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */


import * as Promise from 'bluebird';
import { semaphore, Context, ISys, getenv, ICommand } from 'waend-shell';
import { BaseModelData, Group, Span, Layer, Feature } from 'waend-lib';
import { getModelName, getPathComponents, Components } from 'waend-util';

type What = 'group' | 'layer' | 'feature';


interface CreateOption {
    what: What;
    parent: Components;
    data: BaseModelData
}


const createGroup: (a: Context, b: ISys, c: CreateOption) => Promise<Group> =
    (_ctx, sys, options) => {
        const uid = options.parent.user;
        return (
            Context.binder
                .setGroup(uid, options.data)
                .then((model) => {
                    const cmd: Span = {
                        commands: [`cc /${uid}/${model.id}`, 'get'],
                        text: getModelName(model)
                    };
                    sys.stdout.write([{ text: 'created map : ' }, cmd]);
                    return model;
                })
        );
    }


const createLayer: (a: Context, b: ISys, c: CreateOption) => Promise<Layer> =
    (_ctx, sys, options) => {
        const parent = options.parent;
        if (parent.pathType === 'group') {
            const uid = parent.user;
            const gid = parent.group;
            return (
                Context.binder
                    .setLayer(uid, gid, options.data)
                    .then((model) => {
                        const cmd: Span = {
                            commands: [`cc /${uid}/${gid}/${model.id}`, 'get'],
                            text: getModelName(model)
                        };
                        sys.stdout.write([{ text: 'created layer : ' }, cmd]);
                        semaphore.signal('create:layer', model);
                        return model;
                    })
            );
        }
        return Promise.reject('WrongParentType');
    }


const createFeature: (a: Context, b: ISys, c: CreateOption) => Promise<Feature> =
    (_ctx, sys, options) => {
        const parent = options.parent;
        if (parent.pathType === 'layer') {
            const uid = parent.user;
            const gid = parent.group;
            const lid = parent.layer;
            return (
                Context.binder
                    .setFeature(uid, gid, lid, options.data, false)
                    .then((model) => {
                        const cmd: Span = {
                            commands: [`cc /${uid}/${gid}/${lid}/${model.id}`, 'get'],
                            text: getModelName(model)
                        };
                        sys.stdout.write([{ text: 'created feature : ' }, cmd]);
                        semaphore.signal('create:feature', model);
                        return model;
                    })
            );
        }
        return Promise.reject('WrongParentType');
    }


const parseArgv: (a: Context, b: string[]) => (CreateOption | null) =
    (ctx, argv) => {
        const fromDelivered = getenv<BaseModelData>('DELIVERED');
        if (argv.length < 2) {
            return null;
        }
        const what = argv[0];
        const parent = getPathComponents(ctx.resolve(argv[1]));
        let data: BaseModelData;

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
    }

const create: (a: Context, b: ISys, c: string[]) => Promise<(Group | Layer | Feature)> =
    (ctx, sys, argv) => {
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

export const command: ICommand = {
    name: 'new',
    command: create
};

