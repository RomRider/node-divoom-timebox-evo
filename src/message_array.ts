import { DivoomMessage } from "./message";
import { unhexlify } from "./utils";


export class DivoomMessages extends Array<DivoomMessage> {
  private constructor(items?: Array<DivoomMessage>) {
    super(...items)
  }
  static create(): DivoomMessages {
    return Object.create(DivoomMessages.prototype);
  }

  public asBinaryBuffer(): Buffer[] {
    let bufferArray: Buffer[] = [];
    this.forEach((slice) => {
      slice.message.match(/.{1,1332}/g).forEach((part) => {
        bufferArray.push(Buffer.from(unhexlify(part), 'binary'));
      })
    })
    return bufferArray;
  }
}
