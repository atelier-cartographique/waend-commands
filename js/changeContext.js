"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ospath = require("path");
const waend_shell_1 = require("waend-shell");
const dotdot = '..';
const dot = '.';
const cc = (ctx, _sys, argv) => {
    let opt_path;
    if (argv.length === 0) {
        const tmp = waend_shell_1.getenv('DELIVERED');
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
    let ctxPath = [];
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
};
exports.command = {
    name: 'cc',
    command: cc
};
