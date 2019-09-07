import { TimeboxEvoRequest } from "../requests";
import { number2HexString } from "../utils";

interface BrightnessOpts {
  brightness?: number,
  in_min?: number,
  in_max?: number
}

export class BrightnessCommand extends TimeboxEvoRequest {
  private _opts: BrightnessOpts = {
    brightness: 100,
    in_min: 0,
    in_max: 100,
  }
  private _PACKAGE_PREFIX = "74";

  constructor(opts?: BrightnessOpts) {
    super();
    this._opts = { ...this._opts, ...opts }
    this._updateMessage();
  }

  set brightness(brightness: number) {
    this._opts.brightness = brightness;
    this._updateMessage();
  }
  get brightness(): number {
    return this._opts.brightness;
  }

  set in_min(in_min: number) {
    this._opts.in_min = in_min;
    this._updateMessage();
  }
  get in_min(): number {
    return this._opts.in_min;
  }

  set in_max(in_max: number) {
    this._opts.in_max = in_max;
    this._updateMessage();
  }
  get in_max(): number {
    return this._opts.in_max;
  }

  set opts(opts: BrightnessOpts) {
    this._opts = { ...this._opts, ...opts };
    this._updateMessage();
  }
  get opts(): BrightnessOpts {
    return this._opts;
  }

  private _updateMessage() {
    function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
      if (x < in_min || x > in_max) {
        throw new Error('map() in_min is < value or in_max > value')
      }
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    if ((this._opts.brightness > 100 || this._opts.brightness < 0) && (this._opts.in_min === undefined || this._opts.in_max === undefined)) {
      throw new Error('Brightness should be between 0 and 100 or in_min and in_max should be defined');
    }
    let briInRange = this._opts.brightness;
    if (this._opts.in_min !== undefined && this._opts.in_max !== undefined) {
      briInRange = Math.ceil(map(this._opts.brightness, this._opts.in_min, this._opts.in_max, 0, 100));
    }
    this.clear();
    this.push(
      this._PACKAGE_PREFIX
      + number2HexString(briInRange))
  }
}
