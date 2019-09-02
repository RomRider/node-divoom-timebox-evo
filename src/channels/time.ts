import { DivoomTimeBoxRAW } from "../divoom_raw";
import { TimeDisplayType } from "../types";
import { TinyColor, ColorInput } from "@ctrl/tinycolor";
import { number2HexString, boolean2HexString, color2HexString } from "../utils";

interface TimeOptions {
  type?: TimeDisplayType,
  color?: ColorInput,
  showTime?: boolean,
  showWeather?: boolean,
  showTemp?: boolean,
  showCalendar?: boolean,
}

export class TimeChannel extends DivoomTimeBoxRAW {
  private _opts: TimeOptions = {
    type: TimeDisplayType.FullScreen,
    color: new TinyColor("FFFFFF"),
    showTime: true,
    showWeather: false,
    showTemp: false,
    showCalendar: false,
  }
  private PACKAGE_PREFIX = "450001"

  constructor(opts?: TimeOptions) {
    super();
    let localcolor = opts && opts.color ? new TinyColor(opts.color) : new TinyColor("FFFFFF");
    if (!localcolor.isValid) {
      throw new Error(`Provided color ${localcolor} is not valid`)
    }
    this._opts = { ...this._opts, ...opts, ...{ color: localcolor } }
    this._updateMessage();
  }

  private _updateMessage() {
    this.clear();
    this.push(
      this.PACKAGE_PREFIX
      + number2HexString(this._opts.type)
      + boolean2HexString(this._opts.showTime)
      + boolean2HexString(this._opts.showWeather)
      + boolean2HexString(this._opts.showTemp)
      + boolean2HexString(this._opts.showCalendar)
      + color2HexString(this._opts.color as TinyColor)
    )
  }

  set type(type: TimeDisplayType) {
    this._opts.type = type;
    this._updateMessage();
  }
  get type() {
    return this._opts.type;
  }

  set color(color: ColorInput) {
    const localcolor = new TinyColor(color);
    if (!localcolor.isValid) throw new Error(`Provided color ${localcolor} is not valid`)
    this._opts.color = localcolor;
    this._updateMessage();
  }
  get color() {
    return this._opts.color;
  }

  set showTime(bool: boolean) {
    this._opts.showTime = bool;
    this._updateMessage();
  }
  get showTime() {
    return this._opts.showTime;
  }

  set showWeather(bool: boolean) {
    this._opts.showWeather = bool;
    this._updateMessage();
  }
  get showWeather() {
    return this._opts.showWeather;
  }

  set showTemp(bool: boolean) {
    this._opts.showTemp = bool;
    this._updateMessage();
  }
  get showTemp() {
    return this._opts.showTemp;
  }

  set showCalendar(bool: boolean) {
    this._opts.showCalendar = bool;
    this._updateMessage();
  }
  get showCalendar() {
    return this._opts.showCalendar;
  }
}
