import { expect } from 'chai';
import 'mocha';
import { BrightnessCommand } from "../../src/commands/brightness"

describe('BrightnessCommand Class', () => {
  describe('New instance', () => {
    it('should work with the default value', () => {
      const d = new BrightnessCommand;
      expect(d.messages[0].payload).to.equal("7464");
    })
    it('should set the brightness properly with values between 0 and 100', () => {
      let d = new BrightnessCommand({ brightness: 42 });
      expect(d.messages[0].payload).to.equal("742a");
      d = new BrightnessCommand({ brightness: 0 });
      expect(d.messages[0].payload).to.equal("7400");
      d = new BrightnessCommand({ brightness: 100 });
      expect(d.messages[0].payload).to.equal("7464");
    })
  })
  describe('getters and setters', () => {
    it('should set the options properly', () => {
      const d = new BrightnessCommand;
      d.opts = { brightness: 255, in_min: 0, in_max: 255 };
      expect(d.messages[0].payload).to.equal("7464");
      d.opts = { brightness: 32, in_min: 0, in_max: 255 };
      expect(d.messages[0].payload).to.equal("740d");
      d.opts = { brightness: 0.5, in_min: 0, in_max: 1 };
      expect(d.messages[0].payload).to.equal("7432");
    })
    it('should fail with brightness outside of the range', () => {
      const d = new BrightnessCommand;
      expect(() => { d.brightness = 1000 }).to.throw(Error);
      expect(() => { d.brightness = -5 }).to.throw(Error);
    })
    it('should set the brightness', () => {
      const d = new BrightnessCommand;
      d.brightness = 32
      expect(d.messages[0].payload).to.equal("7420");
      expect(d.brightness).to.equal(32);
    })
    it('should update in_min properly', () => {
      const d = new BrightnessCommand;
      d.in_min = 50;
      expect(d.messages[0].payload).to.equal("7464");
      expect(d.in_min).to.equal(50);
      expect(d.brightness).to.equal(100);
    })
    it('should update in_max properly', () => {
      const d = new BrightnessCommand({ brightness: 50, in_min: 0, in_max: 100 });
      expect(d.messages[0].payload).to.equal("7432");
      d.in_max = 50;
      expect(d.messages[0].payload).to.equal("7464");
      expect(d.in_max).to.equal(50);
      expect(d.brightness).to.equal(50);
    })
  })
})
