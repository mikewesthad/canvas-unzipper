#!/usr/bin/env node

import { copyFileSync, createReadStream, existsSync, readdirSync } from "fs";
import { join, parse } from "path";
import { isFileSync, mkdirSyncIfNotExist } from "./file-utils";
import parseCli from "./parse-cli";
import logger from "./logger";
import unzip from "./unzip";
import tmp from "tmp";

async function main() {
  const { isVerbose, studentWorkZip, outputPath } = parseCli();
  logger.isVerbose = isVerbose;

  // Create a temp directory to unzip to, which also removes itself when the process ends.
  tmp.setGracefulCleanup();
  const tmpDir = tmp.dirSync({ unsafeCleanup: true, prefix: "CanvasUnzip_" });

  // Unzip the Canvas submissions download.
  const { name } = parse(studentWorkZip);
  const unzippedPath = join(tmpDir.name, name);
  logger.verboseLog(`Unzipping ${studentWorkZip} => ${unzippedPath}`);
  try {
    await unzip(studentWorkZip, unzippedPath);
  } catch (err) {
    logger.error(err);
    process.exit(0);
  }

  // An empty unzip doesn't generate an error from unzipper, so detect failures by looking for the
  // unzipped contents.
  if (!existsSync(unzippedPath)) {
    logger.error(`Unzipping failed for: ${studentWorkZip}`);
  }

  // Check that there is actually student work in the unzip.
  const files = readdirSync(unzippedPath);
  if (files.length === 0) {
    logger.error(`No student work found in the zip: ${studentWorkZip}`);
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
      const studentFolder = join(outputPath, studentName);
      mkdirSyncIfNotExist(studentFolder);
    }
  });
  logger.verboseLog(`${studentNames.size}x students found.`);

  // Now that we've got a student list, start processing the zips and other files.
  logger.verboseLog(`\nProcessing student work...`);
  files.forEach(async (file) => {
    const studentName = file.split("_")[0];
    const { ext, name } = parse(file);
    const studentFolder = join(unzippedPath, studentName);
    const filePath = join(unzippedPath, file);

    // Skip directories or unknown students.
    if (!isFileSync(filePath) || !studentNames.has(studentName)) return;

    if (ext === ".zip") {
      const destPath = join(outputPath, studentName, name);
      // Copy the zip to the new student work folder.
      logger.verboseLog(`  Found a zip from ${studentName}, unzipping.`);
      try {
        await unzip(filePath, destPath);
        logger.verboseLog(`  Finished unzipping ${studentName}'s work.`);
      } catch (err) {
        logger.error(`Error unzipping ${studentName}'s work.`);
      }
    } else {
      const destPath = join(outputPath, studentName, `${name}${ext}`);
      logger.verboseLog(`  Found non-zipped work from ${studentName}, copying to student folder.`);
      copyFileSync(filePath, destPath);
    }
  });
}

main().catch((e) => logger.verboseLog(e));
