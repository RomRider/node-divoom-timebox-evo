import { DivoomTimeBoxRAW } from "../divoom_raw";
import { number2HexString, int2hexlittle } from "../utils";
import { ColorInput, TinyColor } from "@ctrl/tinycolor";
import { DivoomMessage } from "../message";

interface DisplayTextOpts {
  text?: string,
  paletteFn?: Function,
  animFn?: Function
}

export class DisplayText extends DivoomTimeBoxRAW {
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

  public ANIM_STATIC_BACKGROUND(i?: number): number[] {
    return Array.from({ length: 256 }).fill(0) as number[];
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
    const PALETTE_TRAILER = "00".repeat(256);
    let palette: string[] = this.colorPalette;

    this.push(
      PALETTE_HEADER
      + palette.join("")
      + PALETTE_TRAILER
    );
  }

  public getNextAnimationFrame(): DivoomMessage {
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
    return new DivoomMessage(animString)
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
}
