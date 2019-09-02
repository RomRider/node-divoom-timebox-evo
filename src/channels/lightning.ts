import { DivoomTimeBoxRAW } from "../divoom_raw";
import { LightningType } from "../types";
import { ColorInput, TinyColor } from "@ctrl/tinycolor";
import { color2HexString, brightness2HexString, number2HexString, boolean2HexString } from "../utils";

interface LightningOpts {
  type?: LightningType,
  color?: ColorInput,
  brightness?: number,
  power?: boolean,

}

export class LightningChannel extends DivoomTimeBoxRAW {
  private _opts: LightningOpts = {
    type: LightningType.PlainColor,
    color: new TinyColor("#FFFFFF"),
    brightness: 100,
    power: true,
  }
  private _PACKAGE_PREFIX = "4501";
  private _PACKAGE_SUFFIX = "000000";

  /**
     * Generates the appropriate message to display the Lightning Channel on the Divoom Timebox Evo
     * @param opts the lightning options
     */
  constructor(opts?: LightningOpts) {
    super();
    let localcolor = opts && opts.color ? new TinyColor(opts.color) : new TinyColor("FFFFFF");
    if (!localcolor.isValid) {
      throw new Error(`Provided color ${localcolor} is not valid`)
    }
    this._opts = { ...this._opts, ...opts, ...{ color: localcolor } }

    this.push(
      this._PACKAGE_PREFIX
      + color2HexString(this._opts.color as TinyColor)
      + brightness2HexString(this._opts.brightness)
      + number2HexString(this._opts.type)
      + boolean2HexString(this._opts.power)
      + this._PACKAGE_SUFFIX
    )
  }
}
