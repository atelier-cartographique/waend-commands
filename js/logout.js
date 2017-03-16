"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transport_1 = require("../Transport");
const bluebird_1 = require("bluebird");
const config_1 = require("../../config");
function logout() {
    const self = this;
    const transport = new Transport_1.default();
    const shell = self.shell;
    const resolver = (resolve, reject) => {
        transport.post(config_1.default.public.logoutUrl, {
            body: {}
        })
            .then(() => {
            shell.logoutUser();
            resolve();
        })
            .catch(reject);
    };
    return (new bluebird_1.default(resolver));
}
exports.default = {
    name: 'logout',
    command: logout
};
