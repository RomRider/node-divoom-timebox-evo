import { DivoomTimeBoxRAW } from "../divoom_raw";
import fs from "fs";
import fileType from "file-type";
import Jimp from 'jimp';
import gifWrap from 'gifwrap';
import { JimpArray, DivoomJimpStatic, DivoomJimpAnim } from "./jimp_overloads";


export class DisplayAnimation extends DivoomTimeBoxRAW {
  public async read(input: string | Buffer): Promise<JimpArray> {
    let buffer: Buffer;
    if (Buffer.isBuffer(input)) {
      buffer = input;
    } else {
      buffer = fs.readFileSync(input);
    }

    let ft: fileType.FileTypeResult | undefined = fileType(buffer);
    ft = fileType(buffer);

    if (ft) {
      switch (ft.mime) {
        case 'image/gif':
          return await this._displayAnimationFromGIF(buffer);
        case 'image/jpeg':
        case 'image/png':
        case 'image/bmp':
          return await this._displayImage(buffer);
        default:
          throw new Error('file type not supported')
      }
    } else {
      throw new Error('file type unkown')
    }
  }

  /**
   * This function generates the message when the a static image is used
   * @param input a Buffer representing an image file
   * @returns A promise which resolves when the processing is done
   */
  private async _displayImage(input: Buffer): Promise<JimpArray> {
    let ja = JimpArray.create();
    const image = await Jimp.read(input);
    let resized = new DivoomJimpStatic(image.resize(16, 16, Jimp.RESIZE_NEAREST_NEIGHBOR));
    ja.push(resized);
    return ja;
  }


  /**
 * This function generates the message when the a static image is used
 * @param input Buffer representing an image file
 * @returns A promise which resolves when the processing is done
 */
  private async _displayAnimationFromGIF(input: Buffer): Promise<JimpArray> {
    let gifCodec = new gifWrap.GifCodec();
    const inputGif = await gifCodec.decodeGif(input);
    let ja = JimpArray.create();
    inputGif.frames.forEach((frame, index) => {
      let image = (gifWrap.GifUtil.copyAsJimp(DivoomJimpAnim, frame) as DivoomJimpAnim).resize(16, 16);
      image.delay = frame.delayCentisecs * 10;
      image.frame = index;
      ja.push(image);
    });
    return ja;
  }
}
