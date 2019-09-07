import { TimeboxEvoMessage } from "./message";

export class TimeboxEvoMessageArray extends Array<TimeboxEvoMessage> {
  private constructor(items?: Array<TimeboxEvoMessage>) {
    super(...items)
  }
  static create(): TimeboxEvoMessageArray {
    return Object.create(TimeboxEvoMessageArray.prototype);
  }

  public asBinaryBuffer(): Buffer[] {
    let bufferArray: Buffer[] = [];
    this.forEach((slice) => {
      bufferArray = bufferArray.concat(slice.asBinaryBuffer());
    })
    return bufferArray;
  }
}
