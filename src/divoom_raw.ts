import { DivoomMessages } from "./message_array";
import { DivoomMessage } from "./message";

export class DivoomTimeBoxRAW {
  private _messages: DivoomMessages = DivoomMessages.create();

  public push(msg: string): number {
    return this._messages.push(new DivoomMessage(msg));
  }

  public clear() {
    this._messages = DivoomMessages.create();
  }

  get messages() {
    return this._messages;
  }
}
