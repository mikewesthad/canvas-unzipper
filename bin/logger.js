"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var chalk_1 = __importDefault(require("chalk"));
var Logger = /** @class */ (function () {
    function Logger() {
        this.isVerbose = false;
    }
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, args);
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log(chalk_1.default.red.apply(chalk_1.default, args));
    };
    Logger.prototype.verboseLog = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.isVerbose)
            console.log.apply(console, args);
    };
    return Logger;
}());
exports.Logger = Logger;
var logger = new Logger();
exports.default = logger;
