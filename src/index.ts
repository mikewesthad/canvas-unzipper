#!/usr/bin/env node

import { copyFileSync, createReadStream, readdirSync } from "fs";
import { join, parse } from "path";
import * as unzipper from "unzipper";
import { isFileSync, mkdirSyncIfNotExist } from "./file-utils";
import parseCli from "./parse-cli";
import logger from "./logger";

const { isVerbose, studentWorkDirectory } = parseCli();
logger.isVerbose = isVerbose;

const files = readdirSync(studentWorkDirectory);
if (files.length === 0) {
  logger.error(`No student work found at path: ${studentWorkDirectory}`);
  process.exit(0);
}

// Build up a set of unique student names (lastnamefirstname) that are found in the given directory.
// This is done by assuming that the files named by canvas follow the convention:
//  lastnamefirstname_someid_someid_filename
// Just grab everything before the first "_" and assume that uniquely identifies a student. This
// isn't foolproof.
logger.verboseLog(`Populating list of students...`);
const studentNames = new Set();
files.forEach((file) => {
  const studentName = file.split("_")[0];
  if (studentName && !studentNames.has(studentName)) {
    logger.verboseLog(`  Found ${studentName}, making an output directory for them.`);
    studentNames.add(studentName);
    const studentFolder = join(studentWorkDirectory, studentName);
    mkdirSyncIfNotExist(studentFolder);
  }
});
logger.verboseLog(`${studentNames.size}x students found.`);

// Now that we've got a student list, start processing the zips and other files.
logger.verboseLog(`\nProcessing student work...`);
files.forEach((file) => {
  const studentName = file.split("_")[0];
  const { ext, name } = parse(file);
  const studentFolder = join(studentWorkDirectory, studentName);
  const inputPath = join(studentWorkDirectory, file);
  const outputPath = join(studentFolder, name);

  // Skip directories or unknown students.
  if (!isFileSync(inputPath) || !studentNames.has(studentName)) return;

  if (ext === ".zip") {
    // Copy the zip to the new student work folder.
    logger.verboseLog(`  Found a zip from ${studentName}, unzipping.`);
    createReadStream(inputPath)
      .pipe(unzipper.Extract({ path: outputPath }))
      .on("close", () => {
        logger.verboseLog(`  Finished unzipping ${studentName}'s work.`);
      })
      .on("error", () => {
        logger.error(`Error unzipping ${studentName}'s work.`);
      });
  } else {
    logger.verboseLog(`  Found non-zipped work from ${studentName}, copying to student folder.`);
    copyFileSync(inputPath, outputPath);
  }
});
