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
    brightness: 100,
    power: true,
  }
  private _color: string;
  private _PACKAGE_PREFIX = "4501";
  private _PACKAGE_SUFFIX = "000000";

  /**
     * Generates the appropriate message to display the Lightning Channel on the Divoom Timebox Evo
     * @param opts the lightning options
     */
  constructor(opts?: LightningOpts) {
    super();
    this.color = opts && opts.color ? new TinyColor(opts.color) : new TinyColor("FFFFFF");
    this._opts = { ...this._opts, ...opts }
    this._updateMessage();
  }

  private _updateMessage() {
    this.clear();
    this.push(
      this._PACKAGE_PREFIX
      + color2HexString(this._color)
      + brightness2HexString(this._opts.brightness)
      + number2HexString(this._opts.type)
      + boolean2HexString(this._opts.power)
      + this._PACKAGE_SUFFIX
    )
  }

  set type(type: LightningType) {
    this._opts.type = type;
    this._updateMessage();
  }
  get type() {
    return this._opts.type;
  }

  set color(color: ColorInput) {
    const localcolor = new TinyColor(color);
    if (!localcolor.isValid) throw new Error(`Provided color ${localcolor} is not valid`)
    this._color = localcolor.toHex();
    this._updateMessage();
  }
  get color() {
    return this._color;
  }

  set power(bool: boolean) {
    this._opts.power = bool;
    this._updateMessage();
  }
  get power() {
    return this._opts.power;
  }

  set brightness(brightness: number) {
    this._opts.brightness = brightness;
    this._updateMessage();
  }
  get brightness() {
    return this._opts.brightness;
  }
}
