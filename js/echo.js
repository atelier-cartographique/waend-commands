"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function echo() {
    const self = this;
    const shell = self.shell;
    const args = (arguments.length > 0) ? lodash_1.default.toArray(arguments) : self.sys.stdout.readSync();
    const e = !!args ? args.join(' ') : '';
    self.sys.stdout.write(e);
    return self.end(e);
}
exports.default = {
    name: 'echo',
    command: echo
};
