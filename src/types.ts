import {
  TimeChannel,
  LightningChannel,
  VJEffectChannel,
  ScoreBoardChannel,
  CloudChannel,
  CustomChannel
} from "./channels/exports";
import { DisplayAnimation, DisplayText } from "./drawing/exports";
import { BrightnessCommand, TempWeatherCommand, VolumeCommand } from "./commands/exports";

/**
 * Type for the TimeChannel
 */
export enum TimeDisplayType {
  FullScreen,
  Rainbow,
  WithBox,
  AnalogSquare,
  FullScreenNegative,
  AnalogRound
}

/**
 * Type for the LightningChannel
 */
export enum LightningType {
  PlainColor,
  Love,
  Plants,
  NoMosquitto,
  Sleeping
}

/**
 * Type of weather for the [[TempWeatherCommand]]
 */
export enum WeatherType {
  Clear = 1,
  CloudySky = 3,
  Thunderstorm = 5,
  Rain = 6,
  Snow = 8,
  Fog = 9
}

/**
 * Type of the VJEffect channel
 */
export enum VJEffectType {
  Sparkles = 0,
  Lava,
  VerticalRainbowLines,
  Drops,
  RainbowSwirl,
  CMYFade,
  RainbowLava,
  PastelPatterns,
  CMYWave,
  Fire,
  Countdown,
  PinkBlueFade,
  RainbowPolygons,
  PinkBlueWave,
  RainbowCross,
  RainbowShapes
}

/**
 * Exports the constants for the different channels
 */
export const TIMEBOX_CONST = {
  TimeType: TimeDisplayType,
  LightningType: LightningType,
  WeatherType: WeatherType,
  VJEffectType: VJEffectType
};

export type RequestTypes =
  | CloudChannel
  | CustomChannel
  | LightningChannel
  | ScoreBoardChannel
  | TimeChannel
  | VJEffectChannel
  | DisplayAnimation
  | DisplayText
  | BrightnessCommand
  | TempWeatherCommand
  | VolumeCommand;
