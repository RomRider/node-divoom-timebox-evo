import { expect } from 'chai';
import 'mocha';
import { DisplayText } from "../../src/drawing/text";
import { DivoomMessage } from '../../src/message';

function toJsonString(text: any) {
  return JSON.stringify(text).toLowerCase();
}

describe('DisplayText class', () => {
  describe('Properties', () => {
    const shouldBePalette = ["000000", "010101", "020202", "030303", "040404", "050505", "060606", "070707", "080808", "090909", "0a0a0a", "0b0b0b", "0c0c0c", "0d0d0d", "0e0e0e", "0f0f0f", "101010", "111111", "121212", "131313", "141414", "151515", "161616", "171717", "181818", "191919", "1a1a1a", "1b1b1b", "1c1c1c", "1d1d1d", "1e1e1e", "1f1f1f", "202020", "212121", "222222", "232323", "242424", "252525", "262626", "272727", "282828", "292929", "2a2a2a", "2b2b2b", "2c2c2c", "2d2d2d", "2e2e2e", "2f2f2f", "303030", "313131", "323232", "333333", "343434", "353535", "363636", "373737", "383838", "393939", "3a3a3a", "3b3b3b", "3c3c3c", "3d3d3d", "3e3e3e", "3f3f3f", "404040", "414141", "424242", "434343", "444444", "454545", "464646", "474747", "484848", "494949", "4a4a4a", "4b4b4b", "4c4c4c", "4d4d4d", "4e4e4e", "4f4f4f", "505050", "515151", "525252", "535353", "545454", "555555", "565656", "575757", "585858", "595959", "5a5a5a", "5b5b5b", "5c5c5c", "5d5d5d", "5e5e5e", "5f5f5f", "606060", "616161", "626262", "636363", "646464", "656565", "666666", "676767", "686868", "696969", "6a6a6a", "6b6b6b", "6c6c6c", "6d6d6d", "6e6e6e", "6f6f6f", "707070", "717171", "727272", "737373", "747474", "757575", "767676", "777777", "787878", "797979", "7a7a7a", "7b7b7b", "7c7c7c", "7d7d7d", "7e7e7e", "7f7f7f", "808080", "818181", "828282", "838383", "848484", "858585", "868686", "878787", "888888", "898989", "8a8a8a", "8b8b8b", "8c8c8c", "8d8d8d", "8e8e8e", "8f8f8f", "909090", "919191", "929292", "939393", "949494", "959595", "969696", "979797", "989898", "999999", "9a9a9a", "9b9b9b", "9c9c9c", "9d9d9d", "9e9e9e", "9f9f9f", "a0a0a0", "a1a1a1", "a2a2a2", "a3a3a3", "a4a4a4", "a5a5a5", "a6a6a6", "a7a7a7", "a8a8a8", "a9a9a9", "aaaaaa", "ababab", "acacac", "adadad", "aeaeae", "afafaf", "b0b0b0", "b1b1b1", "b2b2b2", "b3b3b3", "b4b4b4", "b5b5b5", "b6b6b6", "b7b7b7", "b8b8b8", "b9b9b9", "bababa", "bbbbbb", "bcbcbc", "bdbdbd", "bebebe", "bfbfbf", "c0c0c0", "c1c1c1", "c2c2c2", "c3c3c3", "c4c4c4", "c5c5c5", "c6c6c6", "c7c7c7", "c8c8c8", "c9c9c9", "cacaca", "cbcbcb", "cccccc", "cdcdcd", "cecece", "cfcfcf", "d0d0d0", "d1d1d1", "d2d2d2", "d3d3d3", "d4d4d4", "d5d5d5", "d6d6d6", "d7d7d7", "d8d8d8", "d9d9d9", "dadada", "dbdbdb", "dcdcdc", "dddddd", "dedede", "dfdfdf", "e0e0e0", "e1e1e1", "e2e2e2", "e3e3e3", "e4e4e4", "e5e5e5", "e6e6e6", "e7e7e7", "e8e8e8", "e9e9e9", "eaeaea", "ebebeb", "ececec", "ededed", "eeeeee", "efefef", "f0f0f0", "f1f1f1", "f2f2f2", "f3f3f3", "f4f4f4", "f5f5f5", "f6f6f6", "f7f7f7", "f8f8f8", "f9f9f9", "fafafa", "fbfbfb", "fcfcfc", "fdfdfd", "fefefe", "ffffff"];
    function paletteFn() {
      let palette = [];
      for (var i = 0; i < 256; i++) {
        palette.push({ r: i, g: i, b: i });
      }
      return palette;
    }

    function animFn(frame: number): number[] {
      let pixelArray = [];
      for (var i = 0; i < 256; i++) {
        pixelArray.push(frame);
      }
      return pixelArray;
    }
    it('should generate the proper palette', () => {
      const d = new DisplayText({
        paletteFn: paletteFn,
        text: "Hi there!",
        animFn: animFn
      });
      expect(toJsonString(d.colorPalette)).to.equal(toJsonString(shouldBePalette));
    });
    it('should return the proper initial messages', () => {
      const expectedMessages = [
        "0104006e01730002",
        "011700860109480069002000740068006500720065002100b10302",
        "010e046c00000704aa070446000000" + shouldBePalette.join("") + "00".repeat(256) + "048002"
      ]
      let d = new DisplayText({
        text: "Hi there!",
        paletteFn: paletteFn,
        animFn: animFn
      });
      d.messages.forEach((message: DivoomMessage, index: number) => {
        expect(message.message).to.equal(expectedMessages[index])
      })
    })
  });
  describe('Errors', () => {
    it('should fail if the palette is not 256 colors', () => {
      const d = new DisplayText;
      expect(() => { d.paletteFn = () => { return ["AAAAAA"] } }).to.throw(Error);
    })
  });
});
