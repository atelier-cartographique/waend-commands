"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
function read() {
    const self = this;
    const shell = self.shell;
    const stdin = self.sys.stdin;
    const stdout = self.sys.stdout;
    const res = (resolve, reject) => {
        shell.terminal.input(stdin);
        stdin.read()
            .then(line => {
            stdout.write(line);
            resolve();
        })
            .catch(reject);
    };
    return (new bluebird_1.default(res));
}
exports.default = {
    name: 'read',
    command: read
};
