"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc = (ctx, _sys, argv) => {
    if (argv.length === 0) {
        return ctx.endWithError(new Error('NothingToChangeTo'));
    }
    const opt_path = argv[0];
    const comps = ctx.resolve(opt_path).split('/').slice(1);
    return ctx.shell.switchContext(comps);
};
exports.command = {
    name: 'cc',
    command: cc
};
