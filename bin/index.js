#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var file_utils_1 = require("./file-utils");
var parse_cli_1 = __importDefault(require("./parse-cli"));
var logger_1 = __importDefault(require("./logger"));
var unzip_1 = __importDefault(require("./unzip"));
var tmp_1 = __importDefault(require("tmp"));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, isVerbose, studentWorkZip, outputPath, tmpDir, name, unzippedPath, err_1, files, studentNames, promises, filesProcessed;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = parse_cli_1.default(), isVerbose = _a.isVerbose, studentWorkZip = _a.studentWorkZip, outputPath = _a.outputPath;
                    logger_1.default.isVerbose = isVerbose;
                    logger_1.default.log("Unzipping \"" + studentWorkZip + "\" => \"" + outputPath + "\"");
                    // Create a temp directory to unzip to, which also removes itself when the process ends.
                    tmp_1.default.setGracefulCleanup();
                    tmpDir = tmp_1.default.dirSync({ unsafeCleanup: true, prefix: "CanvasUnzip_" });
                    name = path_1.parse(studentWorkZip).name;
                    unzippedPath = path_1.join(tmpDir.name, name);
                    logger_1.default.verboseLog("Unzipping " + studentWorkZip + " => " + unzippedPath);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, unzip_1.default(studentWorkZip, unzippedPath)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    logger_1.default.error(err_1);
                    process.exit(0);
                    return [3 /*break*/, 4];
                case 4:
                    // An empty unzip doesn't generate an error from unzipper, so detect failures by looking for the
                    // unzipped contents.
                    if (!fs_1.existsSync(unzippedPath)) {
                        logger_1.default.error("Unzipping failed for: " + studentWorkZip);
                    }
                    files = fs_1.readdirSync(unzippedPath);
                    if (files.length === 0) {
                        logger_1.default.error("No student work found in the zip: " + studentWorkZip);
                        process.exit(0);
                    }
                    // Build up a set of unique student names (lastnamefirstname) that are found in the given directory.
                    // This is done by assuming that the files named by canvas follow the convention:
                    //  lastnamefirstname_someid_someid_filename
                    // Just grab everything before the first "_" and assume that uniquely identifies a student. This
                    // isn't foolproof.
                    logger_1.default.verboseLog("Populating list of students...");
                    studentNames = new Set();
                    files.forEach(function (file) {
                        var studentName = file.split("_")[0];
                        if (studentName && !studentNames.has(studentName)) {
                            logger_1.default.verboseLog("  Found " + studentName + ", making an output directory for them.");
                            studentNames.add(studentName);
                            var studentFolder = path_1.join(outputPath, studentName);
                            file_utils_1.mkdirSyncIfNotExist(studentFolder);
                        }
                    });
                    logger_1.default.verboseLog(studentNames.size + "x students found.");
                    // Now that we've got a student list, start processing the zips and other files.
                    logger_1.default.verboseLog("\nProcessing student work...");
                    promises = [];
                    filesProcessed = 0;
                    files.forEach(function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var studentName, _a, ext, name, filePath, destPath, promise, err_2, destPath;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    studentName = file.split("_")[0];
                                    _a = path_1.parse(file), ext = _a.ext, name = _a.name;
                                    filePath = path_1.join(unzippedPath, file);
                                    // Skip directories or unknown students.
                                    if (!file_utils_1.isFileSync(filePath) || !studentNames.has(studentName))
                                        return [2 /*return*/];
                                    filesProcessed++;
                                    if (!(ext === ".zip")) return [3 /*break*/, 5];
                                    destPath = path_1.join(outputPath, studentName, name);
                                    // Copy the zip to the new student work folder.
                                    logger_1.default.verboseLog("  Found a zip from " + studentName + ", unzipping.");
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    promise = unzip_1.default(filePath, destPath);
                                    promises.push(promise);
                                    return [4 /*yield*/, promise];
                                case 2:
                                    _b.sent();
                                    logger_1.default.verboseLog("  Finished unzipping " + studentName + "'s work.");
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_2 = _b.sent();
                                    logger_1.default.error("Error unzipping " + studentName + "'s work.");
                                    return [3 /*break*/, 4];
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    destPath = path_1.join(outputPath, studentName, "" + name + ext);
                                    logger_1.default.verboseLog("  Found non-zipped work from " + studentName + ", copying to student folder.");
                                    fs_1.copyFileSync(filePath, destPath);
                                    _b.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 5:
                    _b.sent();
                    logger_1.default.log("Done! Unzipped " + filesProcessed + " files by " + studentNames.size + " students.");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) { return logger_1.default.error(e); });
