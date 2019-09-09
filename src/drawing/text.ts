import { TimeboxEvoRequest } from "../requests";
import { number2HexString, int2hexlittle } from "../helpers/utils";
import { ColorInput, TinyColor } from "@ctrl/tinycolor";
import { TimeboxEvoMessage } from "../messages/message";

interface DisplayTextOpts {
  text?: string,
  paletteFn?: Function,
  animFn?: Function
}

export class DisplayText extends TimeboxEvoRequest {
  private _animFrame = 0;
  private _opts: DisplayTextOpts = {
    text: "node-divoom-timebox-evo",
    paletteFn: this.PALETTE_TEXT_ON_BACKGROUND,
    animFn: this.ANIM_STATIC_BACKGROUND
  }

  public PALETTE_TEXT_ON_BACKGROUND(
    text: ColorInput = "FFFFFF",
    background: ColorInput = "000000"
  ): string[] {
    let back = (new TinyColor(background)).toHex();
    let front = (new TinyColor(text)).toHex();
    let palette: string[] = Array.from({ length: 256 }).fill(back, 0, 127) as string[]
    palette.fill(front, 127)
    return palette;
  }

  public PALETTE_BLACK_ON_CMY_RAINBOW() {
    let palette: string[] = [];
    let r = 255, g = 0, b = 255;
    for (let i = 0; i < 254; i += 2) {
      palette.push(number2HexString(r) + number2HexString(g) + number2HexString(b));
      if (i < 85) {
        b = Math.max(0, b - 6);
        g = Math.min(255, g + 6)
      } else if (i < 170) {
        b = Math.min(255, b + 6);
        r = Math.max(0, r - 6)
      } else {
        r = Math.min(255, r + 6)
        g = Math.max(0, g - 6)
      }
    }
    for (let i = palette.length; i < 256; i++) {
      palette.push("000000");
    }
    return palette;
  }

  public PALETTE_BLACK_ON_RAINBOW() {
    let palette: string[] = [];
    const size = 127;
    function sin_to_hex(i: number, phase: number) {
      let sin = Math.sin(Math.PI / size * 2 * i + phase);
      let int = Math.floor(sin * 127) + 128;
      return number2HexString(int);
    }

    for (let i = 0; i < size; i++) {
      let red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
      let blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
      let green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg
      palette.push(red + green + blue);
    }

    for (let i = palette.length; i < 256; i++) {
      palette.push("000000");
    }
    return palette;
  }

  public ANIM_STATIC_BACKGROUND(i?: number): number[] {
    return Array.from({ length: 256 }).fill(0) as number[];
  }

  public ANIM_UNI_GRADIANT_BACKGROUND(i: number): number[] {
    return Array.from({ length: 256 }).fill(i % 127) as number[];
  }

  public ANIM_HORIZONTAL_GRADIANT_BACKGROUND(frame: number): number[] {
    let pixelArray = [];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        pixelArray.push((x + frame) % 127)
      }
    }
    return pixelArray;
  }

  public ANIM_VERTICAL_GRADIANT_BACKGROUND(frame: number): number[] {
    let pixelArray = [];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        pixelArray.push((y + frame) % 127)
      }
    }
    return pixelArray;
  }

  constructor(opts?: DisplayTextOpts) {
    super();
    this._opts = { ...this._opts, ...opts };
    this._updateMessage();
  }

  private _encodeText(text: string): string {
    let length = number2HexString(text.length);
    let encodedText = "8601" + length;
    text.split("").forEach((char) => {
      encodedText += int2hexlittle(char.charCodeAt(0));
    })
    return encodedText;
  }

  private _updateMessage() {
    this.clear();
    const PACKAGE_INIT_MESSAGE = "6e01";
    if (typeof this._opts.animFn !== 'function' || typeof this._opts.paletteFn !== 'function') {
      throw new Error('paletteFn and animFn need to be functions')
    }
    this._animFrame = 0;
    this.push(PACKAGE_INIT_MESSAGE);
    this.push(this._encodeText(this._opts.text));

    const PALETTE_HEADER = "6c00000704aa070446000000";
    let pixels = '';
    const palette: string[] = this.colorPalette;

    this._opts.animFn(this._animFrame).forEach((pixel: number) => {
      pixels += number2HexString(pixel);
    });
    this._animFrame++;

    this.push(
      PALETTE_HEADER
      + palette.join("")
      + pixels
    );
    this.push(this.getNextAnimationFrame().payload);
  }

  public getNextAnimationFrame(): TimeboxEvoMessage {
    let pixelArray: number[] = this._opts.animFn(this._animFrame);
    if (pixelArray.length !== 256) throw new Error('The animFn should always generate a 256 pixel array')

    let pixelString = ''
    pixelArray.forEach(pixel => {
      pixelString += number2HexString(pixel);
    });

    let animString =
      "6c"
      + int2hexlittle(this._animFrame)
      + "0701aa070143000100"
      + pixelString
    this._animFrame = ++this._animFrame % 65536;
    return new TimeboxEvoMessage(animString)
  }

  get paletteFn(): Function {
    return this._opts.paletteFn;
  }
  set paletteFn(paletteFn: Function) {
    if (typeof paletteFn !== 'function') {
      throw new Error('paletteFn is not a function')
    }
    this._opts.paletteFn = paletteFn;
    this._updateMessage();
  }
  get colorPalette(): string[] {
    let palette = this.paletteFn();
    if (palette.length !== 256) {
      throw new Error('The paletteFn should always generate 256 colors')
    }
    let result: string[] = [];
    palette.forEach((color: ColorInput) => {
      const lColor = new TinyColor(color);
      if (!lColor.isValid) {
        throw new Error('One of your color is not valid')
      }
      result.push(lColor.toHex())
    });
    return result;
  }

  get animFn(): Function {
    return this._opts.animFn;
  }
  set animFn(animFn: Function) {
    if (typeof animFn !== 'function') {
      throw new Error('paletteFn is not a function')
    }
    this._opts.animFn = animFn;
    this._updateMessage();
  }
  get pixels(): number[] {
    return this.animFn(this._animFrame);
  }
  get frame(): number {
    return this._animFrame;
  }
  set text(text: string) {
    this._opts.text = text;
    this._updateMessage();
  }
  get text(): string {
    return this._opts.text;
  }
}
