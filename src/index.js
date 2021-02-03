#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var unzipper = __importStar(require("unzipper"));
var file_utils_1 = require("./file-utils");
var parse_cli_1 = __importDefault(require("./parse-cli"));
var logger_1 = __importDefault(require("./logger"));
var _a = parse_cli_1.default(), isVerbose = _a.isVerbose, studentWorkDirectory = _a.studentWorkDirectory;
logger_1.default.isVerbose = isVerbose;
var files = fs_1.readdirSync(studentWorkDirectory);
if (files.length === 0) {
    logger_1.default.error("No student work found at path: " + studentWorkDirectory);
    process.exit(0);
}
// Build up a set of unique student names (lastnamefirstname) that are found in the given directory.
// This is done by assuming that the files named by canvas follow the convention:
//  lastnamefirstname_someid_someid_filename
// Just grab everything before the first "_" and assume that uniquely identifies a student. This
// isn't foolproof.
logger_1.default.verboseLog("Populating list of students...");
var studentNames = new Set();
files.forEach(function (file) {
    var studentName = file.split("_")[0];
    if (studentName && !studentNames.has(studentName)) {
        logger_1.default.verboseLog("  Found " + studentName + ", making an output directory for them.");
        studentNames.add(studentName);
        var studentFolder = path_1.join(studentWorkDirectory, studentName);
        file_utils_1.mkdirSyncIfNotExist(studentFolder);
    }
});
logger_1.default.verboseLog(studentNames.size + "x students found.");
// Now that we've got a student list, start processing the zips and other files.
logger_1.default.verboseLog("\nProcessing student work...");
files.forEach(function (file) {
    var studentName = file.split("_")[0];
    var _a = path_1.parse(file), ext = _a.ext, name = _a.name;
    var studentFolder = path_1.join(studentWorkDirectory, studentName);
    var inputPath = path_1.join(studentWorkDirectory, file);
    var outputPath = path_1.join(studentFolder, name);
    // Skip directories or unknown students.
    if (!file_utils_1.isFileSync(inputPath) || !studentNames.has(studentName))
        return;
    if (ext === ".zip") {
        // Copy the zip to the new student work folder.
        logger_1.default.verboseLog("  Found a zip from " + studentName + ", unzipping.");
        fs_1.createReadStream(inputPath)
            .pipe(unzipper.Extract({ path: outputPath }))
            .on("close", function () {
            logger_1.default.verboseLog("  Finished unzipping " + studentName + "'s work.");
        })
            .on("error", function () {
            logger_1.default.error("Error unzipping " + studentName + "'s work.");
        });
    }
    else {
        logger_1.default.verboseLog("  Found non-zipped work from " + studentName + ", copying to student folder.");
        fs_1.copyFileSync(inputPath, outputPath);
    }
});
