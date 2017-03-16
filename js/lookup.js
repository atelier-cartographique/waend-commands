"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const bluebird_1 = require("bluebird");
const config_1 = require("../../config");
const Transport_1 = require("../Transport");
const API_URL = config_1.default.public.apiUrl;
function lookup(term) {
    if (!term) {
        return this.endWithError('this command expect a term to lookup argument');
    }
    const self = this;
    const stdout = self.sys.stdout;
    const shell = self.shell;
    const terminal = shell.terminal;
    const resolver = (resolve, reject) => {
        const transport = new Transport_1.default();
        const success = data => {
            if ('results' in data) {
                const groups = {};
                for (var i = 0; i < data.results.length; i++) {
                    var result = data.results[i];
                    if (!(result.id in groups)) {
                        groups[result.id] = {
                            model: result,
                            score: 1
                        };
                    }
                    else {
                        groups[result.id].score += 1;
                    }
                }
                const og = lodash_1.default.values(groups);
                og.sort((a, b) => b.score - a.score);
                for (var i = 0; i < og.length; i++) {
                    const result = og[i].model;
                    const score = og[i].score;
                    const props = result.properties;
                    const name = props.name || result.id;
                    const ctxPath = `/${result.user_id}/${result.id}`;
                    const cmd0 = terminal.makeCommand({
                        'args': [
                            `cc ${ctxPath}`,
                            'get'
                        ],
                        'text': `${name} (${score})`
                    });
                    stdout.write(cmd0);
                }
                resolve(data.medias);
            }
            else {
                reject(new Error('NothingFound'));
            }
        };
        const error = err => {
            reject(err);
        };
        transport
            .get(`${API_URL}/group/${term}`)
            .then(success)
            .catch(error);
    };
    return (new bluebird_1.default(resolver));
}
exports.default = {
    name: 'lookup',
    command: lookup
};
