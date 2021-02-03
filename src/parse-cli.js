"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var file_utils_1 = require("./file-utils");
var package_json_1 = require("../package.json");
var logger_1 = __importDefault(require("./logger"));
function parseCli() {
    var program = new commander_1.Command();
    var studentWorkDirectory = "";
    program
        .version(package_json_1.version)
        .arguments("<PathToStudentWork>")
        .option("-v, --verbose", "Output extra verbose information while unzipping student work.")
        .action(function (name, options, command) {
        studentWorkDirectory = name;
    });
    program.parse(process.argv);
    if (!studentWorkDirectory || !file_utils_1.isDirSync(studentWorkDirectory)) {
        logger_1.default.error("You need to provide a valid path to a directory of canvas student work.");
        process.exit(1);
    }
    var options = program.opts();
    var isVerbose = options.verbose ? true : false;
    return {
        studentWorkDirectory: studentWorkDirectory,
        isVerbose: isVerbose,
    };
}
exports.default = parseCli;
