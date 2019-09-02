import { expect } from 'chai';
import 'mocha';
import { CustomChannel } from '../../src/channels/custom'

describe('Custom Channel', () => {
  const d = new CustomChannel;
  it('should work with default properties', () => {
    expect(d.messages[0].message).to.equal("01040045054e0002")
  })
})
