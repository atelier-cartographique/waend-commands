"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyncHandler_1 = require("./SyncHandler");
function notify() {
    const self = this;
    const shell = self.shell;
    const stdout = self.sys.stdout;
    const terminal = shell.terminal;
    const container = document.createElement('div');
    const sync = new SyncHandler_1.default(container, self);
    const wc = terminal.makeCommand({
        fragment: container,
        text: 'notifications'
    });
    stdout.write(wc);
    sync.start();
    return self.end();
}
exports.default = {
    name: 'notify',
    command: notify
};
