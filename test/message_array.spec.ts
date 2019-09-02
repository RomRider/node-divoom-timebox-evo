import { expect } from 'chai';
import { DivoomMessage } from '../src/message';
import { DivoomMessages } from '../src/message_array';
import 'mocha';

describe('DivoomMessages class', () => {
  const MESSAGE1 = "4500010001000100ff00ff";
  let m = new DivoomMessage(MESSAGE1);

  it('should have the proper length', () => {
    let ma = DivoomMessages.create();
    expect(ma.length).to.equal(0);
    ma.push(m);
    expect(ma.length).to.equal(1);
    ma.push(m);
    expect(ma.length).to.equal(2);
    expect(ma[1].payload).to.equal(MESSAGE1);
    let pop = ma.pop()
    expect(ma[1]).to.be.undefined;
    expect(pop.payload).to.equal(MESSAGE1);
  })

  it('should split the message every 1332 char', () => {
    let ma = DivoomMessages.create();
    ma.push(new DivoomMessage("00".repeat(1500)));
    let bb = ma.asBinaryBuffer();
    expect(bb[0].length).to.equal(666);
    expect(bb[1].length).to.equal(666);
    expect(bb[2].length).to.equal(1500 + 6 - 666 - 666);
  })

  it('should return a string representation', () => {
    let ma = DivoomMessages.create();
    ma.push(new DivoomMessage("00"))
    ma.push(new DivoomMessage("00"))
    expect(ma.toString()).to.equal("01030000030002,01030000030002")
  })

})
