/*
 * app/lib/commands/chnageContext.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */

import * as ospath from 'path';
import * as Promise from "bluebird";
import { getenv, Context, ISys, ICommand } from "waend-shell";

const dotdot = '..';
const dot = '.';

const cc: (a: Context, b: ISys, c: string[]) => Promise<any> =
    (ctx, _sys, argv) => {

        let opt_path: string;

        if (argv.length === 0) {
            const tmp = getenv<string>('DELIVERED');
            if (tmp) {
                opt_path = tmp;
            }
            else {
                return ctx.endWithError(new Error('NothingToChangeTo'));
            }
        }
        else {
            opt_path = argv[0];
        }

        const path = ospath.normalize(opt_path);

        if (path === dot) {
            return ctx.end(0);
        }

        const isAbsolute = '/' === path[0];
        const pathComps = path.split('/');
        let ctxPath: string[] = [];

        if (isAbsolute) {
            if (path.length > 1) {
                pathComps.shift();
                ctxPath = pathComps;
            }
        }
        else {
            const pathCompsRef = path.split('/');
            const current = ctx.current;
            for (var i = 0; i < pathCompsRef.length; i++) {
                const comp = pathCompsRef[i];
                if (dotdot === comp) {
                    current.pop();
                    pathComps.shift();
                }
                else {
                    break;
                }
            }
            ctxPath = current.concat(pathComps);
        }

        return ctx.shell.switchContext(ctxPath);
    }

export const command: ICommand = {
    name: 'cc',
    command: cc
};
