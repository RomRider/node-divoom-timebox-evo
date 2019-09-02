import { expect } from 'chai';
import 'mocha';
import { ScoreBoardChannel } from '../../src/channels/scoreboard'

describe('ScoreBoard Channel', () => {
  describe('New Instance', () => {
    it('should work with default properties', () => {
      const d = new ScoreBoardChannel;
      expect(d.messages[0].message).to.equal("01090045060000000000540002")
    })
    it('should set the proper score for the red player', () => {
      const d = new ScoreBoardChannel({ red: 999, blue: -1 });
      expect(d.messages[0].message).to.equal("010900450600e70300003e0102")
    })
    it('should set the proper score for the red player', () => {
      const d = new ScoreBoardChannel({ blue: 999, red: 1000 });
      expect(d.messages[0].payload).to.equal("450600e703e703")
    })
  })
  describe('getters and setters', () => {
    const d = new ScoreBoardChannel;
    it('should update the red property correctly', () => {
      d.red += 2;
      expect(d.red).to.equal(2);
      expect(d.messages[0].payload).to.equal("45060002000000")
    })
    it('should update the blue property correctly', () => {
      d.blue += 2;
      expect(d.blue).to.equal(2);
      expect(d.messages[0].payload).to.equal("45060002000200");
    })
  })
})
