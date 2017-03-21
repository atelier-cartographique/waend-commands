

import * as Promise from 'bluebird';
import { Context, ISys, ICommand } from "waend-shell";
import { Model } from "waend-lib";
import { dom, getPathComponents, Components, LayerComponents, GroupComponents } from 'waend-util';

const { getDomForModel } = dom;

const printModel: (a: Context, b: ISys) => (c: Model) => void =
    (ctx, sys) => (model) => {
        const modelPath = ctx.resolve(model.id);
        sys.stdout.write([{
            text: model.id,
            fragment: getDomForModel(model, 'name', 'div', 'model-name'),
            commands: [`cc ${modelPath}`]
        }])
    };


const listGroups: (a: Context, b: ISys, c: Components) => Promise<any> =
    (ctx, sys, components) => {

        return (
            ctx.binder
                .getGroups(components.user)
                .then((groups) => {
                    groups.forEach(printModel(ctx, sys));
                    return groups;
                }));
    }


const listLayers: (a: Context, b: ISys, c: GroupComponents) => Promise<any> =
    (ctx, sys, components) => {
        return (
            ctx.binder
                .getLayers(components.user, components.group)
                .then((layers) => {
                    layers.forEach(printModel(ctx, sys));
                    return layers;
                }));
    }


const listFeatures: (a: Context, b: ISys, c: LayerComponents) => Promise<any> =
    (ctx, sys, components) => {
        return (
            ctx.binder
                .getFeatures(components.user, components.group, components.layer)
                .then((features) => {
                    features.forEach(printModel(ctx, sys));
                    return features;
                }));
    }



const list: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, sys, argv) => {

        if (argv.length === 0) {
            return Promise.reject(new Error('MissingArguments'));
        }

        const components = getPathComponents(ctx.resolve(argv[0]));

        if (!components) {
            return Promise.reject(new Error('InvalidPath'));
        }

        if (components.pathType === 'feature') {
            return Promise.resolve([]); // do we throw an error?
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

    }


export const command: ICommand = {
    name: 'ls',
    command: list
};

