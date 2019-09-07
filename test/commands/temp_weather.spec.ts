import { expect } from 'chai';
import 'mocha';
import { TempWeatherCommand } from "../../src/commands/temp_weather"
import { TIMEBOX_CONST } from '../../src';

describe('TempWeatherCommand class', () => {
  describe('New instance', () => {
    it('should work with the default properties', () => {
      const d = new TempWeatherCommand;
      expect(d.messages[0].payload).to.equal("5f0001")
    });
    it('should set the weather properly', () => {
      const d = new TempWeatherCommand({ temperature: 0, weather: TIMEBOX_CONST.WeatherType.Fog });
      expect(d.messages[0].payload).to.equal("5f0009")
    })
    it('should handle positive temperature properly', () => {
      const d = new TempWeatherCommand({ temperature: 42, weather: TIMEBOX_CONST.WeatherType.Fog });
      expect(d.messages[0].payload).to.equal("5f2a09")
    })
    it('should handle negative temperature properly', () => {
      const d = new TempWeatherCommand({ temperature: -42, weather: TIMEBOX_CONST.WeatherType.Fog });
      expect(d.messages[0].payload).to.equal("5fd609")
    })
    it('should handle floats in temperature properly', () => {
      const d = new TempWeatherCommand({ temperature: 42.3, weather: TIMEBOX_CONST.WeatherType.Fog });
      expect(d.messages[0].payload).to.equal("5f2a09")
    })
    it('should fail if temperature is > 128', () => {
      expect(() => { new TempWeatherCommand({ temperature: 129, weather: TIMEBOX_CONST.WeatherType.Fog }) }).to.throw(Error)
    })
    it('should fail if temperature is < -127', () => {
      expect(() => { new TempWeatherCommand({ temperature: -128, weather: TIMEBOX_CONST.WeatherType.Fog }) }).to.throw(Error)
    })
  })
  describe('getters and setters', () => {
    it('should update the temperature correctly', () => {
      const d = new TempWeatherCommand;
      d.temperature = 42;
      expect(d.messages.length).to.equal(1);
      expect(d.messages[0].payload).to.equal("5f2a01");
      expect(d.temperature).to.equal(42);
    });
    it('should update the weather properly', () => {
      const d = new TempWeatherCommand;
      d.weather = TIMEBOX_CONST.WeatherType.Fog;
      expect(d.messages.length).to.equal(1);
      expect(d.messages[0].payload).to.equal("5f0009");
      expect(d.weather).to.equal(TIMEBOX_CONST.WeatherType.Fog);
    });
  });
});
