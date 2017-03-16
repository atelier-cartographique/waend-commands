/*
 * app/lib/commands/setAttribute.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */

import * as Promise from 'bluebird';
import { ICommand, ISys, Context, getenv } from "waend-shell";
import { Model, BaseModelData } from "waend-lib";
import { Components, GroupComponents, LayerComponents, FeatureComponents, getPathComponents } from "waend-util";



const setUser: (a: Context, b: Components, c: string, d: any) => Promise<Model> =
    (ctx, components, key, value) => {
        const uid = components.user;

        return (
            ctx.binder
                .getUser(uid)
                .then((model) => ctx.binder.update(model, key, value))
        );
    }


const setGroup: (a: Context, b: GroupComponents, c: string, d: any) => Promise<Model> =
    (ctx, components, key, value) => {
        const uid = components.user;
        const gid = components.group;

        return (
            ctx.binder
                .getGroup(uid, gid)
                .then((model) => ctx.binder.update(model, key, value))
        );
    }


const setLayer: (a: Context, b: LayerComponents, c: string, d: any) => Promise<Model> =
    (ctx, components, key, value) => {
        const uid = components.user;
        const gid = components.group;
        const lid = components.layer;

        return (
            ctx.binder
                .getLayer(uid, gid, lid)
                .then((model) => ctx.binder.update(model, key, value))
        );
    }


const setFeature: (a: Context, b: FeatureComponents, c: string, d: any) => Promise<Model> =
    (ctx, components, key, value) => {
        const uid = components.user;
        const gid = components.group;
        const lid = components.layer;
        const fid = components.feature;

        return (
            ctx.binder
                .getFeature(uid, gid, lid, fid)
                .then((model) => ctx.binder.update(model, key, value))
        );
    }



const setAttr: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, _sys, argv) => {
        if (argv.length < 2) {
            return Promise.reject(new Error('TooFewArguments'));
        }


        const components = getPathComponents(ctx.resolve(argv[0]));

        if (!components) {
            return Promise.reject(new Error('InvalidPath'));
        }

        const fromDelivered = getenv<BaseModelData>('DELIVERED');
        const key: string = argv[1];
        let value: any;

        if (argv.length > 2) {
            value = JSON.parse(argv[2]);
        }
        else if (fromDelivered) {
            value = fromDelivered;
        }

        if (!value) {
            return Promise.reject(new Error('NoValue'));
        }

        if (components.pathType === 'feature') {
            return setFeature(ctx, components, key, value);
        }
        else if (components.pathType === 'layer') {
            return setLayer(ctx, components, key, value);
        }
        else if (components.pathType === 'group') {
            return setGroup(ctx, components, key, value);
        }
        else {
            return setUser(ctx, components, key, value);
        }
    }


export const command: ICommand = {
    name: 'set',
    command: setAttr
};
