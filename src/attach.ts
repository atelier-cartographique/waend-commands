import * as Promise from 'bluebird';
import { ICommand, ISys, Context } from "waend-shell";


interface Components {
    user: string;
    group?: string;
    layer?: string;
    feature?: string;
}


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

const attach: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, _sys, argv) => {
        if (argv.length < 2) {
            return Promise.reject(new Error('TooFewArguments'));
        }

        const groupComps = getPathComponents(ctx.resolve(argv[0]));
        const layerComps = getPathComponents(ctx.resolve(argv[1]));


        if (groupComps && layerComps && groupComps.group && layerComps.layer) {
            return Context.binder.attachLayerToGroup(
                groupComps.user, groupComps.group, layerComps.layer);
        }
        return Promise.reject('wrong argument, expecting groupPath layerPath');
    }


export const command: ICommand = {
    name: 'attach',
    command: attach
};
