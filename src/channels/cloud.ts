import { TimeboxEvoRequest } from "../requests";

export class CloudChannel extends TimeboxEvoRequest {
  /**
   * Generates the appropriate message to display the Cloud Channel
   */
  constructor() {
    super();
    this.push("4502");
  }
}
