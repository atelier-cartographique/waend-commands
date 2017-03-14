"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const querystring_1 = require("querystring");
const waend_shell_1 = require("waend-shell");
const login = (ctx, sys, argv) => {
    const transport = new waend_shell_1.Transport();
    const shell = ctx.shell;
    const stdout = sys.stdout;
    const stdin = sys.stdin;
    const binder = waend_shell_1.Context.binder;
    const loginUrl = waend_shell_1.getenv('LOGIN_URL');
    if (!loginUrl) {
        return Promise.reject(new Error('NoLoginUrlOnEnv'));
    }
    const remoteLogin = (username, password) => {
        const options = {
            url: loginUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring_1.stringify({ username, password }),
            parse: () => { },
        };
        return transport.post(options)
            .then(() => (binder.getMe()
            .then(user => {
            shell.loginUser(user);
            const cmd1 = {
                commands: [`cc /${user.id}`, 'get'],
                text: 'my public infos'
            };
            const cmd2 = {
                commands: [`cc /${user.id}`, 'lg'],
                text: 'my maps'
            };
            stdout.write([cmd1, cmd2]);
            return user;
        })));
    };
    if (argv.length >= 2) {
        return remoteLogin(argv[0], argv[1]);
    }
    else if (argv.length === 1) {
        stdout.write([{ text: 'password:' }]);
        return (stdin.read()
            .then((span) => remoteLogin(argv[0], span[0].text)));
    }
    stdout.write([{ text: 'e-mail:' }]);
    return (stdin.read()
        .then((spanUsername) => {
        const username = spanUsername[0].text;
        stdout.write([{ text: 'password:' }]);
        stdin.read()
            .then(spanPassword => {
            const password = spanPassword[0].text;
            return remoteLogin(username, password);
        });
    }));
};
exports.command = {
    name: 'login',
    command: login
};
