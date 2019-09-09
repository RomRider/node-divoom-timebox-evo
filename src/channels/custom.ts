import { TimeboxEvoRequest } from "../requests";

export class CustomChannel extends TimeboxEvoRequest {
  private _PACKAGE_HEADER = "4505";
  /**
   * Generates the appropriate message to display the Custom Channel
   */
  constructor() {
    super();
    this.push(this._PACKAGE_HEADER);
  }
}
