import { expect } from 'chai';
import { DivoomMessage } from '../src/message'
import 'mocha';

describe('DivoomMessage class', () => {
  const MESSAGE1 = "4500010001000100ff00ff";
  let m = new DivoomMessage(MESSAGE1);

  it('should have the proper length', () => {
    expect(m.length).to.equal(13);
    expect(m.lengthHS).to.equal("0d00");
  })

  it('should have the proper crc', () => {
    expect(m.crc).to.equal(595)
    expect(m.crcHS).to.equal('5302');
  });

  it('should set the proper payload', () => {
    expect(m.payload).to.equal('4500010001000100ff00ff');
  })

  it('should set the proper message', () => {
    const shouldBe = "010d004500010001000100ff00ff530202";
    const is = m.message;

    expect(is).to.equal(shouldBe);
    expect(is.length).to.equal(shouldBe.length);
  })

  it('should set the message to lowercase', () => {
    let m = new DivoomMessage("AA");
    expect(m.payload).to.equal("aa");
  })

  it('should append the proper message', () => {
    m.append("00");
    expect(m.length).to.equal(14);
    expect(m.lengthHS).to.equal("0e00");
    expect(m.payload).to.equal(MESSAGE1 + "00")
    expect(m.crcHS).to.equal("5402");
  })
  it('should prepend the proper message', () => {
    m.prepend("11");
    expect(m.length).to.equal(15);
    expect(m.lengthHS).to.equal("0f00");
    expect(m.payload).to.equal("11" + MESSAGE1 + "00")
    expect(m.crcHS).to.equal("6602");
  })

  it('should return undefined when no message is defined', () => {
    let m = new DivoomMessage;
    expect(m.crc).to.be.undefined;
    expect(m.crcHS).to.be.undefined;
    expect(m.message).to.be.undefined;
    expect(m.payload).to.be.undefined;
    expect(m.length).to.be.undefined;
    expect(m.lengthHS).to.be.undefined;
  })
})
