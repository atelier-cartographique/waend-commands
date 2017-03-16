"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const bluebird_1 = require("bluebird");
const helpers_1 = require("../helpers");
function makeButtons(node, okCallback, cancelCallback) {
    const wrapper = document.createElement('div');
    const okBtn = helpers_1.makeButton('OK', {
        'class': 'button grp-button-ok push-validate'
    }, okCallback);
    const cancelBtn = helpers_1.makeButton('Cancel', {
        'class': 'button grp-button-cancel push-cancel'
    }, cancelCallback);
    helpers_1.addClass(wrapper, 'grp-button-wrapper');
    wrapper.appendChild(okBtn);
    wrapper.appendChild(cancelBtn);
    node.appendChild(wrapper);
}
function makeForm(node, label) {
    const form = document.createElement('div');
    const labelElement = document.createElement('div');
    const title = document.createElement('input');
    const desc = document.createElement('textarea');
    helpers_1.setAttributes(title, {
        'type': 'text',
        'class': 'grp-input-title',
        'placeholder': 'map name'
    });
    helpers_1.setAttributes(desc, {
        'class': 'grp-input-description',
        'rows': '7',
        'cols': '50',
        'placeholder': 'map description'
    });
    helpers_1.addClass(form, 'grp-form');
    helpers_1.addClass(labelElement, 'form-label');
    labelElement.innerHTML = label.toString();
    form.appendChild(labelElement);
    form.appendChild(title);
    form.appendChild(desc);
    node.appendChild(form);
    return {
        title,
        description: desc
    };
}
function createGroup(ctx, user, resolve, reject) {
    const binder = ctx.binder;
    const shell = ctx.shell;
    const terminal = shell.terminal;
    const display = terminal.display();
    const form = makeForm(display.node, 'Add a new map');
    const createOK = () => {
        const title = form.title.value;
        const desc = form.description.value;
        if ((title.length > 0) && (desc.length > 0)) {
            const data = {
                user_id: user.id,
                status_flag: 0,
                properties: {
                    'name': title,
                    'description': desc
                }
            };
            ctx.binder.setGroup(user.id, data)
                .then(model => {
                resolve(model);
                shell.exec(`cc /${user.id}/${model.id}`);
            })
                .catch(reject)
                .finally(() => {
                display.end();
            });
        }
    };
    const createCancel = () => {
        reject('Cancel');
        display.end();
    };
    makeButtons(display.node, createOK, createCancel);
}
function iCreate(groupName, groupDescription) {
    const self = this;
    const terminal = self.shell.terminal;
    const stdout = self.sys.stdout;
    const stdin = self.sys.stdin;
    const user = self.shell.getUser();
    if (!user) {
        return (bluebird_1.default.reject('You\'re not logged in.'));
    }
    const creator = lodash_1.default.partial(createGroup, self, user);
    return (new bluebird_1.default(creator));
}
exports.default = {
    name: 'mkgroup',
    command: iCreate
};
