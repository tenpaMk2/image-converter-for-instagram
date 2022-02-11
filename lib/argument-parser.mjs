/**
 * argument parser
 */

import { Command, InvalidArgumentError, Option } from "commander";
import fs from "fs";

const isValidPath = (mypath) => !/[<>:"|?*]/.test(mypath);

/**
 * argument parser
 */
export class ArgumentParser {
  /**
   * argument parser for path.
   * @param {string} mypath
   * @returns {string}
   */
  parsePath(mypath, dummyPrevious) {
    if (!isValidPath(mypath)) {
      throw new InvalidArgumentError("Not a valid path.");
    }
    return mypath;
  }

  /**
   * argument parser for exist path.
   * @param {string} mypath
   * @returns {string}
   */
  parseExistedPath(mypath, dummyPrevious) {
    if (!fs.existsSync(mypath)) {
      throw new InvalidArgumentError("Not a existed path.");
    }
    return mypath;
  }

  /**
   * parse argument
   * @param {string[]} argv - `process.argv`
   * @returns {Object.<string,any >}
   */
  parse(argv) {
    /**
     * command parser
     */
    const program = new Command();

    program
      .addOption(
        new Option("-i, --input <path>", "input directory path.")
          .argParser(this.parseExistedPath)
          .makeOptionMandatory()
      )
      .addOption(
        new Option("-o, --output <path>", "output directory path.")
          .argParser(this.parsePath)
          .makeOptionMandatory()
      )
      .parse(process.argv);

    return program.opts();
  }
}

export default new ArgumentParser();
