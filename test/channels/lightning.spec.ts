import { expect } from 'chai';
import 'mocha';
import { LightningChannel } from "../../src/channels/lightning"

describe('Lightning Channel', () => {
  it('should work with default properties', () => {
    const d = new LightningChannel;
    expect(d.messages[0].message).to.equal("010d004501ffffff640001000000b50302")
  })
  describe('Properties', () => {
    it('should set the type correctly', () => {
      const d = new LightningChannel({ type: 3 });
      expect(d.messages[0].message!.slice(18, 20)).to.equal('03');
    });

    it('should set the color correctly', () => {
      let d = new LightningChannel({ color: '#123456' });
      expect(d.messages[0].message!.slice(10, 16)).to.equal('123456');
      d = new LightningChannel({ color: '424242' });
      expect(d.messages[0].message!.slice(10, 16)).to.equal('424242');
      d = new LightningChannel({ color: 'rgb(255, 0, 0)' });
      expect(d.messages[0].message!.slice(10, 16)).to.equal('ff0000');
      d = new LightningChannel({ color: { r: 255, g: 0, b: 255 } });
      expect(d.messages[0].message!.slice(10, 16)).to.equal('ff00ff');
      d = new LightningChannel({ color: "red" });
      expect(d.messages[0].message!.slice(10, 16)).to.equal('ff0000');
    })

    it('should set the brightness correctly', () => {
      let d = new LightningChannel({ brightness: 32 });
      expect(d.messages[0].message!.slice(16, 18)).to.equal('20');
      d = new LightningChannel({ brightness: -1 });
      expect(d.messages[0].message!.slice(16, 18)).to.equal('00');
      d = new LightningChannel({ brightness: 255 });
      expect(d.messages[0].message!.slice(16, 18)).to.equal('64');
    });

    it('should set the power correctly', () => {
      let d = new LightningChannel({ power: false });
      expect(d.messages[0].message!.slice(20, 22)).to.equal('00');
      d = new LightningChannel({ power: true });
      expect(d.messages[0].message!.slice(20, 22)).to.equal('01');
    });

  })
})