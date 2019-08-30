import rewire from "rewire";
import { expect } from 'chai';
import { DivoomTimeBoxEvoProtocol } from '../src/index';
import { WeatherType } from '../src/types';
import 'mocha';

describe('DivoomTimeBoxProtocol class', () => {
  function strip(msg: string | undefined) {
    return msg === undefined ? undefined : msg.slice(6, -6);
  }
  describe('class private properties', () => {
    const Divoom = rewire('../src/index.ts');
    const DivoomTimeBoxEvoProtocol = Divoom.__get__("DivoomTimeBoxEvoProtocol");

    const d = new DivoomTimeBoxEvoProtocol;
    d._setMessage("4500010001000100ff00ff")

    it('should set the proper _length', () => {
      expect(d._length).to.equal("0d00");
    })

    it('should set the proper _crc', () => {
      expect(d._crc).to.equal('5302');
    });

    it('should set the proper _message', () => {
      expect(d._message).to.equal('4500010001000100ff00ff');
    })

    it('should set the proper _fullMessage', () => {
      const shouldBe = ["010d004500010001000100ff00ff530202"];
      const is = d._fullMessage;

      expect(is.length).to.equal(shouldBe.length);
      is.forEach((slice: string, index: number) => {
        expect(slice).to.equal(shouldBe[index])
      });
    })

    const d2 = new DivoomTimeBoxEvoProtocol;
    d2._setMessage("44000A0A04AA0000000000fd726f5f7674687c7a6e7b7b6d8281728a8a7b8b8c8087897e83847b74756e53534f6e6e6662615a82837f9d9d9a8c8c8674716278766b7d7b6f7c7c7067685e3345432e414061746b576660777869b6b7a5c5c4b2c2c0b2898a869b9c978a8a857470615b4d3e5d49398080736a6b614a6261324e4f80928a6e8079949586d5d6c2e2e2d1b7b6a991918e999b96888983716c5f4c392b4227178181747272694057562745467e9e936c7e75959685d1d2bee6e3cfacab9e959694969893858580676255564638442f21817f74828379545f5b44504d68766f5b635f6f6d619d9c8bd5d2bfa8a5999495908685825b564a5d5042483223807c708f908685857a49494791928d4645444849497c7e797b7b7793949182817c8785824d493d5d574a422f237b72676d6f64434a2d2323245d5d5c62615f393939666461636565a2a29d9492901c1c1c696663332e25625e543f342e4a4036312f2a2121221415170f10131213161a1c1f2122261d1e213b3b3e4747490d0d0f7571710808084c493f3e332d77675a908a8057514b6e686446434327292e35394130343b313439393c4034373b222527938c8c0c0c0b2b261f373431776659948f87464341afadaeaaa4a2a79d988d8583706c6d4c4d5444475041444b545354938b8b42260f4b2d12432d1d7b716a9f9e9b4a4542b6b5b7b2aeaeaca5a2aba39fa8a19a726c6d8f8b8d8782837d7575a7a1a66d4d2f6e461e73481f80573195816f49403bb4adacc4c3c9c8c4c9cac7cbd2ced49e9391a7a6ae767379938b8e928b919985758a5c2a895a2a9263309c703f49311d7556399b7c66c4babadddce6ebe9f3a39797aaa8b06f696c898080646269936e4793632d9767319f6f37ad7d435c4126815d39a17345a17448ba9b81dad0cfa69c9ca8a4ad7068678a81827d7781704d2b5d3d1d24211e24252355432e8d673bb08355ac8055a97a4ab38556b88f658c6c56968a8b5d5658827c817383a0343334151b1d141a2014191f665649c3a38abe9a7db8906cc19461c6996793714f645854302c2d75747d5d5b64000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c3d4d4e4f5051525354551e565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f0f1f2f3f4f5f6f7f8f9fafbfc")
    console.log(d2._)

    it('should split the message every 1332 characters', () => {
      const shouldBe = [
        "01050444000a0a04aa0000000000fd726f5f7674687c7a6e7b7b6d8281728a8a7b8b8c8087897e83847b74756e53534f6e6e6662615a82837f9d9d9a8c8c8674716278766b7d7b6f7c7c7067685e3345432e414061746b576660777869b6b7a5c5c4b2c2c0b2898a869b9c978a8a857470615b4d3e5d49398080736a6b614a6261324e4f80928a6e8079949586d5d6c2e2e2d1b7b6a991918e999b96888983716c5f4c392b4227178181747272694057562745467e9e936c7e75959685d1d2bee6e3cfacab9e959694969893858580676255564638442f21817f74828379545f5b44504d68766f5b635f6f6d619d9c8bd5d2bfa8a5999495908685825b564a5d5042483223807c708f908685857a49494791928d4645444849497c7e797b7b7793949182817c8785824d493d5d574a422f237b72676d6f64434a2d2323245d5d5c62615f393939666461636565a2a29d9492901c1c1c696663332e25625e543f342e4a4036312f2a2121221415170f10131213161a1c1f2122261d1e213b3b3e4747490d0d0f7571710808084c493f3e332d77675a908a8057514b6e686446434327292e35394130343b313439393c4034373b222527938c8c0c0c0b2b261f373431776659948f87464341afadaeaaa4a2a79d988d8583706c6d4c4d5444475041444b545354938b8b42260f4b2d12432d1d7b716a9f9e9b4a4542b6b5b7b2aeaeaca5a2aba39fa8a19a726c6d8f8b8d8782837d7575a7a1a66d4d2f6e461e73481f80573195816f49403bb4adacc4c3c9c8c4c9cac7cbd2ced49e9391a7a6ae767379938b8e928b919985758a5c2a895a2a9263309c703f49311d7556399b7c66c4babadddce6ebe9f3a39797aaa8b06f696c898080646269936e4793632d9767319f6f37ad7d435c4126815d39a17345a17448ba9b81dad0cf",
        "a69c9ca8a4ad7068678a81827d7781704d2b5d3d1d24211e24252355432e8d673bb08355ac8055a97a4ab38556b88f658c6c56968a8b5d5658827c817383a0343334151b1d141a2014191f665649c3a38abe9a7db8906cc19461c6996793714f645854302c2d75747d5d5b64000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c3d4d4e4f5051525354551e565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f0f1f2f3f4f5f6f7f8f9fafbfc5ec302"
      ];
      const is = d2._fullMessage;

      expect(is.length).to.equal(shouldBe.length);
      is.forEach((slice: string, index: number) => {
        expect(slice.length).to.be.lessThan(1333);
        expect(slice).to.equal(shouldBe[index])
      });
    })
  })

  describe('Time Channel', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should work with default properties', () => {
      d.displayTimePackage();
      expect(d.getDivoomMessageString()).to.equal("010d004500010001000000ffffff510302")
    })

    describe('Properties', () => {
      it('should set the type parameter correclty', () => {
        d.displayTimePackage(3);
        expect(d.getDivoomMessageString()!.slice(12, 14)).to.equal('03');
      })
      it('should set the time parameter correctly', () => {
        d.displayTimePackage(3, '#424242', false);
        expect(d.getDivoomMessageString()!.slice(14, 16)).to.equal('00');
        d.displayTimePackage(3, '#424242', true);
        expect(d.getDivoomMessageString()!.slice(14, 16)).to.equal('01');
      })
      it('should set the weather parameter correctly', () => {
        d.displayTimePackage(3, '#424242', true, false);
        expect(d.getDivoomMessageString()!.slice(16, 18)).to.equal('00');
        d.displayTimePackage(3, '#424242', true, true);
        expect(d.getDivoomMessageString()!.slice(16, 18)).to.equal('01');
      })
      it('should set the temperature parameter correctly', () => {
        d.displayTimePackage(3, '#424242', true, true, false);
        expect(d.getDivoomMessageString()!.slice(18, 20)).to.equal('00');
        d.displayTimePackage(3, '#424242', true, true, true);
        expect(d.getDivoomMessageString()!.slice(18, 20)).to.equal('01');
      })
      it('should set the calendar parameter correctly', () => {
        d.displayTimePackage(3, '#424242', true, true, true, false);
        expect(d.getDivoomMessageString()!.slice(20, 22)).to.equal('00');
        d.displayTimePackage(3, '#424242', true, true, true, true);
        expect(d.getDivoomMessageString()!.slice(20, 22)).to.equal('01');
      })
      it('should set the color correctly', () => {
        d.displayTimePackage(1, '#123456');
        expect(d.getDivoomMessageString()!.slice(22, 28)).to.equal('123456');
        d.displayTimePackage(1, '424242');
        expect(d.getDivoomMessageString()!.slice(22, 28)).to.equal('424242');
        d.displayTimePackage(1, 'rgb(255, 0, 0)');
        expect(d.getDivoomMessageString()!.slice(22, 28)).to.equal('ff0000');
        d.displayTimePackage(1, { r: 255, g: 0, b: 255 });
        expect(d.getDivoomMessageString()!.slice(22, 28)).to.equal('ff00ff');
        d.displayTimePackage(1, "red");
        expect(d.getDivoomMessageString()!.slice(22, 28)).to.equal('ff0000');
      })
      it('should fail if the color is not a color', () => {
        expect(() => d.displayTimePackage(1, '#ZZZZZZ')).to.throw(Error);
      })
    })
  })

  describe('Lightning Channel', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should work with default properties', () => {
      d.displayLightningPackage();
      expect(d.getDivoomMessageString()).to.equal("010d004501ffffff640001000000b50302")
    })
    describe('Properties', () => {
      it('should set the type correctly', () => {
        d.displayLightningPackage(3);
        expect(d.getDivoomMessageString()!.slice(18, 20)).to.equal('03');
      });

      it('should set the color correctly', () => {
        d.displayLightningPackage(1, '#123456');
        expect(d.getDivoomMessageString()!.slice(10, 16)).to.equal('123456');
        d.displayLightningPackage(1, '424242');
        expect(d.getDivoomMessageString()!.slice(10, 16)).to.equal('424242');
        d.displayLightningPackage(1, 'rgb(255, 0, 0)');
        expect(d.getDivoomMessageString()!.slice(10, 16)).to.equal('ff0000');
        d.displayLightningPackage(1, { r: 255, g: 0, b: 255 });
        expect(d.getDivoomMessageString()!.slice(10, 16)).to.equal('ff00ff');
        d.displayLightningPackage(1, "red");
        expect(d.getDivoomMessageString()!.slice(10, 16)).to.equal('ff0000');
      })

      it('should set the brightness correctly', () => {
        d.displayLightningPackage(3, 'FFFFFF', 32);
        expect(d.getDivoomMessageString()!.slice(16, 18)).to.equal('20');
        d.displayLightningPackage(3, 'FFFFFF', -1);
        expect(d.getDivoomMessageString()!.slice(16, 18)).to.equal('00');
        d.displayLightningPackage(3, 'FFFFFF', 255);
        expect(d.getDivoomMessageString()!.slice(16, 18)).to.equal('64');
      });

      it('should set the power correctly', () => {
        d.displayLightningPackage(3, 'FFFFFF', 100, false);
        expect(d.getDivoomMessageString()!.slice(20, 22)).to.equal('00');
        d.displayLightningPackage(3, 'FFFFFF', 100, true);
        expect(d.getDivoomMessageString()!.slice(20, 22)).to.equal('01');
      });

    })
  })

  describe('Cloud Channel', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should work with default properties', () => {
      d.displayCloudPackage();
      expect(d.getDivoomMessageString()).to.equal("01040045024b0002")
    })
  })

  describe('VJ Effects Channel', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should work with default properties', () => {
      d.displayVJEffectsPackage();
      expect(d.getDivoomMessageString()).to.equal("0105004503004d0002")
    })

    it('should set the proper type', () => {
      d.displayVJEffectsPackage(10);
      expect(d.getDivoomMessageString()).to.equal("01050045030a570002")
    })
  })

  describe('ScoreBoard Channel', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should work with default properties', () => {
      d.displayScoreBoardPackage();
      expect(d.getDivoomMessageString()).to.equal("01090045060000000000540002")
    })

    it('should set the proper score for the red player', () => {
      d.displayScoreBoardPackage(999, -1);
      expect(d.getDivoomMessageString()).to.equal("010900450600e70300003e0102")
    })
    it('should set the proper score for the blue player', () => {
      d.displayScoreBoardPackage(1000, 1000);
      expect(strip(d.getDivoomMessageString())).to.equal("450600e703e703")
    })
  })

  describe('Setting the temperature and the weather', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should set the weather properly', () => {
      d.setTempAndWeatherPackage(0, WeatherType.Fog);
      expect(strip(d.getDivoomMessageString())).to.equal("5f0009")
    })
    it('should handle positive temperature properly', () => {
      d.setTempAndWeatherPackage(42, WeatherType.Fog);
      expect(strip(d.getDivoomMessageString())).to.equal("5f2a09")
    })
    it('should handle negative temperature properly', () => {
      d.setTempAndWeatherPackage(-42, WeatherType.Fog);
      expect(strip(d.getDivoomMessageString())).to.equal("5fd609")
    })
    it('should fail if temperature is > 128', () => {
      expect(() => d.setTempAndWeatherPackage(129, WeatherType.Fog)).to.throw(Error)
    })
    it('should fail if temperature is < -127', () => {
      expect(() => d.setTempAndWeatherPackage(-128, WeatherType.Fog)).to.throw(Error)
    })
  })

  describe('Setting the brightness', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should set the brightness properly with values between 0 and 100', () => {
      d.setBrightness(42);
      expect(strip(d.getDivoomMessageString())).to.equal("742a");
      d.setBrightness(0);
      expect(strip(d.getDivoomMessageString())).to.equal("7400");
      d.setBrightness(100);
      expect(strip(d.getDivoomMessageString())).to.equal("7464");
    })
    it('should set the brightness properly', () => {
      d.setBrightness(255, 0, 255);
      expect(strip(d.getDivoomMessageString())).to.equal("7464");
      d.setBrightness(32, 0, 255);
      expect(strip(d.getDivoomMessageString())).to.equal("740d");
      d.setBrightness(0.5, 0, 1);
      expect(strip(d.getDivoomMessageString())).to.equal("7432");
    })
    it('should fail with brightness outside of the range with in_min or in_max unset', () => {
      expect(() => d.setBrightness(1000)).to.throw(Error);
      expect(() => d.setBrightness(1000, 0)).to.throw(Error);
    })
    it('should fail with brightness outside of the in_min/in_max range', () => {
      expect(() => d.setBrightness(1000, 0, 2)).to.throw(Error);
    })
  })

  describe('Displaying an image', () => {
    describe('sending a small image', () => {
      const d = new DivoomTimeBoxEvoProtocol;
      let shouldBe = [
        "01ba0144000a0a04aab301000000445d5e65000000ff00ffe21effe11fffc33cffc43dffa65bff8879ffa65aff8779ff6a96ffba46ffa55bff6996ff4cb4ff2ed1ffff01fff50bffd828ffb947ff9b64ff6a97ff10efff05fffb23ffdd41ffbf60ffa19c65ff7e83ff2ed2ff0efff15fffa12425289b65ff7e82ff5fa0ff11f0ff2dffd34bffb560a0ff42bfff24dcff10f0ff0ffff22cffd469ff9712121442beff07faff2dffd46aff9788ff7806faff19ffe737ffc987ff78a5ff5b06f9ff88ff79a6ff5bc4ff3ce2ff1f04fffbe2ff1effff0118e7ffffff000000000000000201000000000000000000000004048300000000000000000000000408850000000000000000000008100c07440000000000000000000818128a450000000000814020106034148e07241008040281886442a9042c8fc00593d16c0280c084c2e9041e9ec027a30185000040403422053ca580e9040a0000000020804aa956acd6c9f50200000000200053c558b2d38cf6020000000020a0aad96ea7192e17000000004040a5b3dd02811dafe70b00000040e0670b0400804000180c000080803010000000000020101806008040000000000000000000080400a8af02"
      ]
      before((done) => {
        d.displayAnimation('./test/inputs/Star CMY.png', done);
      })
      it('should issue the correct message', () => {
        expect(JSON.stringify(d.getDivoomMessageArray()).toLowerCase())
          .to.equal(JSON.stringify(shouldBe).toLowerCase());
      })
    })

    describe('sending a big image', () => {
      const d = new DivoomTimeBoxEvoProtocol;
      let shouldBe = [
        "010e0444000a0a04aa070400000000ffff00efff10dfff20cfff30bfff40afff509fff608fff707fff806fff905fffa04fffb03fffc02fffd01fffe00ffff0ffef00efef10dfef20cfef30bfef40afef509fef608fef707fef806fef905fefa04fefb03fefc02fefd01fefe00feff0ffdf00efdf10dfdf20cfdf30bfdf40afdf509fdf608fdf707fdf806fdf905fdfa04fdfb03fdfc02fdfd01fdfe00fdff0ffcf00efcf10dfcf20cfcf30bfcf40afcf509fcf608fcf707fcf806fcf905fcfa04fcfb03fcfc02fcfd01fcfe00fcff0ffbf00efbf10dfbf20cfbf30bfbf40afbf509fbf608fbf707fbf806fbf905fbfa04fbfb03fbfc02fbfd01fbfe00fbff0ffaf00efaf10dfaf20cfaf30bfaf40afaf509faf608faf707faf806faf905fafa04fafb03fafc02fafd01fafe00faff0ff9f00ef9f10df9f20cf9f30bf9f40af9f509f9f608f9f707f9f806f9f905f9fa04f9fb03f9fc02f9fd01f9fe00f9ff0ff8f00ef8f10df8f20cf8f30bf8f40af8f509f8f608f8f707f8f806f8f905f8fa04f8fb03f8fc02f8fd01f8fe00f8ff0ff7f00ef7f10df7f20cf7f30bf7f40af7f509f7f608f7f707f7f806f7f905f7fa04f7fb03f7fc02f7fd01f7fe00f7ff0ff6f00ef6f10df6f20cf6f30bf6f40af6f509f6f608f6f707f6f806f6f905f6fa04f6fb03f6fc02f6fd01f6fe00f6ff0ff5f00ef5f10df5f20cf5f30bf5f40af5f509f5f608f5f707f5f806f5f905f5fa04f5fb03f5fc02f5fd01f5fe00f5ff0ff4f00ef4f10df4f20cf4f30bf4f40af4f509f4f608f4f707f4f806f4f905f4fa04f4fb03f4fc02f4fd01f4fe00f4ff0ff3f00ef3f10df3f20cf3f30bf3f40af3f509f3f608f3f707f3f806f3f905f3fa04f3fb03f3fc02f3fd01f3fe00f3ff0ff2f00ef2f10df2f20cf2f30bf2f40af2f509f2f608f2f707f2f80",
        "6f2f905f2fa04f2fb03f2fc02f2fd01f2fe00f2ff0ff1f00ef1f10df1f20cf1f30bf1f40af1f509f1f608f1f707f1f806f1f905f1fa04f1fb03f1fc02f1fd01f1fe00f1ff0ff0f00ef0f10df0f20cf0f30bf0f40af0f509f0f608f0f707f0f806f0f905f0fa04f0fb03f0fc02f0fd01f0fe00f0ff0000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeffa30602"
      ]
      before((done) => {
        d.displayAnimation('./test/inputs/rainbow.png', done);
      })
      it('should issue the correct message', () => {
        expect(JSON.stringify(d.getDivoomMessageArray()).toLowerCase())
          .to.equal(JSON.stringify(shouldBe).toLowerCase());
      })
    })

    describe('error cases', () => {
      const d = new DivoomTimeBoxEvoProtocol;
      it('should fail when not sending an image', () => {
        expect(() => d.displayAnimation('./test/inputs/notanimage.png')).to.throw(Error);
      })
      it('should fail if the file does not exist', () => {
        expect(() => d.displayAnimation('./test/inputs/doesnotexist.png')).to.throw(Error);
      })

    })


  })

  describe('RAW Messages', () => {
    const d = new DivoomTimeBoxEvoProtocol;
    it('should return the proper message', () => {
      d.createRAWPackage('46');
      expect(d.getDivoomMessageString()).to.equal("01030046490002")
    })
  })
})
