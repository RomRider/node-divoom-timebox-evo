import { TimeboxEvoMessageArray } from "../messages/message_array";
import { int2hexlittle, number2HexString } from "../helpers/utils";
import { TimeboxEvoMessage } from "../messages/message";
import Jimp from 'jimp';


export class JimpArray extends Array<DivoomJimpAnim | DivoomJimpStatic> {
  private constructor(items?: Array<DivoomJimpAnim | DivoomJimpStatic>) {
    super(...items)
  }
  static create(): JimpArray {
    return Object.create(JimpArray.prototype);
  }

  private _animAsDivoomMessages(): TimeboxEvoMessageArray {
    const _PACKAGE_PREFIX = '49';
    let dms = TimeboxEvoMessageArray.create();
    let fullString = '';
    let totalSize = 0;
    this.forEach(image => {
      const dm = image.asDivoomMessage()
      fullString += dm.payload;
      totalSize += dm.payload.length / 2;
    })
    let messageCounter = 0;
    const totalSizeHex = int2hexlittle(totalSize);
    fullString.match(/.{1,400}/g).forEach((message) => {
      dms.push(new TimeboxEvoMessage(
        _PACKAGE_PREFIX
        + totalSizeHex
        + number2HexString(messageCounter)
        + message
      ))
      messageCounter++;
    });
    return dms;
  }

  private _staticAsDivoomMessages(): TimeboxEvoMessageArray {
    const PACKAGE_PREFIX = '44000A0A04';
    let dms = TimeboxEvoMessageArray.create();
    dms.push(
      this[0].asDivoomMessage().prepend(PACKAGE_PREFIX)
    )
    return dms;
  }

  public asDivoomMessages(): TimeboxEvoMessageArray {
    if (this[0]) {
      if (this[0] instanceof DivoomJimpAnim) {
        return this._animAsDivoomMessages();
      } else if (this[0] instanceof DivoomJimpStatic) {
        return this._staticAsDivoomMessages();
      }
    } else {
      return TimeboxEvoMessageArray.create();
    }
  }

  public asBinaryBuffer(): Buffer[] {
    let bufferArray: Buffer[] = [];

    this.asDivoomMessages().forEach((message) => {
      bufferArray = bufferArray.concat(message.asBinaryBuffer());
    })
    return bufferArray;
  }
}

export class DivoomJimp extends Jimp {
  public getColorsAndPixels() {
    let colorsArray: string[] = [];
    let pixelArray: number[] = [];
    let colorCounter = 0;
    this.scan(0, 0, this.bitmap.width, this.bitmap.height, function (x: number, y: number, idx: number) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const color = red.toString(16).padStart(2, "0")
        + green.toString(16).padStart(2, "0")
        + blue.toString(16).padStart(2, "0");

      if (!colorsArray.includes(color)) {
        colorsArray.push(color);
        pixelArray[x + 16 * y] = colorCounter;
        colorCounter++;
      } else {
        pixelArray[x + 16 * y] = colorsArray.indexOf(color);
      }
    });
    return { colors: colorsArray, pixels: pixelArray };
  }

  /**
 * This builds the pixel string to use in a message
 * @param pixelArray the pixel array, each item being a reference to the color in the color array
 * @param nbColors the number of colors in the colors array
 * @returns the pixel sting to use in a message
 */
  public getPixelString(pixelArray: number[], nbColors: number): string {
    let nbBitsForAPixel = Math.log(nbColors) / Math.log(2);
    let bits = Number.isInteger(nbBitsForAPixel)
      ? nbBitsForAPixel
      : (Math.trunc(nbBitsForAPixel) + 1);
    if (bits === 0) bits = 1;

    let pixelString = '';
    pixelArray.forEach((pixel) => {
      pixelString += pixel.toString(2).padStart(8, '0').split("").reverse().join("").substring(0, bits);
    })

    let pixBinArray = pixelString.match(/.{1,8}/g);
    let pixelStringFinal = '';
    pixBinArray!.forEach((pixel) => {
      pixelStringFinal += parseInt(pixel.split("").reverse().join(""), 2).toString(16).padStart(2, '0');
    })

    return pixelStringFinal;
  }

  public asBinaryBuffer(): Buffer[] {
    return [];
  }
}

export class DivoomJimpAnim extends DivoomJimp {
  private _frame = 0;
  private _delay = 0;

  set frame(frame: number) {
    this._frame = frame;
  }
  get frame(): number {
    return this._frame;
  }
  set delay(delay: number) {
    this._delay = delay;
  }
  get delay() {
    return this._delay;
  }

  public asDivoomMessage(): TimeboxEvoMessage {
    let resetPalette = true
    let colorsAndPixels = this.getColorsAndPixels();

    const nbColorsHex = number2HexString(colorsAndPixels.colors.length % 256);
    const colorString = colorsAndPixels.colors.join("");
    const pixelString = this.getPixelString(colorsAndPixels.pixels, colorsAndPixels.colors.length);
    const delayHex = int2hexlittle(this.delay);
    const stringWithoutHeader =
      delayHex
      + (resetPalette ? "00" : "01")
      + nbColorsHex
      + colorString
      + pixelString

    const sizeHex = int2hexlittle((stringWithoutHeader.length + 6) / 2);
    const fullString =
      'aa' +
      sizeHex +
      stringWithoutHeader;
    return new TimeboxEvoMessage(fullString);
  }
}

export class DivoomJimpStatic extends DivoomJimp {
  public asDivoomMessage(): TimeboxEvoMessage {
    let colorsAndPixels = this.getColorsAndPixels();

    const nbColorsHex = number2HexString(colorsAndPixels.colors.length % 256);
    const colorString = colorsAndPixels.colors.join("");
    const pixelString = this.getPixelString(colorsAndPixels.pixels, colorsAndPixels.colors.length);
    const stringWithoutHeader =
      nbColorsHex
      + colorString
      + pixelString

    const sizeHex = int2hexlittle((('AA0000000000' + stringWithoutHeader).length) / 2);
    const fullString =
      'aa'
      + sizeHex
      + '000000'
      + stringWithoutHeader;
    return new TimeboxEvoMessage(fullString);
  }
}
