import { expect } from 'chai';
import 'mocha';
import { DateTimeCommand } from "../../src/commands/date_time"

describe('DateTimeCommand Class', () => {
  describe('New instance', () => {
    it('should work with the default value', () => {
      const d = new DateTimeCommand();
      expect(d.messages[0].payload).to.match(/18.*00/);
      expect(d.messages[0].payload.length).to.equal(18);
    })
    it('should set the date correctly', () => {
      const d = new DateTimeCommand({ date: new Date(2019, 9, 9, 0, 42, 35) });
      expect(d.messages[0].payload).to.equal("1813140a09002a2300");
    });
  })
  describe('getters and setters', () => {
    it('should set the date correctly', () => {
      const d = new DateTimeCommand();
      d.date = new Date(2019, 9, 9, 0, 42, 35);
      expect(d.messages[0].payload).to.equal("1813140a09002a2300");
    });
    it('should get the date correctly', () => {
      const date = new Date();
      const d = new DateTimeCommand({ date: date });
      expect(d.date).to.equal(date);
    });
  });
})
