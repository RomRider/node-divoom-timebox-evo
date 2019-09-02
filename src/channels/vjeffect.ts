import { DivoomTimeBoxRAW } from "../divoom_raw";
import { number2HexString } from "../utils";
import { VJEffectType } from "../types";

interface VJEffectOptions {
  type?: VJEffectType,
}

export class VJEffectChannel extends DivoomTimeBoxRAW {
  private _opts: VJEffectOptions = {
    type: 0,
  }
  private _PACKAGE_PREFIX = "4503";

  constructor(opts?: VJEffectOptions) {
    super();
    this._opts = { ...this._opts, ...opts }
    this._updateMessage();
  }

  private _updateMessage() {
    this.clear();
    this.push(
      this._PACKAGE_PREFIX
      + number2HexString(this._opts.type)
    )
  }

  set type(type: number) {
    this._opts.type = type;
    this._updateMessage();
  }
  get type() {
    return this._opts.type;
  }
}
