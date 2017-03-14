
import * as Promise from 'bluebird';
import { dom } from 'waend-util';
import { ICommand, ISys, Context } from "waend-shell";
import { Model } from "waend-lib";

interface Components {
    user: string;
    group?: string;
    layer?: string;
    feature?: string;
}


const { getDomForModel, appendText, DIV } = dom;


const getPathComponents: (a: string) => (Components | null) =
    (path) => {
        const comps = path.split('/');
        if (comps.length < 1) {
            return null;
        }

        return {
            user: comps[0],
            group: comps[1],
            layer: comps[2],
            feature: comps[3],
        }
    }

const makeOutput: (a: ISys, c: Model) => (b: string) => void =
    (sys, model) => (k) => {
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

// TODO: find a name
const xxx: (a: ISys, b?: string) => (c: Model) => Model =
    (sys, key) => (model) => {
        const result = key ? model.get(key, null) : model.getData();
        const keys = key ? [key] : Object.keys(result);
        keys.forEach(makeOutput(sys, model));

        return model;
    }


const getUser: (a: ISys, b: string, c: Components) => Promise<Model> =
    (sys, key, components) => {
        const uid = components.user;

        return (
            Context.binder
                .getUser(uid)
                .then(xxx(sys, key))
        );
    }


const getGroup: (a: ISys, b: string, c: Components) => Promise<Model> =
    (sys, key, components) => {
        const uid = components.user;
        const gid = <string>components.group;

        return (
            Context.binder
                .getGroup(uid, gid)
                .then(xxx(sys, key))
        );
    }


const getLayer: (a: ISys, b: string, c: Components) => Promise<Model> =
    (sys, key, components) => {
        const uid = components.user;
        const gid = <string>components.group;
        const lid = <string>components.layer;

        return (
            Context.binder
                .getLayer(uid, gid, lid)
                .then(xxx(sys, key))
        );
    }


const getFeature: (a: ISys, b: string, c: Components) => Promise<Model> =
    (sys, key, components) => {
        const uid = components.user;
        const gid = <string>components.group;
        const lid = <string>components.layer;
        const fid = <string>components.feature;

        return (
            Context.binder
                .getFeature(uid, gid, lid, fid)
                .then(xxx(sys, key))
        );
    }


const getAttr: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, sys, argv) => {

        if (argv.length === 0) {
            return Promise.reject(new Error('MissingArguments'));
        }

        const components = getPathComponents(ctx.resolve(argv[0]));

        if (!components) {
            return Promise.reject(new Error('InvalidPath'));
        }

        const key: (string | undefined) = argv[1];

        if (components.feature) {
            return getFeature(sys, key, components);
        }
        else if (components.layer) {
            return getLayer(sys, key, components);
        }
        else if (components.group) {
            return getGroup(sys, key, components);
        }
        else {
            return getUser(sys, key, components);
        }

    }


export const command: ICommand = {
    name: 'get',
    command: getAttr
};
