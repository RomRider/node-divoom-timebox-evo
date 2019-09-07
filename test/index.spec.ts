import { expect } from 'chai';
import 'mocha';
import {
  TimeboxEvo,
  CloudChannel,
  CustomChannel,
  LightningChannel,
  ScoreBoardChannel,
  TimeChannel,
  VJEffectChannel,
  BrightnessCommand,
  TempWeatherCommand,
  DisplayText,
  DisplayAnimation,
  TimeboxEvoRequest
} from '../src';


describe('Index', () => {
  it('should return a CloudChannel class', () => {
    const d = (new TimeboxEvo).createRequest("cloud");
    expect(d instanceof CloudChannel).to.be.true;
  })
  it('should return a CustomChannel class', () => {
    const d = (new TimeboxEvo).createRequest("custom");
    expect(d instanceof CustomChannel).to.be.true;
  })
  it('should return a LightningChannel class', () => {
    const d = (new TimeboxEvo).createRequest("lightning");
    expect(d instanceof LightningChannel).to.be.true;
  })
  it('should return a ScoreBoardChannel class', () => {
    const d = (new TimeboxEvo).createRequest("scoreboard");
    expect(d instanceof ScoreBoardChannel).to.be.true;
  })
  it('should return a TimeChannel class', () => {
    const d = (new TimeboxEvo).createRequest("time");
    expect(d instanceof TimeChannel).to.be.true;
  })
  it('should return a VJEffectChannel class', () => {
    const d = (new TimeboxEvo).createRequest("vjeffect");
    expect(d instanceof VJEffectChannel).to.be.true;
  })
  it('should return a BrightnessCommand class', () => {
    const d = (new TimeboxEvo).createRequest("brightness");
    expect(d instanceof BrightnessCommand).to.be.true;
  })
  it('should return a TempWeatherCommand class', () => {
    const d = (new TimeboxEvo).createRequest("temp_weather");
    expect(d instanceof TempWeatherCommand).to.be.true;
  })
  it('should return a DisplayText class', () => {
    const d = (new TimeboxEvo).createRequest("text");
    expect(d instanceof DisplayText).to.be.true;
  })
  it('should return a DisplayAnimation class', () => {
    const d = (new TimeboxEvo).createRequest("animation");
    expect(d instanceof DisplayAnimation).to.be.true;
  })
  it('should return a TimeboxEvoRequest class', () => {
    const d = (new TimeboxEvo).createRequest("raw");
    expect(d instanceof TimeboxEvoRequest).to.be.true;
  })
});
