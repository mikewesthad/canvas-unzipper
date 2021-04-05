import { Command } from "commander";
import { isFileSync } from "./file-utils";
import logger from "./logger";
import { normalize, parse, format, FormatInputPathObject } from "path";

export default function parseCli() {
  const program = new Command();

  let studentWorkZip = "";
  let outputPath = "";
  program
    .version("1.0.1")
    .arguments("<pathToStudentWorkZip> [pathToOutputUnzippedWork]")
    .description("canvas-unzipper", {
      pathToStudentWorkZip: "Path to a downloaded submissions zip from Canvas",
      pathToOutputUnzippedWork:
        "Path to output the unzipped and organized student work. If not specified, this outputs to a folder at pathToStudentWorkZip (minus the .zip extension).",
    })
    .option("-v, --verbose", "Output extra verbose information while unzipping student work.")
    .action((inPath, outPath, options) => {
      studentWorkZip = inPath;
      outputPath = outPath;
    });

  program.parse(process.argv);

  studentWorkZip = normalize(studentWorkZip);
  const parsedPath = parse(studentWorkZip);
  const isZip = parsedPath.ext === ".zip";
  if (!studentWorkZip || !isFileSync(studentWorkZip) || !isZip) {
    logger.error("You need to provide a valid path to a zip of student work from Canvas.");
    process.exit(1);
  }

  if (!outputPath) {
    // Exclude the base and ext so that we get a path without the extension.
    const outPathObj: FormatInputPathObject = {
      root: parsedPath.root,
      dir: parsedPath.dir,
      name: parsedPath.name,
    };
    outputPath = format(outPathObj);
  }

  const options = program.opts();
  const isVerbose = options.verbose ? true : false;

  return {
    studentWorkZip,
    isVerbose,
    outputPath,
  };
}
