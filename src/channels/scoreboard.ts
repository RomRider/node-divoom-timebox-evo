import { TimeboxEvoRequest } from "../requests";
import { int2hexlittle } from "../helpers/utils";

/**
 * Options for the [[ScoreBoardChannel]]
 */
interface ScoreBoardOptions {
  red?: number;
  blue?: number;
}

export class ScoreBoardChannel extends TimeboxEvoRequest {
  private _opts: ScoreBoardOptions = {
    red: 0,
    blue: 0
  };
  private _PACKAGE_PREFIX = "450600";
  /**
   * Generates the appropriate message to display the scoreboard
   * @param opts The options for the channel
   */
  constructor(opts?: ScoreBoardOptions) {
    super();
    this.red = opts && opts.red ? opts.red : 0;
    this.blue = opts && opts.blue ? opts.blue : 0;
  }
  /**
   * Updates the message queue based on the parameters used
   */
  private _updateMessage() {
    this.clear();
    this.push(
      this._PACKAGE_PREFIX +
        int2hexlittle(this._opts.red) +
        int2hexlittle(this._opts.blue)
    );
  }

  /**
   * Sets the red player score
   */
  set red(int: number) {
    this._opts.red = Math.min(999, Math.max(0, int));
    this._updateMessage();
  }
  /**
   * Gets the red player score
   */
  get red() {
    return this._opts.red;
  }

  /**
   * Sets the blue player score
   */
  set blue(int: number) {
    this._opts.blue = Math.min(999, Math.max(0, int));
    this._updateMessage();
  }
  /**
   * Gets the blue player score
   */
  get blue() {
    return this._opts.blue;
  }
}
