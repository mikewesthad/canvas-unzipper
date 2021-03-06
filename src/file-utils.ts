import { existsSync, lstatSync, mkdirSync } from "fs";

/**
 * Make a directory at the given path, if it does not already exist. This will recursively make
 * non-existent directories in the path if needed.
 * @param path
 */
export function mkdirSyncIfNotExist(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

/**
 * Check if a file exists at the given path.
 * @param path
 */
export function isFileSync(path: string) {
  return existsSync(path) && lstatSync(path).isFile();
}

/**
 * Check if a directory exists at the given path.
 * @param path
 */
export function isDirSync(path: string) {
  return existsSync(path) && lstatSync(path).isDirectory();
}
