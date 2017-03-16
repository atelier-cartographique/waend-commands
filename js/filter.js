"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const debug_1 = require("debug");
const logger = debug_1.default('waend:command:filter');
function filter(pattern, flags) {
    const self = this;
    const shell = self.shell;
    const stdin = self.sys.stdin;
    const stdout = self.sys.stdout;
    const stderr = self.sys.stderr;
    const re = new RegExp(pattern, flags);
    const resolver = (resolve, reject) => {
        let depth = 0;
        const end = () => {
            logger('end', depth);
            depth -= 1;
            if (depth <= 0) {
                resolve();
            }
        };
        const runFilter = () => {
            const line = stdin.read();
            if (!!line) {
                depth += 1;
                logger('inline', depth);
                line
                    .then(data => {
                    let match = false;
                    for (let i = 0; i < data.length; i++) {
                        const str = lodash_1.default.result(data[i], 'toString');
                        if (str && str.match(re)) {
                            match = true;
                            break;
                        }
                    }
                    if (match) {
                        stdout.write(...data);
                    }
                })
                    .catch(err => {
                    stderr.write(err);
                })
                    .finally(() => {
                    end();
                    runFilter();
                });
            }
            else {
                end();
            }
        };
        runFilter();
    };
    return self.end(resolver);
}
exports.default = {
    name: 'filter',
    command: filter
};
