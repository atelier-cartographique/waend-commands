"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pcc = (ctx, sys) => {
    const currentContext = ctx.resolve('');
    sys.stdout.write([{ text: currentContext }]);
    return ctx.end(currentContext);
};
exports.command = {
    name: 'pcc',
    command: pcc
};
