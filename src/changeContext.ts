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
        const comps = ctx.resolve(opt_path).split('/');
        return ctx.shell.switchContext(comps);
    }

export const command: ICommand = {
    name: 'cc',
    command: cc
};
