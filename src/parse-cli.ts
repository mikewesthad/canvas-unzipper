import { Command } from "commander";
import { isDirSync } from "./file-utils";
import logger from "./logger";

const version = process.env.npm_package_version ?? "unknown";

export default function parseCli() {
  const program = new Command();

  let studentWorkDirectory = "";
  program
    .version(version)
    .arguments("<PathToStudentWork>")
    .option("-v, --verbose", "Output extra verbose information while unzipping student work.")
    .action((name, options, command) => {
      studentWorkDirectory = name;
    });

  program.parse(process.argv);

  if (!studentWorkDirectory || !isDirSync(studentWorkDirectory)) {
    logger.error("You need to provide a valid path to a directory of canvas student work.");
    process.exit(1);
  }

  const options = program.opts();
  const isVerbose = options.verbose ? true : false;

  return {
    studentWorkDirectory,
    isVerbose,
  };
}
