import { TimeboxEvoRequest } from "../requests";
import { number2HexString } from "../helpers/utils";

/**
 * Options for the [[DateTimeCommand]]
 */
interface DateTimeOpts {
  date?: Date;
}

export class DateTimeCommand extends TimeboxEvoRequest {
  private _PACKAGE_PREFIX = "18";
  private _opts: DateTimeOpts = {
    date: new Date(),
  };

  constructor(opts?: DateTimeOpts) {
    super();
    this._opts = { ...this._opts, ...opts };
    this._updateMessage();
  }

  set date(date: Date) {
    this._opts.date = date;
    this._updateMessage();
  }

  get date(): Date {
    return this._opts.date;
  }

  private _updateMessage() {
    this.clear();
    let timeString =
      number2HexString(Number(this._opts.date.getFullYear().toString().padStart(4, "0").slice(2)))
      + number2HexString(Number(this._opts.date.getFullYear().toString().padStart(4, "0").slice(0, 2)))
      + number2HexString(this._opts.date.getMonth() + 1)
      + number2HexString(this._opts.date.getDate())
      + number2HexString(this._opts.date.getHours())
      + number2HexString(this._opts.date.getMinutes())
      + number2HexString(this._opts.date.getSeconds())
      + "00";
    this.push(
      this._PACKAGE_PREFIX + timeString
    );
  }
}
