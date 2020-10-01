import { expect } from 'chai';
import 'mocha';
import { VolumeCommand } from "../../src/commands/volume";

describe('VolumeCommand Class', () => {
  describe('New instance', () => {
    it('should have default value', () => {
      const cmd = new VolumeCommand();
      expect(cmd.messages[0].payload).to.equal('0801');
    });

    it('should set volume properly with values between 0 and 16', () => {
      let cmd = new VolumeCommand({ volume: 16 });
      expect(cmd.messages[0].payload).to.equal('0810');
      cmd = new VolumeCommand({ volume: 0 });
      expect(cmd.messages[0].payload).to.equal('0800');
      cmd = new VolumeCommand({ volume: 8 });
      expect(cmd.messages[0].payload).to.equal('0808');
    });
  });

  describe('getters and setters', () => {
    it('should set the volume properly', () => {
      const cmd = new VolumeCommand();
      cmd.volume = 16;
      expect(cmd.messages[0].payload).to.equal('0810');
      cmd.volume = 0;
      expect(cmd.messages[0].payload).to.equal('0800');
      cmd.volume = 8;
      expect(cmd.messages[0].payload).to.equal('0808');
    });

    it('should fail with volume outside of the range', () => {
      const cmd = new VolumeCommand();
      expect(() => { cmd.volume = -1 }).to.throw(Error);
      expect(() => { cmd.volume = 17 }).to.throw(Error);
    });
  });
});
