/*
 * app/lib/commands/printCurrentContext.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */

import * as Promise from 'bluebird';
import { Context, ISys, ICommand } from "waend-shell";

const pcc: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, sys) => {
        const currentContext = ctx.resolve('');
        sys.stdout.write([{ text: currentContext }]);
        return ctx.end(currentContext);
    }

export const command: ICommand = {
    name: 'pcc',
    command: pcc
};
