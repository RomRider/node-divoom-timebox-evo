import { expect } from 'chai';
import 'mocha';
import { CloudChannel } from '../../src/channels/cloud'

describe('Cloud Channel', () => {
  const d = new CloudChannel;
  it('should work with default properties', () => {
    expect(d.messages[0].message).to.equal("01040045024b0002")
  })
})
