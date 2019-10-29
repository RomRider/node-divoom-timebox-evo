import { RequestTypes } from "./types";
import { TimeboxEvoRequest } from "./requests";
import {
  TimeChannel,
  LightningChannel,
  VJEffectChannel,
  ScoreBoardChannel,
  CloudChannel,
  CustomChannel
} from "./channels/exports";
import { BrightnessCommand, TempWeatherCommand, DateTimeCommand } from "./commands/exports";
import { DisplayText } from "./drawing/text";
import { DisplayAnimation } from "./drawing/drawing";
export * from "./channels/exports";
export * from "./commands/exports";
export * from "./drawing/exports";
export * from "./requests";
export { TIMEBOX_CONST } from "./types";

/**
 * This class instanciate the proper class to communicate with the Timebox Evo
 */
export class TimeboxEvo {
  createRequest(type: Object): RequestTypes;
  createRequest(type: "cloud"): CloudChannel;
  createRequest(type: "custom"): CustomChannel;
  createRequest(type: "lightning"): LightningChannel;
  createRequest(type: "scoreboard"): ScoreBoardChannel;
  createRequest(type: "time"): TimeChannel;
  createRequest(type: "vjeffect" | "vj-effect"): VJEffectChannel;
  createRequest(type: "brightness"): BrightnessCommand;
  createRequest(type: "temp_weather"): TempWeatherCommand;
  createRequest(type: "text"): DisplayText;
  createRequest(type: "picture" | "animation"): DisplayAnimation;
  createRequest(type: "datetime"): DateTimeCommand;
  createRequest(type: "raw"): TimeboxEvoRequest;

  /**
   * Returns an instance of the class required to communicate with the Timebox Evo
   * @param type type of request. Can be any of: `cloud`, `custom`, `lightning`, `scoreboard`, `time`, `vjeffect`, `brightness`, `temp_weather`, `text`, `picture`, `animation`, `datetime`, `raw`
   * @param opts optional parameter for the `type`. See each class' documentation for details
   * @returns the proper class instance
   */
  public createRequest(type: string, opts?: any): RequestTypes {
    switch (type.toLowerCase()) {
      case "cloud":
        return new CloudChannel();
      case "custom":
        return new CustomChannel();
      case "lightning":
        return new LightningChannel(opts);
      case "scoreboard":
        return new ScoreBoardChannel(opts);
      case "time":
        return new TimeChannel(opts);
      case "vj-effect":
      case "vjeffect":
        return new VJEffectChannel(opts);
      case "brightness":
        return new BrightnessCommand(opts);
      case "temp_weather":
        return new TempWeatherCommand(opts);
      case "text":
        return new DisplayText(opts);
      case "picture":
      case "animation":
        return new DisplayAnimation();
      case "datetime":
        return new DateTimeCommand(opts);
      case "raw":
        return new TimeboxEvoRequest();
      default:
        throw new Error("Unkown type");
    }
  }
}
