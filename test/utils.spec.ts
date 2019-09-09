import { int2hexlittle, unhexlify } from "../src/helpers/utils";
import { expect } from "chai";
import "mocha";

describe("util functions", () => {
  describe("int2hexlittle function", () => {
    it("should return in LSB First", () => {
      const result = int2hexlittle(42);
      expect(result).to.equal("2a00");
    });

    it("should return in LSB First", () => {
      const result = int2hexlittle(4200);
      expect(result).to.equal("6810");
    });

    it("should fail with value > 65535", () => {
      expect(() => int2hexlittle(65536)).to.throw(TypeError);
    });

    it("should fail with value < 0", () => {
      expect(() => int2hexlittle(-1)).to.throw(TypeError);
    });
  });

  describe("unhexlify function", () => {
    it("should return a string", () => {
      expect(typeof unhexlify("FF") === "string").to.be.true;
    });

    it("should encode the string in ascii", () => {
      const result = unhexlify("FF");
      expect(result).to.equal("ÿ");
      const result2 = unhexlify("AFFF");
      expect(result2).to.equal("¯ÿ");
    });

    it("should fail if string length is not a multiple of 2", () => {
      expect(() => unhexlify("ABC")).to.throw(Error);
    });

    it("should fail if the string contains non hex charaters", () => {
      expect(() => unhexlify("ZZZZ")).to.throw(Error);
    });
  });
});
