import { LightningType, TimeDisplayType, WeatherType } from "./types";
import { int2hexlittle, unhexlify } from "./utils";
import { TinyColor } from "@ctrl/tinycolor";
import fileType from "file-type";
import Jimp from 'jimp';
import gifWrap from 'gifwrap';
import fs from "fs";
import { resolve } from "dns";

export class DivoomTimeBoxEvoProtocol {
  private PREFIX = "01";
  private SUFFIX = "02";

  private _message: string | undefined;
  private _length: string | undefined;
  private _crc: string | undefined;
  private _fullMessage: string[] = [];
  private _gifFrame: any[] = [];
  private _textAnimFn: Function;
  private _textAnimFrame: number = 0;
  private _textAnimPalette: string[] = [];

  private _setMessage(msg: string | Buffer): void {
    if (msg === undefined) {
      return;
    }
    let localmsg: string | undefined;
    if (Buffer.isBuffer(msg)) {
      localmsg = msg.toString('ascii');
    } else {
      localmsg = msg.toLowerCase();
    }
    this._length = int2hexlittle((msg.length + 4) / 2);
    this._setCRC(this._length + localmsg);
    this._message = localmsg;
    let fullMessage: string[] = [];
    let message: string = this.PREFIX + this._length + this._message + this._crc + this.SUFFIX;
    if (message) {
      message.match(/.{1,1332}/g)!.forEach((slice) => {
        fullMessage.push(slice);
      })
    }
    this._fullMessage = fullMessage;
  }

  private _queueMessage(msg: string | Buffer): void {
    if (msg === undefined) {
      return;
    }
    let localmsg: string | undefined;
    if (Buffer.isBuffer(msg)) {
      localmsg = msg.toString('ascii');
    } else {
      localmsg = msg.toLowerCase();
    }
    this._length = int2hexlittle((msg.length + 4) / 2);
    this._setCRC(this._length + localmsg);
    this._message = localmsg;
    let message: string = this.PREFIX + this._length + this._message + this._crc + this.SUFFIX;
    if (message) {
      message.match(/.{1,1332}/g)!.forEach((slice) => {
        this._fullMessage.push(slice);
      })
    }
  }

  private _setCRC(msg: string): void {
    if (msg !== undefined) {
      let sum = 0;
      for (let i: number = 0, l: number = msg.length; i < l; i += 2) {
        sum += parseInt(msg.substr(i, 2), 16)
      }
      this._crc = int2hexlittle(sum % 65536);
    }
  }

  private _string2BinBuffer(msg: string[] | undefined): Buffer[] | undefined {
    if (msg === undefined) {
      return undefined;
    }
    let bufferArray: Buffer[] = [];
    msg.forEach((slice) => {
      bufferArray.push(new Buffer(unhexlify(slice), 'binary'));
    })
    return bufferArray;
  }

  private _boolean2HexString(bool: boolean): string {
    return bool ? "01" : "00";
  }

  private _number2HexString(int: number): string {
    if (int > 255 || int < 0) {
      throw new Error('_number2HexString works only with number between 0 and 255')
    }

    return Math.round(int).toString(16).padStart(2, "0");
  }

  private _color2HexString(color: TinyColor): string {
    return color.toHex();
  }

  private _brightness2HexString(brightness: number): string {
    if (brightness > 100) {
      brightness = 100;
    } else if (brightness < 0) {
      brightness = 0;
    }
    return this._number2HexString(Math.trunc(brightness));
  }

  /**
   * Generates the appropriate message to display the Time Channel on the Divoom Timebox Evo
   * @param type type of time to display:
   * @param color the color to display, can be of any type supported by [TinyColor]
   * @param showTime show the time?
   * @param showWeather show the weather?
   * @param showTemp show the temperature?
   * @param showCalendar show the calendar?
   */
  public displayTimePackage(
    type: TimeDisplayType = 0,
    color: any = "#FFFFFF",
    showTime: boolean = true,
    showWeather: boolean = false,
    showTemp: boolean = false,
    showCalendar: boolean = false,
  ) {
    const PACKAGE_PREFIX = "450001"
    let localColor = new TinyColor(color);
    if (!localColor.isValid) {
      throw new Error(`Provided color ${color} is not valid`)
    }
    this._setMessage(
      PACKAGE_PREFIX
      + this._number2HexString(type)
      + this._boolean2HexString(showTime)
      + this._boolean2HexString(showWeather)
      + this._boolean2HexString(showTemp)
      + this._boolean2HexString(showCalendar)
      + this._color2HexString(localColor)
    )
  }

  /**
   * Generates the appropriate message to display the Lightning Channel on the Divoom Timebox Evo
   * @param type type of lightning you want to display
   * @param color the color to display, can be of any type supported by [TinyColor]
   * @param brightness brightness `0` - `100` range
   * @param power if `false`, the display is turned off
   */
  public displayLightningPackage(
    type: LightningType = 0,
    color: any = "#FFFFFF",
    brightness: number = 100,
    power: boolean = true,
  ) {
    const PACKAGE_PREFIX = "4501";
    const PACKAGE_SUFFIX = "000000";

    let localColor = new TinyColor(color);
    if (!localColor.isValid) {
      throw `Provided color ${color} is not valid`
    }

    this._setMessage(
      PACKAGE_PREFIX
      + this._color2HexString(localColor)
      + this._brightness2HexString(brightness)
      + this._number2HexString(type)
      + this._boolean2HexString(power)
      + PACKAGE_SUFFIX
    )
  }

