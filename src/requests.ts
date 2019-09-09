import { TimeboxEvoMessageArray } from "./messages/message_array";
import { TimeboxEvoMessage } from "./messages/message";

/**
 * Generic class to communicate with the Timebox Evo
 */
export class TimeboxEvoRequest {
  private _messages: TimeboxEvoMessageArray = TimeboxEvoMessageArray.create();

  /**
   * This queues a message in the message queue
   * @param msg the message to append in the message queue
   * @returns the length of the message queue
   */
  public push(msg: string): number {
    return this._messages.push(new TimeboxEvoMessage(msg));
  }

  /**
   * Clears the message queue
   */
  public clear() {
    this._messages = TimeboxEvoMessageArray.create();
  }

  /**
   * Returns the message queue
   * @returns The message queue
   */
  get messages(): TimeboxEvoMessageArray {
    return this._messages;
  }
}
