import { DivoomTimeBoxRAW } from "../divoom_raw";


export class CustomChannel extends DivoomTimeBoxRAW {
  private _PACKAGE_HEADER = "4505";

  constructor() {
    super();
    this.push(this._PACKAGE_HEADER);
  }
}