  /**
   * Generates the appropriate message to display the Cloud Channel
   */
  public displayCloudPackage() {
    this._setMessage("4502");
  }

  /**
   * Generates the appropriate message to display the VJ Effects Channel
   * @param type type of Effect to display
   */
  public displayVJEffectsPackage(type: number = 0) {
    const PACKAGE_PREFIX = "4503";

    this._setMessage(
      PACKAGE_PREFIX
      + this._number2HexString(type)
    );
  }

  /**
   * Generates the appropriate message to display the scoreboard
   * @param red the score for the red player (0 - 999)
   * @param blue the score for the blue player (0 - 999)
   */
  public displayScoreBoardPackage(red: number = 0, blue: number = 0) {
    const PACKAGE_PREFIX = "450600";

    red = Math.min(999, Math.max(0, red));
    blue = Math.min(999, Math.max(0, blue));
    this._setMessage(
      PACKAGE_PREFIX
      + int2hexlittle(red)
      + int2hexlittle(blue)
    );
  }

  /**
   * Generates the appropriate message to set the temperature and the weather
   * @param temp temperature to set (`-127 <= temp <= 128`)
   * @param weatherType type of weather to set
   */
  public setTempAndWeatherPackage(temp: number, weatherType: WeatherType) {
    const PACKAGE_PREFIX = "5F"
    if (temp > 128 || temp < -127) {
      throw new Error('temp should be >= -127 and <= 128')
    }
    let encodedTemp = ""
    if (temp >= 0) {
      encodedTemp = this._number2HexString(temp);
    } else {
      let value = 256 + temp
      encodedTemp = this._number2HexString(value);
    }
    this._setMessage(
      PACKAGE_PREFIX
      + encodedTemp
      + this._number2HexString(weatherType)
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
    this._setMessage(
      PACKAGE_PREFIX
      + this._number2HexString(briInRange)
    );
  }

  /**
   * Generates the full message, properly split which will be ready to be send to Divoom
   * @param msg the string or Buffer that you want to encode before sending to Divoom
   */
  public createRAWPackage(msg: string | Buffer) {
    this._setMessage(msg);
  }

  /**
   * @returns The an array of strings of all the messages which should be sent
   */
  public getDivoomMessageArray(): string[] | undefined {
    return this._fullMessage;
  }

  public getDivoomMessageString(): string | undefined {
    if (this._fullMessage.length === 0)
      return undefined;
    let message = "";
    this._fullMessage.forEach((elt) => {
      message += elt;
    })
    return message;
  }

  /**
   * @returns The an array of messages as a Binary Buffer ready to be sent
   */
  public getDivoomBinaryBuffer(): Buffer[] | undefined {
    return this._string2BinBuffer(this._fullMessage);
  }



  /**
   * Generates the appropriate message to display an animation or an image on the Timebox
   * @param input a path to an image or a Buffer representing an image file
   * @returns A promise which resolves when the processing is done
   */
  public displayAnimation(input: Buffer | string): Promise<DivoomTimeBoxEvoProtocol> {
    this._fullMessage = [];
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
        let nbColors = this._number2HexString(colorCount % 256);
        var colorString = this._getColorString(colorArray);
        let pixelString = this._getPixelString(pixelArray, colorCount);

        let length = int2hexlittle(('AA0000000000' + nbColors + colorString + pixelString).length / 2);
        this._setMessage(
          PACKAGE_PREFIX
          + length
          + '000000'
          + nbColors
          + colorString
          + pixelString
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

          this._gifFrame[frameNb].nbColorsHex = this._number2HexString(colorCounter % 256);
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
            PACKAGE_PREFIX
            + totalSizeHex
            + messageCounter.toString(16).padStart(2, '0')
            + message
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
    let length = this._number2HexString(text.length);
    let encodedText = "8601" + length;
    text.split("").forEach((char) => {
      encodedText += int2hexlittle(char.charCodeAt(0));
    })
    return encodedText;
  }

  public buildTextPackage(text: string, paletteFn: Function, animFn: Function) {
    if (typeof paletteFn !== 'function' || typeof animFn !== 'function') {
      throw new Error('paletteFn and animFn need to be functions')
    }
    this._textAnimFn = animFn;
    this._textAnimFrame = 0;

    const PACKAGE_INIT_MESSAGE = "6e01";
    this._fullMessage = [];
    this._queueMessage(PACKAGE_INIT_MESSAGE);
    this._queueMessage(this._encodeText(text));

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
      PALETTE_HEADER
      + paletteString
      + PALETTE_TRAILER
    );
  }

  public getNextTextAnimationFrame(): Buffer[] {
    let pixelArray: number[] = this._textAnimFn(this._textAnimFrame);
    if (pixelArray.length !== 256) throw new Error('The animFn should always generate a 256 pixel array')

    let pixelString = ''
    pixelArray.forEach(pixel => {
      pixelString += this._number2HexString(pixel);
    });

    let animString = "6c"
      + int2hexlittle(this._textAnimFrame % 65536)
      + "0701aa070143000100"
      + pixelString
    this._textAnimFrame++;
    this._fullMessage = [];
    this._queueMessage(animString);
    return this.getDivoomBinaryBuffer();
  }

  public getAnimPalette(): string[] {
    return this._textAnimPalette;
  }
}
