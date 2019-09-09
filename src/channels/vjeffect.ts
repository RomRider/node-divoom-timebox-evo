import { TimeboxEvoRequest } from "../requests";
import { number2HexString } from "../helpers/utils";
import { VJEffectType } from "../types";

/**
 * Options for the [[VJEffectChannel]]
 */
interface VJEffectOptions {
  type?: VJEffectType;
}

export class VJEffectChannel extends TimeboxEvoRequest {
  private _opts: VJEffectOptions = {
    type: 0
  };
  private _PACKAGE_PREFIX = "4503";

  /**
   * Generates the appropriate message to display the VJEffect Channel on the Divoom Timebox Evo
   * @param opts the VJEffect options
   */
  constructor(opts?: VJEffectOptions) {
    super();
    this._opts = { ...this._opts, ...opts };
    this._updateMessage();
  }

  /**
   * Updates the message queue based on the parameters used
   */
  private _updateMessage() {
    this.clear();
    this.push(this._PACKAGE_PREFIX + number2HexString(this._opts.type));
  }

  set type(type: number) {
    this._opts.type = type;
    this._updateMessage();
  }
  get type() {
    return this._opts.type;
  }
}
