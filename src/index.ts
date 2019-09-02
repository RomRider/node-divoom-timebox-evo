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

  /**
   * Generates the appropriate message to display an animation or an image on the Timebox
   * @param input a path to an image or a Buffer representing an image file
   * @returns A promise which resolves when the processing is done
   */
  public displayAnimation(input: Buffer | string): Promise<DivoomTimeBoxEvoProtocol> {
    this._messages = DivoomMessages.create();
    let buffer: Buffer;
    if (!Buffer.isBuffer(input)) {
      buffer = fs.readFileSync(input);
    } else {
      buffer = input;
    }
    let ft: fileType.FileTypeResult | undefined = fileType(buffer);

    ft = fileType(buffer);

    if (ft) {
      switch (ft.mime) {
        case 'image/gif':
          return this._displayAnimationFromGIF(buffer);
        case 'image/jpeg':
        case 'image/png':
        case 'image/bmp':
          return this._displayImage(buffer);
        default:
          throw new Error('file type not supported')
      }
    } else {
      throw new Error('file type unkown')
    }
  }

  /**
   * This builds the pixel string to use in a message
   * @param pixelArray the pixel array, each item being a reference to the color in the color array
   * @param nbColors the number of colors in the colors array
   * @returns the pixel sting to use in a message
   */
  private _getPixelString(pixelArray: number[], nbColors: number): string {
    let nbBitsForAPixel = Math.log(nbColors) / Math.log(2);
    let bits = Number.isInteger(nbBitsForAPixel)
      ? nbBitsForAPixel
      : (Math.trunc(nbBitsForAPixel) + 1);
    if (bits === 0) bits = 1;

    let pixelString = '';
    pixelArray.forEach((pixel) => {
      pixelString += pixel.toString(2).padStart(8, '0').split("").reverse().join("").substring(0, bits)
    })

    let pixBinArray = pixelString.match(/.{1,8}/g);
    let pixelStringFinal = '';
    pixBinArray!.forEach((pixel) => {
      pixelStringFinal += parseInt(pixel.split("").reverse().join(""), 2).toString(16).padStart(2, '0');
    })

    return pixelStringFinal;
  }

  /**
   * Returns the representation of a color array into a string usable dicrectly in a message
   * @param colorArray the color array, each color should be an int
   */
  private _getColorString(colorArray: number[]): string {
    var colorString = '';
    colorArray.forEach((color) => {
      colorString += color.toString(16).padStart(6, '0')
    })
    return colorString;
  }

  /**
   * This function generates the message when the a static image is used
   * @param input a Buffer representing an image file
   * @returns A promise which resolves when the processing is done
   */
  private _displayImage(input: Buffer): Promise<DivoomTimeBoxEvoProtocol> {
    const PACKAGE_PREFIX = '44000A0A04AA';
    return new Promise<DivoomTimeBoxEvoProtocol>((resolve, reject) => {
      Jimp.read(input).then(image => {
        let resized = image.resize(16, 16, Jimp.RESIZE_NEAREST_NEIGHBOR);
        let colorsHash: number[] = [];
        let colorArray: number[] = [];
        let colorCount = 0;
        let pixelArray: number[] = [];

        resized.scan(0, 0, resized.bitmap.width, resized.bitmap.height, function (x, y, idx) {
          let red = this.bitmap.data[idx + 0];
          let green = this.bitmap.data[idx + 1];
          let blue = this.bitmap.data[idx + 2];
          // let alpha = this.bitmap.data[idx + 3];
          let color = (red << 16) + (green << 8) + blue;

          if (!colorsHash[color] && colorsHash[color] !== 0) {
            colorsHash[color] = colorCount;
            colorArray.push(color);
            pixelArray[x + 16 * y] = colorCount;
            colorCount++;
          } else {
            pixelArray[x + 16 * y] = colorsHash[color];
          }
        })
        let nbColors = number2HexString(colorCount % 256);
        var colorString = this._getColorString(colorArray);
        let pixelString = this._getPixelString(pixelArray, colorCount);

        let length = int2hexlittle(('AA0000000000' + nbColors + colorString + pixelString).length / 2);
        this._queueMessage(
          new DivoomMessage(
            PACKAGE_PREFIX
            + length
            + '000000'
            + nbColors
            + colorString
            + pixelString
          )
        )
        resolve(this);
      })
        .catch(err => {
          reject(err);
        })
    })
  }

  /**
   * This function generates the message when the a static image is used
   * @param input Buffer representing an image file
   * @returns A promise which resolves when the processing is done
   */
  private _displayAnimationFromGIF(input: Buffer): Promise<DivoomTimeBoxEvoProtocol> {
    const PACKAGE_PREFIX = '49';
    this._gifFrame = [];
    return new Promise<DivoomTimeBoxEvoProtocol>((resolve, reject) => {
      let gifCodec = new gifWrap.GifCodec();
      gifCodec.decodeGif(input).then(inputGif => {
        //node.send({width: inputGif.width});
        let frameNb = 0;
        let totalSize = 0;
        let encodedString = '';

        inputGif.frames.forEach(frame => {
          let colorsArray: number[] = [];
          let colorCounter = 0;
          let frameColors: number[] = [];
          let pixelArray: number[] = [];
          let delay = frame.delayCentisecs * 10;
          // to Fix ?
          let resetPalette = true;

          let image = (gifWrap.GifUtil.copyAsJimp(Jimp, frame) as Jimp).resize(16, 16);
          image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x: number, y: number, idx: number) {
            // x, y is the position of this pixel on the image
            // idx is the position start position of this rgba tuple in the bitmap Buffer
            // this is the image

            let red = this.bitmap.data[idx + 0];
            let green = this.bitmap.data[idx + 1];
            let blue = this.bitmap.data[idx + 2];
            let color = (red << 16) + (green << 8) + blue;

            if (!colorsArray.includes(color)) {
              colorsArray.push(color);
              frameColors.push(color);
              pixelArray[x + 16 * y] = colorCounter;
              colorCounter++;
            } else {
              pixelArray[x + 16 * y] = colorsArray.findIndex(function (element) {
                return element === color;
              });
            }
          });

          this._gifFrame[frameNb] = {};
          this._gifFrame[frameNb].resetPalette = resetPalette;
          this._gifFrame[frameNb].pixelArray = pixelArray;
          this._gifFrame[frameNb].frameColors = frameColors;

          this._gifFrame[frameNb].nbColorsHex = number2HexString(colorCounter % 256);
          this._gifFrame[frameNb].colorString = this._getColorString(frameColors);
          this._gifFrame[frameNb].pixelString = this._getPixelString(pixelArray, colorCounter);
          this._gifFrame[frameNb].frame = frameNb;
          this._gifFrame[frameNb].delay = delay;
          this._gifFrame[frameNb].delayHex = int2hexlittle(this._gifFrame[frameNb].delay);

          this._gifFrame[frameNb].stringWithoutHeader =
            this._gifFrame[frameNb].delayHex +
            (resetPalette ? "00" : "01") +
            this._gifFrame[frameNb].nbColorsHex +
            this._gifFrame[frameNb].colorString +
            this._gifFrame[frameNb].pixelString;
          this._gifFrame[frameNb].size = (this._gifFrame[frameNb].stringWithoutHeader.length + 6) / 2;
          totalSize! += this._gifFrame[frameNb].size;
          this._gifFrame[frameNb].sizeHex = int2hexlittle(this._gifFrame[frameNb].size);
          this._gifFrame[frameNb].fullString =
            'aa' +
            this._gifFrame[frameNb].sizeHex +
            this._gifFrame[frameNb].stringWithoutHeader;

          encodedString! += this._gifFrame[frameNb].fullString;
          frameNb++;
        });

        let messageCounter = 0;
        let totalSizeHex = int2hexlittle(totalSize);
        encodedString.match(/.{1,400}/g).forEach((message) => {
          this._queueMessage(
            new DivoomMessage(
              PACKAGE_PREFIX
              + totalSizeHex
              + messageCounter.toString(16).padStart(2, '0')
              + message
            )
          )
          messageCounter++;
        });
        resolve(this);
      })
        .catch(err => {
          reject(err);
        })
    });
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
