import { DivoomTimeBoxRAW } from "../divoom_raw";

export class CloudChannel extends DivoomTimeBoxRAW {
  /**
   * Generates the appropriate message to display the Cloud Channel
   */
  constructor() {
    super();
    this.push("4502")
  }
}
