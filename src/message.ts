import { int2hexlittle } from "./utils";

export class DivoomMessage {
  private START = "01";
  private END = "02";
  private _message: string | undefined;

  constructor(msg: string = '') {
    this.append(msg);
  }

  private _calcCRC(): number | undefined {
    if (!this._message) return undefined;
    let msg = this.lengthHS + this._message;
    let sum = 0;
    for (let i: number = 0, l: number = msg.length; i < l; i += 2) {
      sum += parseInt(msg.substr(i, 2), 16)
    }
    return sum % 65536;
  }

  get crc(): number | undefined {
    if (!this._message) return undefined;
    return this._calcCRC();
  }

  get crcHS(): string | undefined {
    if (!this._message) return undefined;
    return int2hexlittle(this.crc);
  }

  get length(): number | undefined {
    if (!this._message) return undefined;
    return (this._message.length + 4) / 2;
  }

  get lengthHS(): string | undefined {
    if (!this._message) return undefined;
    return int2hexlittle(this.length);
  }

  get payload(): string {
    return this._message;
  }

  get message(): string | undefined {
    if (!this._message) return undefined;
    return this.START + this.lengthHS + this._message + this.crcHS + this.END
  }

  public append(msg: string): DivoomMessage {
    if (msg) {
      this._message = this._message ? this._message + msg.toLowerCase() : msg.toLowerCase();
    }
    return this;
  }

  public prepend(msg: string): DivoomMessage {
    if (msg) {
      this._message = this._message ? msg.toLowerCase() + this._message : msg.toLowerCase();
    }
    return this;
  }

  public toString(): string | undefined {
    return this.message;
  }
}
