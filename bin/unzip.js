"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var unzipper_1 = __importDefault(require("unzipper"));
var logger_1 = __importDefault(require("./logger"));
function unzip(inputPath, outputPath) {
    return new Promise(function (resolve, reject) {
        fs_1.createReadStream(inputPath)
            .pipe(unzipper_1.default.Extract({ path: outputPath }))
            .on("close", function () {
            resolve();
        })
            .on("error", function (err) {
            logger_1.default.verboseLog(err);
            reject("Error unzipping file at: " + inputPath);
        });
    });
}
exports.default = unzip;
