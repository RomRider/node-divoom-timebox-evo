import { expect } from 'chai';
import { DivoomTimeBoxEvoProtocol } from '../src/index';
import { DivoomConst } from '../src/types';
import 'mocha';
import { DivoomMessage } from '../src/message';

describe('DivoomTimeBoxProtocol class', () => {
  function strip(msg: string | undefined) {
    return msg === undefined ? undefined : msg.slice(6, -6);
  }
  describe('class private properties', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    d.createRAWPackage("4500010001000100ff00ff")

    it('should set the proper length', () => {
      expect(d.messages[0].lengthHS).to.equal("0d00");
    })

    it('should set the proper crc', () => {
      expect(d.messages[0].crcHS).to.equal('5302');
    });

    it('should set the proper message', () => {
      expect(d.messages[0].payload).to.equal('4500010001000100ff00ff');
    })

    it('should set the proper message', () => {
      const shouldBe = ["010d004500010001000100ff00ff530202"];
      const is = d.messages;

      expect(is.length).to.equal(shouldBe.length);
      is.forEach((slice: DivoomMessage, index: number) => {
        expect(slice.message).to.equal(shouldBe[index])
      });
    })

    const d2 = new DivoomTimeBoxEvoProtocol;
    d2.createRAWPackage("44000A0A04AA0000000000fd726f5f7674687c7a6e7b7b6d8281728a8a7b8b8c8087897e83847b74756e53534f6e6e6662615a82837f9d9d9a8c8c8674716278766b7d7b6f7c7c7067685e3345432e414061746b576660777869b6b7a5c5c4b2c2c0b2898a869b9c978a8a857470615b4d3e5d49398080736a6b614a6261324e4f80928a6e8079949586d5d6c2e2e2d1b7b6a991918e999b96888983716c5f4c392b4227178181747272694057562745467e9e936c7e75959685d1d2bee6e3cfacab9e959694969893858580676255564638442f21817f74828379545f5b44504d68766f5b635f6f6d619d9c8bd5d2bfa8a5999495908685825b564a5d5042483223807c708f908685857a49494791928d4645444849497c7e797b7b7793949182817c8785824d493d5d574a422f237b72676d6f64434a2d2323245d5d5c62615f393939666461636565a2a29d9492901c1c1c696663332e25625e543f342e4a4036312f2a2121221415170f10131213161a1c1f2122261d1e213b3b3e4747490d0d0f7571710808084c493f3e332d77675a908a8057514b6e686446434327292e35394130343b313439393c4034373b222527938c8c0c0c0b2b261f373431776659948f87464341afadaeaaa4a2a79d988d8583706c6d4c4d5444475041444b545354938b8b42260f4b2d12432d1d7b716a9f9e9b4a4542b6b5b7b2aeaeaca5a2aba39fa8a19a726c6d8f8b8d8782837d7575a7a1a66d4d2f6e461e73481f80573195816f49403bb4adacc4c3c9c8c4c9cac7cbd2ced49e9391a7a6ae767379938b8e928b919985758a5c2a895a2a9263309c703f49311d7556399b7c66c4babadddce6ebe9f3a39797aaa8b06f696c898080646269936e4793632d9767319f6f37ad7d435c4126815d39a17345a17448ba9b81dad0cfa69c9ca8a4ad7068678a81827d7781704d2b5d3d1d24211e24252355432e8d673bb08355ac8055a97a4ab38556b88f658c6c56968a8b5d5658827c817383a0343334151b1d141a2014191f665649c3a38abe9a7db8906cc19461c6996793714f645854302c2d75747d5d5b64000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c3d4d4e4f5051525354551e565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f0f1f2f3f4f5f6f7f8f9fafbfc")

    it('should split the message every 1332 characters or 666 buffer length', () => {
      const shouldBe = [
        "01050444000a0a04aa0000000000fd726f5f7674687c7a6e7b7b6d8281728a8a7b8b8c8087897e83847b74756e53534f6e6e6662615a82837f9d9d9a8c8c8674716278766b7d7b6f7c7c7067685e3345432e414061746b576660777869b6b7a5c5c4b2c2c0b2898a869b9c978a8a857470615b4d3e5d49398080736a6b614a6261324e4f80928a6e8079949586d5d6c2e2e2d1b7b6a991918e999b96888983716c5f4c392b4227178181747272694057562745467e9e936c7e75959685d1d2bee6e3cfacab9e959694969893858580676255564638442f21817f74828379545f5b44504d68766f5b635f6f6d619d9c8bd5d2bfa8a5999495908685825b564a5d5042483223807c708f908685857a49494791928d4645444849497c7e797b7b7793949182817c8785824d493d5d574a422f237b72676d6f64434a2d2323245d5d5c62615f393939666461636565a2a29d9492901c1c1c696663332e25625e543f342e4a4036312f2a2121221415170f10131213161a1c1f2122261d1e213b3b3e4747490d0d0f7571710808084c493f3e332d77675a908a8057514b6e686446434327292e35394130343b313439393c4034373b222527938c8c0c0c0b2b261f373431776659948f87464341afadaeaaa4a2a79d988d8583706c6d4c4d5444475041444b545354938b8b42260f4b2d12432d1d7b716a9f9e9b4a4542b6b5b7b2aeaeaca5a2aba39fa8a19a726c6d8f8b8d8782837d7575a7a1a66d4d2f6e461e73481f80573195816f49403bb4adacc4c3c9c8c4c9cac7cbd2ced49e9391a7a6ae767379938b8e928b919985758a5c2a895a2a9263309c703f49311d7556399b7c66c4babadddce6ebe9f3a39797aaa8b06f696c898080646269936e4793632d9767319f6f37ad7d435c4126815d39a17345a17448ba9b81dad0cfa69c9ca8a4ad7068678a81827d7781704d2b5d3d1d24211e24252355432e8d673bb08355ac8055a97a4ab38556b88f658c6c56968a8b5d5658827c817383a0343334151b1d141a2014191f665649c3a38abe9a7db8906cc19461c6996793714f645854302c2d75747d5d5b64000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c3d4d4e4f5051525354551e565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f0f1f2f3f4f5f6f7f8f9fafbfc5ec302",
      ];
      const is = d2.messages;

      expect(is.length).to.equal(shouldBe.length);
      expect(is.asBinaryBuffer().length).to.be.equal(2);
      is.forEach((msg: DivoomMessage, index: number) => {
        expect(msg.asBinaryBuffer()[0].length).to.be.lessThan(667);
        expect(msg.message).to.equal(shouldBe[index])
      });
    })
  })

  describe('Setting the temperature and the weather', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should set the weather properly', () => {
      d.setTempAndWeatherPackage(0, DivoomConst.WeatherType.Fog);
      expect(d.messages[0].payload).to.equal("5f0009")
    })
    it('should handle positive temperature properly', () => {
      d.setTempAndWeatherPackage(42, DivoomConst.WeatherType.Fog);
      expect(d.messages[0].payload).to.equal("5f2a09")
    })
    it('should handle negative temperature properly', () => {
      d.setTempAndWeatherPackage(-42, DivoomConst.WeatherType.Fog);
      expect(d.messages[0].payload).to.equal("5fd609")
    })
    it('should handle floats in temperature properly', () => {
      d.setTempAndWeatherPackage(42.3, DivoomConst.WeatherType.Fog);
      expect(d.messages[0].payload).to.equal("5f2a09")
    })
    it('should fail if temperature is > 128', () => {
      expect(() => d.setTempAndWeatherPackage(129, DivoomConst.WeatherType.Fog)).to.throw(Error)
    })
    it('should fail if temperature is < -127', () => {
      expect(() => d.setTempAndWeatherPackage(-128, DivoomConst.WeatherType.Fog)).to.throw(Error)
    })
  })

  describe('Displaying a Text', () => {
    const d = new DivoomTimeBoxEvoProtocol;
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
      d.buildTextPackage("Hi there!", paletteFn, animFn);
      expect(JSON.stringify(d.getAnimPalette()).toLowerCase())
        .to.equal(JSON.stringify(shouldBePalette).toLowerCase())
    })
    it('should fail if the palette is not 256 colors', () => {
      expect(() => d.buildTextPackage("Hi there!", () => { return ["AAAAAA"] }, animFn))
        .to.throw(Error);
    })
    it('should return the proper initial messages', () => {
      const expectedMessages = [
        "0104006e01730002",
        "011700860109480069002000740068006500720065002100b10302",
        "010e046c00000704aa070446000000" + shouldBePalette.join("") + "00".repeat(256) + "048002"
      ]
      d.buildTextPackage("Hi there!", paletteFn, animFn);
      d.messages.forEach((message: DivoomMessage, index: number) => {
        expect(message.message).to.equal(expectedMessages[index])
      })
    })
    it('should return the proper animation messages', () => {

    })
  })

  describe('RAW Messages', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should return the proper message', () => {
      d.createRAWPackage('46');
      expect(d.messages[0].message).to.equal("01030046490002")
    })
  })
})
