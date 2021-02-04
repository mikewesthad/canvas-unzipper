import { Command } from "commander";
import { isFileSync } from "./file-utils";
import logger from "./logger";
import { parse } from "path";

const version = process.env.npm_package_version ?? "unknown";

export default function parseCli() {
  const program = new Command();

  let studentWorkZip = "";
  let outputPath = "";
  program
    .version(version)
    .arguments("<pathToStudentWorkZip> <pathToOutputUnzippedWork>")
    .description("canvas-unzip", {
      pathToStudentWorkZip: "Path to a downloaded submissions zip from Canvas",
      pathToOutputUnzippedWork: "Path to output the unzipped and organized student work",
    })
    .option("-v, --verbose", "Output extra verbose information while unzipping student work.")
    .action((inPath, outPath, options) => {
      studentWorkZip = inPath;
      outputPath = outPath;
    });

  program.parse(process.argv);

  const isZip = parse(studentWorkZip).ext === ".zip";
  if (!studentWorkZip || !isFileSync(studentWorkZip) || !isZip) {
    logger.error("You need to provide a valid path to a zip of student work from Canvas.");
    process.exit(1);
  }

  const options = program.opts();
  const isVerbose = options.verbose ? true : false;

  return {
    studentWorkZip,
    isVerbose,
    outputPath,
  };
}
