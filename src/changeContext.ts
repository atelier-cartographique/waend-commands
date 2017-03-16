/*
 * app/lib/commands/chnageContext.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */

import * as Promise from "bluebird";
import { Context, ISys, ICommand } from "waend-shell";


const cc: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, _sys, argv) => {

        if (argv.length === 0) {
            return ctx.endWithError(new Error('NothingToChangeTo'));
        }

        const opt_path = argv[0];
        // slice(1) here because Context.resolve will 
        // always returns a leading '/' and then 
        // split('/') will always start 
        // with a leading empty string
        const comps = ctx.resolve(opt_path).split('/').slice(1);
        return ctx.shell.switchContext(comps);
    }

export const command: ICommand = {
    name: 'cc',
    command: cc
};
