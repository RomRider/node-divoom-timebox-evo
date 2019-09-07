import { TimeboxEvoMessageArray } from "./messages/message_array";
import { TimeboxEvoMessage } from "./messages/message";

export class TimeboxEvoRequest {
  private _messages: TimeboxEvoMessageArray = TimeboxEvoMessageArray.create();

  public push(msg: string): number {
    return this._messages.push(new TimeboxEvoMessage(msg));
  }

  public clear() {
    this._messages = TimeboxEvoMessageArray.create();
  }

  get messages() {
    return this._messages;
  }
}
