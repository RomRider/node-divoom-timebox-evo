import { expect } from 'chai';
import 'mocha';
import { VJEffectChannel } from '../../src/channels/vjeffect';

describe('VJEffects Channel', () => {
  describe('Properties', () => {
    it('should work with default properties', () => {
      const d = new VJEffectChannel;
      expect(d.messages[0].message).to.equal("0105004503004d0002")
    })
    it('should set the type correctly', () => {
      const d = new VJEffectChannel({ type: 10 });
      expect(d.messages[0].message).to.equal("01050045030a570002")
    });
  })
  describe('getter and setters', () => {
    let d = new VJEffectChannel;
    it('should update the type correctly', () => {
      d.type = 10;
      expect(d.type).to.equal(10);
      expect(d.messages[0].message).to.equal("01050045030a570002")
    })
  })
})
