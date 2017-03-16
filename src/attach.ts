import * as Promise from 'bluebird';
import { ICommand, ISys, Context } from "waend-shell";
import { getPathComponents } from 'waend-util';


const attach: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, _sys, argv) => {
        if (argv.length < 2) {
            return Promise.reject(new Error('TooFewArguments'));
        }

        const groupComps = getPathComponents(ctx.resolve(argv[0]));
        const layerComps = getPathComponents(ctx.resolve(argv[1]));


        if (groupComps && layerComps
            && groupComps.pathType === 'group'
            && layerComps.pathType === 'layer') {
            return ctx.binder.attachLayerToGroup(
                groupComps.user,
                groupComps.group,
                layerComps.layer
            );
        }
        return Promise.reject('wrong argument, expecting groupPath layerPath');
    }


export const command: ICommand = {
    name: 'attach',
    command: attach
};
