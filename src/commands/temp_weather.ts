import { TimeboxEvoRequest } from "../requests";
import { number2HexString } from "../utils";
import { WeatherType, TIMEBOX_CONST } from "../types";

interface TempWeatherOpts {
  temperature?: number,
  weather?: WeatherType,
}

export class TempWeatherCommand extends TimeboxEvoRequest {
  private _PACKAGE_PREFIX = "5F"
  private _opts: TempWeatherOpts = {
    temperature: 0,
    weather: TIMEBOX_CONST.WeatherType.Clear
  }

  constructor(opts?: TempWeatherOpts) {
    super();
    this._opts = { ...this._opts, ...opts };
    this.temperature = this._opts.temperature;
    this.weather = this._opts.weather;
  }

  set temperature(temp: number) {
    if (temp > 128 || temp < -127) {
      throw new Error('temp should be >= -127 and <= 128')
    }
    this._opts.temperature = temp;
    this._updateMessage();
  }
  get temperature() {
    return this._opts.temperature;
  }

  set weather(weather: WeatherType) {
    this._opts.weather = weather;
    this._updateMessage();
  }
  get weather() {
    return this._opts.weather;
  }

  private _updateMessage() {
    this.clear();
    let encodedTemp = ""
    if (this._opts.temperature >= 0) {
      encodedTemp = number2HexString(this._opts.temperature);
    } else {
      let value = 256 + this._opts.temperature
      encodedTemp = number2HexString(value);
    }
    this.push(
      this._PACKAGE_PREFIX
      + encodedTemp
      + number2HexString(this._opts.weather)
    )
  }
}
