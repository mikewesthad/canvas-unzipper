"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var file_utils_1 = require("./file-utils");
var logger_1 = __importDefault(require("./logger"));
var path_1 = require("path");
function parseCli() {
    var program = new commander_1.Command();
    var studentWorkZip = "";
    var outputPath = "";
    program
        .version("1.0.1")
        .arguments("<pathToStudentWorkZip> <pathToOutputUnzippedWork>")
        .description("canvas-unzipper", {
        pathToStudentWorkZip: "Path to a downloaded submissions zip from Canvas",
        pathToOutputUnzippedWork: "Path to output the unzipped and organized student work",
    })
        .option("-v, --verbose", "Output extra verbose information while unzipping student work.")
        .action(function (inPath, outPath, options) {
        studentWorkZip = inPath;
        outputPath = outPath;
    });
    program.parse(process.argv);
    var isZip = path_1.parse(studentWorkZip).ext === ".zip";
    if (!studentWorkZip || !file_utils_1.isFileSync(studentWorkZip) || !isZip) {
        logger_1.default.error("You need to provide a valid path to a zip of student work from Canvas.");
        process.exit(1);
    }
    var options = program.opts();
    var isVerbose = options.verbose ? true : false;
    return {
        studentWorkZip: studentWorkZip,
        isVerbose: isVerbose,
        outputPath: outputPath,
    };
}
exports.default = parseCli;
