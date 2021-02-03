import * as chalk from "chalk";

class Logger {
  isVerbose = false;

  log(...args: any[]) {
    console.log(...args);
  }

  error(...args: any[]) {
    console.log(chalk.red(...args));
  }

  verboseLog(...args: any[]) {
    if (this.isVerbose) console.log(...args);
  }
}

const logger = new Logger();

export default logger;
export { Logger };
