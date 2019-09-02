import { DivoomTimeBoxRAW } from "../divoom_raw";
import { int2hexlittle } from "../utils";

interface ScoreBoardOptions {
  red?: number,
  blue?: number,
}

export class ScoreBoardChannel extends DivoomTimeBoxRAW {
  private _opts: ScoreBoardOptions = {
    red: 0,
    blue: 0,
  }
  private _PACKAGE_PREFIX = "450600";
  /**
     * Generates the appropriate message to display the scoreboard
     * @param red the score for the red player (0 - 999)
     * @param blue the score for the blue player (0 - 999)
     */
  constructor(opts?: ScoreBoardOptions) {
    super();
    this.red = opts && opts.red ? opts.red : 0;
    this.blue = opts && opts.blue ? opts.blue : 0;
  }

  private _updateMessage() {
    this.clear();
    this.push(
      this._PACKAGE_PREFIX
      + int2hexlittle(this._opts.red)
      + int2hexlittle(this._opts.blue)
    )
  }

  set red(int: number) {
    this._opts.red = Math.min(999, Math.max(0, int));
    this._updateMessage();
  }
  get red() {
    return this._opts.red;
  }

  set blue(int: number) {
    this._opts.blue = Math.min(999, Math.max(0, int));
    this._updateMessage();
  }
  get blue() {
    return this._opts.blue;
  }
}
