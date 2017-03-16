"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const waend_lib_1 = require("waend-lib");
const waend_shell_1 = require("waend-shell");
const makeSpan = (data) => {
    return [
        {
            text: `${data.properties.name} (${data.score})`,
            commands: [`cc /${data.user_id}/${data.id}`]
        }
    ];
};
const printResult = (_ctx, sys) => (data) => {
    if (data.results) {
        const results = data.results.reduce((acc, result) => {
            if (!(result.id in acc)) {
                acc[result.id] = Object.assign({ score: 0 }, result);
            }
            acc[result.id].score += 1;
            return acc;
        }, {});
        const sortedResults = Object.keys(results)
            .map((k) => results[k])
            .sort((a, b) => a.score - b.score);
        sortedResults.forEach((result) => {
            sys.stdout.write(makeSpan(result));
        });
        return sortedResults;
    }
    return [];
};
const lookup = (ctx, sys, argv) => {
    if (argv.length === 0) {
        return Promise.reject(new Error('MissingArguments'));
    }
    const resolver = (resolve, reject) => {
        waend_lib_1.getconfig('apiUrl')
            .then((apiUrl) => {
            const transport = new waend_shell_1.Transport();
            const options = {
                url: `${apiUrl}/group/${argv[0]}`,
                parse: printResult(ctx, sys),
            };
            transport
                .get(options)
                .then(resolve)
                .catch(reject);
        })
            .catch(reject);
    };
    return (new Promise(resolver));
};
exports.command = {
    name: 'lookup',
    command: lookup
};
