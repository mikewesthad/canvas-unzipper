import { createReadStream } from "fs";
import unzipper from "unzipper";
import logger from "./logger";

export default function unzip(inputPath: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    createReadStream(inputPath)
      .pipe(unzipper.Extract({ path: outputPath }))
      .on("close", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.verboseLog(err);
        reject(`Error unzipping file at: ${inputPath}`);
      });
  });
}
