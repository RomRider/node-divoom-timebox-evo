import { TimeboxEvoRequest } from "../requests";


export class CustomChannel extends TimeboxEvoRequest {
  private _PACKAGE_HEADER = "4505";

  constructor() {
    super();
    this.push(this._PACKAGE_HEADER);
  }
}
