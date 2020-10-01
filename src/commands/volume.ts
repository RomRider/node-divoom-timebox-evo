import { TimeboxEvoRequest } from "../requests";
import { number2HexString } from "../helpers/utils";

/**
 * Options for the [[VolumeCommand]]
 */
export interface VolumeOpts {
  volume?: number;
}

export class VolumeCommand extends TimeboxEvoRequest {
  private readonly _PACKAGE_PREFIX = "08";
  private readonly _VOLUME_MIN = 0;
  private readonly _VOLUME_MAX = 16;

  private _opts: VolumeOpts = {
    /**
     * Default is 1. Must be between 0 and 16.
     */
    volume: 1
  };

  /**
   * Generates the appropriate message to change the volume on the Divoom device.
   * @param opts the volume options
   */
  constructor(opts?: VolumeOpts) {
    super();
    this._opts = { ...this._opts, ...opts };
    this._updateMessage();
  }

  /**
   * Set the volume of the device. Must be between 0 and 16.
   */
  set volume(volume: number) {
    this._opts.volume = volume;
    this._updateMessage();
  }

  get volume(): number {
    return this._opts.volume;
  }

  private _updateMessage() {
    if (this._opts.volume < this._VOLUME_MIN || this._opts.volume > this._VOLUME_MAX) {
      throw new Error(`Volume should be between ${this._VOLUME_MIN} and ${this._VOLUME_MAX}.`);
    }

    this.clear();
    this.push(this._PACKAGE_PREFIX + number2HexString(this.volume));
  }
}
