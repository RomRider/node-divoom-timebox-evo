import { DivoomMessage } from "./message";

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
      bufferArray = bufferArray.concat(slice.asBinaryBuffer());
    })
    return bufferArray;
  }
}
