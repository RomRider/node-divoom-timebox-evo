import { expect } from 'chai';
import 'mocha';
import { DivoomTimeBoxEvo, TimeChannel } from '../../src/index';

describe('Time Channel', () => {
  it('should work with default properties', () => {
    const d = new TimeChannel;
    expect(d.messages[0].message).to.equal("010d004500010001000000ffffff510302")
  })

  describe('Properties', () => {
    it('should set the type parameter correclty', () => {
      let d = new TimeChannel({ type: 3 });
      expect(d.messages[0].message.slice(12, 14)).to.equal('03');
    })
    it('should set the time parameter correctly', () => {
      let d = new TimeChannel({ showTime: false });
      expect(d.messages[0].message.slice(14, 16)).to.equal('00');
      d = new TimeChannel({ showTime: true });
      expect(d.messages[0].message.slice(14, 16)).to.equal('01');
    })
    it('should set the weather parameter correctly', () => {
      let d = new TimeChannel({ showWeather: false });
      expect(d.messages[0].message.slice(16, 18)).to.equal('00');
      d = new TimeChannel({ showWeather: true });
      expect(d.messages[0].message.slice(16, 18)).to.equal('01');
    })
    it('should set the temperature parameter correctly', () => {
      let d = new TimeChannel({ showTemp: false });
      expect(d.messages[0].message.slice(18, 20)).to.equal('00');
      d = new TimeChannel({ showTemp: true });
      expect(d.messages[0].message.slice(18, 20)).to.equal('01');
    })
    it('should set the calendar parameter correctly', () => {
      let d = new TimeChannel({ showCalendar: false });
      expect(d.messages[0].message.slice(20, 22)).to.equal('00');
      d = new TimeChannel({ showCalendar: true });
      expect(d.messages[0].message.slice(20, 22)).to.equal('01');
    })
    it('should set the color correctly', () => {
      let d = new TimeChannel({ color: '#123456' });
      expect(d.messages[0].message.slice(22, 28)).to.equal('123456');
      d = new TimeChannel({ color: '424242' });
      expect(d.messages[0].message.slice(22, 28)).to.equal('424242');
      d = new TimeChannel({ color: 'rgb(255, 0, 0)' });
      expect(d.messages[0].message.slice(22, 28)).to.equal('ff0000');
      d = new TimeChannel({ color: { r: 255, g: 0, b: 255 } });
      expect(d.messages[0].message.slice(22, 28)).to.equal('ff00ff');
      d = new TimeChannel({ color: "red" });
      expect(d.messages[0].message.slice(22, 28)).to.equal('ff0000');
    })
    it('should fail if the color is not a color', () => {
      expect(() => { new TimeChannel({ color: '#ZZZZZZ' }) }).to.throw(Error);
    })
  })
})
