"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function listCommands() {
    const commands = this.commands;
    for (const k in commands) {
        this.sys.stdout.write(k);
    }
    return this.end();
}
exports.default = {
    name: 'lc',
    command: listCommands
};
