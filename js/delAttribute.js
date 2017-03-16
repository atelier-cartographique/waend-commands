"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function delKey(obj, pathStr) {
    const path = pathStr.split('.');
    let key;
    for (let i = 0, len = path.length - 1; i < len; i++) {
        key = path.shift();
        obj = obj[key];
    }
    key = path.shift();
    delete obj[key];
}
function delAttr(key) {
    const data = this.data.getData();
    try {
        delKey(data, key);
    }
    catch (err) {
        return this.endWithError(err);
    }
    return this.data.setData(data);
}
exports.default = {
    name: 'del',
    command: delAttr
};
