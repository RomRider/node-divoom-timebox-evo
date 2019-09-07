import {
  TimeChannel,
  LightningChannel,
  VJEffectChannel,
  ScoreBoardChannel,
  CloudChannel,
  CustomChannel
} from "./channels/exports";
import { DisplayAnimation, DisplayText } from "./drawing/exports"
import { BrightnessCommand, TempWeatherCommand } from "./commands/exports"

export enum TimeDisplayType {
  FullScreen,
  Rainbow,
  WithBox,
  AnalogSquare,
  FullScreenNegative,
  AnalogRound
}

export enum LightningType {
  PlainColor,
  Love,
  Plants,
  NoMosquitto,
  Sleeping
}
export enum WeatherType {
  Clear = 1,
  CloudySky = 3,
  Thunderstorm = 5,
  Rain = 6,
  Snow = 8,
  Fog = 9
}

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

export const TIMEBOX_CONST = {
  TimeType: TimeDisplayType,
  LightningType: LightningType,
  WeatherType: WeatherType,
  VJEffectType: VJEffectType,
}

export type RequestTypes =
  CloudChannel
  | CustomChannel
  | LightningChannel
  | ScoreBoardChannel
  | TimeChannel
  | VJEffectChannel
  | DisplayAnimation
  | DisplayText
  | BrightnessCommand
  | TempWeatherCommand
