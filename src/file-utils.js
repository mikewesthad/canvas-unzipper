"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirSync = exports.isFileSync = exports.mkdirSyncIfNotExist = void 0;
var fs_1 = require("fs");
/**
 * Make a directory at the given path, if it does not already exist.
 * @param path
 */
function mkdirSyncIfNotExist(path) {
    if (!fs_1.existsSync(path))
        fs_1.mkdirSync(path);
}
exports.mkdirSyncIfNotExist = mkdirSyncIfNotExist;
/**
 * Check if a file exists at the given path.
 * @param path
 */
function isFileSync(path) {
    return fs_1.existsSync(path) && fs_1.lstatSync(path).isFile();
}
exports.isFileSync = isFileSync;
/**
 * Check if a directory exists at the given path.
 * @param path
 */
function isDirSync(path) {
    return fs_1.existsSync(path) && fs_1.lstatSync(path).isDirectory();
}
exports.isDirSync = isDirSync;
