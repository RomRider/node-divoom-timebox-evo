import { WeatherType } from "./types";
import { int2hexlittle, color2HexString, brightness2HexString, number2HexString, boolean2HexString } from "./utils";
import { TinyColor } from "@ctrl/tinycolor";
import { DivoomMessages } from "./message_array";
import { DivoomMessage } from "./message";
import fileType from "file-type";
import Jimp from 'jimp';
import gifWrap from 'gifwrap';
import fs from "fs";
import { DivoomTimeBoxRAW } from "./divoom_raw";
import { TimeChannel, LightningChannel, VJEffectChannel, ScoreBoardChannel, CloudChannel, CustomChannel } from "./channels/exports";
export * from "./channels/exports"
export * from "./commands/exports"
export * from "./divoom_raw"
export { DivoomConst } from "./types";

export class DivoomTimeBoxEvo {
  constructor(type?: string, opts?: any) {
    if (!type) return new DivoomTimeBoxRAW;
    switch (type.toLowerCase()) {
      case "time":
        return new TimeChannel(opts);
      case "lightning":
        return new LightningChannel(opts);
      case "vj-effect":
      case "vjeffect":
        return new VJEffectChannel(opts);
      case "scoreboard":
        return new ScoreBoardChannel(opts);
      case "cloud":
        return new CloudChannel;
      case "custom":
        return new CustomChannel;
      case "raw":
        return new DivoomTimeBoxRAW;
      default:
        throw new Error('Unkown type');
    }
  }
}

export class DivoomTimeBoxEvoProtocol {
  private _messages: DivoomMessages = DivoomMessages.create();
  private _gifFrame: any[] = [];
  private _textAnimFn: Function;
  private _textAnimFrame: number = 0;
  private _textAnimPalette: string[] = [];

  private _queueMessage(msg: DivoomMessage): void {
    this._messages.push(msg);
  }

  /**
   * Generates the appropriate message to set the temperature and the weather
   * @param temp temperature to set (`-127 <= temp <= 128`)
   * @param weatherType type of weather to set
   */
  public setTempAndWeatherPackage(temp: number, weatherType: WeatherType) {
    this._messages = DivoomMessages.create();
    const PACKAGE_PREFIX = "5F"
    if (temp > 128 || temp < -127) {
      throw new Error('temp should be >= -127 and <= 128')
    }
    let encodedTemp = ""
    if (temp >= 0) {
      encodedTemp = number2HexString(temp);
    } else {
      let value = 256 + temp
      encodedTemp = number2HexString(value);
    }
    this._queueMessage(
      new DivoomMessage(
        PACKAGE_PREFIX
        + encodedTemp
        + number2HexString(weatherType)
      )
    );
  }

  /**
   * Generates the appropiate message to set the brightness on the Timebox
   * @param brightness brightness (`0 - 100`) if `in_min` or `in_max` are undefined, else `in_min <= brightness <= in_max`
   * @param in_min
   * @param in_max
   */
  public setBrightness(
    brightness: number,
    in_min?: number,
    in_max?: number,
  ) {
    this._messages = DivoomMessages.create();
    const PACKAGE_PREFIX = "74"

    function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
      if (x < in_min || x > in_max) {
        throw new Error('map() in_min is < value or in_max > value')
      }
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    let briInRange = brightness;
    if (in_min !== undefined && in_max !== undefined) {
      briInRange = Math.ceil(map(brightness, in_min, in_max, 0, 100));
    }
    if ((brightness > 100 || brightness < 0) && (in_min === undefined || in_max === undefined)) {
      throw new Error('Brightness should be between 0 and 100 or in_min and in_max should be defined');
    }
    this._queueMessage(
      new DivoomMessage(
        PACKAGE_PREFIX
        + number2HexString(briInRange)
      )
    );
  }

  /**
   * Generates the full message, properly split which will be ready to be send to Divoom
   * @param msg the string or Buffer that you want to encode before sending to Divoom
   */
  public createRAWPackage(msg: string) {
    this._messages = DivoomMessages.create();
    this._queueMessage(
      new DivoomMessage(msg)
    );
  }

  /**
   * @returns The an array of strings of all the messages which should be sent
   */
  get messages(): DivoomMessages {
    return this._messages;
  }

  private _encodeText(text: string): string {
    let length = number2HexString(text.length);
    let encodedText = "8601" + length;
    text.split("").forEach((char) => {
      encodedText += int2hexlittle(char.charCodeAt(0));
    })
    return encodedText;
  }

  public buildTextPackage(text: string, paletteFn: Function, animFn: Function) {
    this._messages = DivoomMessages.create();
    if (typeof paletteFn !== 'function' || typeof animFn !== 'function') {
      throw new Error('paletteFn and animFn need to be functions')
    }
    this._textAnimFn = animFn;
    this._textAnimFrame = 0;

    const PACKAGE_INIT_MESSAGE = "6e01";
    this._messages = DivoomMessages.create();
    this._queueMessage(new DivoomMessage(PACKAGE_INIT_MESSAGE));
    this._queueMessage(new DivoomMessage(this._encodeText(text)));

    const PALETTE_HEADER = "6c00000704aa070446000000";
    const PALETTE_TRAILER = "00".repeat(256);
    let palette: TinyColor[] = paletteFn();

    if (palette.length !== 256) {
      throw new Error('The paletteFn should always generate 256 colors')
    }
    let paletteArray: string[] = [];
    palette.forEach(color => {
      let tc = new TinyColor(color);
      if (!tc.isValid) throw new Error('One of your color is not valid')
      paletteArray.push(tc.toHex())
    })
    this._textAnimPalette = paletteArray;
    let paletteString = paletteArray.join("");
    this._queueMessage(
      new DivoomMessage(
        PALETTE_HEADER
        + paletteString
        + PALETTE_TRAILER
      )
    );
  }

  public getNextTextAnimationFrame(): Buffer[] {
    let pixelArray: number[] = this._textAnimFn(this._textAnimFrame);
    if (pixelArray.length !== 256) throw new Error('The animFn should always generate a 256 pixel array')

    let pixelString = ''
    pixelArray.forEach(pixel => {
      pixelString += number2HexString(pixel);
    });

    let animString = "6c"
      + int2hexlittle(this._textAnimFrame % 65536)
      + "0701aa070143000100"
      + pixelString
    this._textAnimFrame++;
    let message = new DivoomMessage(animString);
    let msgs = DivoomMessages.create();
    msgs.push(message);
    return msgs.asBinaryBuffer();
  }

  public getAnimPalette(): string[] {
    return this._textAnimPalette;
  }
}
