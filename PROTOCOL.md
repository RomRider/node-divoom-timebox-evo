
# Divoom Timebox Evo <!-- omit in toc -->
This protocol documentation is for the Divoom Timebox Evo only.
All the code examples are going to be in `javascript`.

This is inspired by:
* https://github.com/MarcG046/timebox
* https://github.com/derHeinz/divoom-adapter
* https://github.com/mumpitzstuff/fhem-Divoom
* https://github.com/MarcG046/timebox/blob/master/doc/protocol.md

# TOC <!-- omit in toc -->

- [Least Significant Byte first (LSB First)](#least-significant-byte-first-lsb-first)
- [Sending Messages](#sending-messages)
  - [Setting parameters of the Timebox](#setting-parameters-of-the-timebox)
    - [Set Temperature and Weather](#set-temperature-and-weather)
    - [Set Brightness](#set-brightness)
  - [Commands](#commands)
    - [Requesting Settings](#requesting-settings)
  - [Channels](#channels)
    - [Switching to a channel](#switching-to-a-channel)
    - [Specific channel options](#specific-channel-options)
      - [Time](#time)
      - [Lightning](#lightning)
      - [Cloud Channel](#cloud-channel)
      - [VJ Effects](#vj-effects)
      - [Visualization](#visualization)
      - [Animation](#animation)
      - [Scoreboard](#scoreboard)
  - [Animations & Images](#animations--images)
    - [Animations](#animations)
      - [Message Header](#message-header)
      - [Frame format](#frame-format)
    - [Images](#images)
- [Receiving messages](#receiving-messages)
  - [command 46 (WIP)](#command-46-wip)
  - [command 44 & 45](#command-44--45)
  - [command 31 & 32](#command-31--32)

# Documentation <!-- omit in toc -->
## Least Significant Byte first (LSB First)
Numbers (especially lenghts) are coded in LSB first
To find the resulting number:
* `byte1 = value & 0xFF`
* `byte2 = (value >> 8) & 0xFF`
* `Result = (byte1.toHexString() + byte2.toHexString())`

`toHexString()` would be a function to convert a decimal number (`from 0 to 255`) to its hexadecimal string equivalent.

That would be the function in `js`
```js
function int2hexlittle(value) {
    const byte1 = (value & 0xFF).toString(16).padStart(2, "0");
    const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, "0");
    return `${byte1}${byte2}`;
}
```

## Sending Messages

`01 LLLL PAYLOAD CRCR 02`

* All the messages will start with `01` and end with `02`
* `LLLL` is the length of the `PAYLOAD` string + the lenght of the CRC (`4`) in number of bytes (`FF` is one byte for exemple) in LSB First
  ```js
  function getLength (payload) {
    // CRC is 4 characters
    // We divide by 2 because 1 byte is 2 Hex char
    const lenght = (payload.length + 4) / 2;
    return int2hexlittle(length);
  }
  ```
* `CRCR` is the CRC of the message including the length (`LLLL PAYLOAD`) in LSB First
  ```js
  function getCRC(str) {
    let sum = 0;
    for (i = 0, l = str.length; i < l; i += 2) {
      sum += parseInt(str.substr(i, 2), 16)
    }
    return int2hexlittle(sum);
  }
  ```
  * `PAYLOAD` is anything based on the documentation below

-----

### Setting parameters of the Timebox

#### Set Temperature and Weather

Full String: `5F TT WW`

`5F`: Fixed String<br />
`TT`: Temperature encoded on 1 byte<br />
* If temperature is `0 >= Temp > 128`: `TT` is the value of the temperature in Hexadecimal
* If temperature is `-128 < Temp < 0`: `TT` is 256 - temperature value in Hexadecimal
  ```js
  if (temp >= 0) {
      encodedTemp = temp.toString(16).padStart(2, "0");
  } else {
      let value = 256 + temp
      encodedTemp = value.toString(16).padStart(2, "0");
  }
  ```
`WW`: Weather encoded on 1 byte:
* `01`: Clear Weather
* `03`: Cloudy Sky
* `05`: Thunderstorm
* `06`: Rain
* `08`: Snow
* `09`: Fog

#### Set Brightness

Full String: `74 BB`

`74`: Fixed String<br />
`BB`: Brightness in Hex (0 - 100 values only)<br />
```js
function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function getBrightness(brightness, min_bri, max_bri) {
  return Math.ceil(map(brightness, min_bri, max_bri, 0, 100)).toString(16).padStart(2, "0")
}
```

----

### Commands

#### Requesting Settings

Full String: `46`<br />
The box will answer with a message. See [here](#command-46) for how to interpret the answer.

----

### Channels

#### Switching to a channel

`45`: Fixed to say we're switching to a channel<br />
`XX`: Channel number, followed by...

* `00`: [Time](#time)
* `01`: [Lightning](#lightning)
* `02`: [Cloud Channel](#cloud-channel)
* `03`: [VJ Effects](#vj-effects)
* `04`: [Visualization](#visualization)
* `05`: [Animation](#animation)
* `06`: [Scoreboard](#scoreboard)

There are optional parameters for each channel. If unspecified, it will just switch the channel.

#### Specific channel options

##### Time

Full String: `450001 TT XX WW EE CC RRGGBB`

`450001`: Fixed AFAIK<br />
`TT`: Type of clock
* `00`: Full screen
* `01`: Rainbow
* `02`: With Box
* `03`: Analog Square
* `04`: Full Screen negative
* `05`: Analog Round

`XX`: Show Time: `00` to not display it, `01` to show it<br />
`WW`: Show Weather: `00` to not display it, `01` to show it<br />
`EE`: Show Temperature: `00` to not display it, `01` to show it<br />
`CC`: Show Calendar: `00` to not display it, `01` to show it<br />
`RRGGBB`: Color of the clock in Hex<br />

##### Lightning

Full String: `4501 RRGGBB BB TT PP 000000`

`4501`: Fixed String<br />
`RRGGBB`: Color encoded in Hexadecimal<br />
`BB`: Brightness (0 - 100) in Hexadecimal<br />
`TT`: Type of Lightning<br />
* `00`: Plain color
* `01`: Love
* `02`: Plants
* `03`: No Mosquitto
* `04`: Sleeping

`PP`: Power should usually be `01` (`00` would turn off the display)<br />
`000000`: Fixed String

##### Cloud Channel

Full String: `4502`<br />
There is no option for this one.

##### VJ Effects

Full String: `4503 TT`

`4503`: Fixed String<br />
`TT`: Type of VJ Effect from the image below<br />
![VJ Channels](images/VJ&#32;Channels.png)

##### Visualization

Full String: `4504 TT`

`4504`: Fixed String<br />
`TT`: Type of Visualization from the image below<br />
![Visualization](images/Visualizers.png)

##### Animation

Upload animations not yet reversed engineered

##### Scoreboard

Full String: `450600 RRRR BBBB`

`450600`: Fixed AFAIK<br />
`RRRR`: Score for Red player<br />
`BBBB`: Score fore Blue player<br />

The score format is from 0 to 999 encoded in Hexadecimal LSB First.
```js
function getScoreBoardEncoded(red, blue) {
  return int2hexlittle(Math.min(999, red))+int2hexlittle(Math.min(999, blue))
}
```

### Animations & Images

#### Animations

I didn't yet find a way to send all the 9 animations like like you would do with the app. However this section covers a way to send an endless looping animation that will be displayed on screen.

Each message's payload needs to be `400` excluding header, size, crc and trailer
```
01 LLLL 49 XXXX XX PAYLOAD CCCC 02
```
The payload is all the frames concatenated in one string and then split every 400 characters

##### Message Header

`49 XXXX XX`<br />
`49`: Fixed to say we're sending an animation<br />
`XXXX`: Sum of all sizes of all frames (after `AA`) (LSB: `byte 1 & 0xFF`, `(byte 2 >> 8) & 0xFF`)<br />
`XX`: Packet Number (each packet has a data payload of 400 top)<br />

##### Frame format

`AA`: Frame Start<br />
`XXXX`: Frame length / 2 (byte 1 & 0xFF, (byte 2 >> 8) & 0xFF)<br />
TTTT = TT Time in ms (byte 1 & 0xFF, (byte 2 >> 8) & 0xFF)<br />
XX = Reset Palette 01 else 00 (Reset palette if number of colors since begining > 256)<br />
XX = Nb of Colors<br />
Then color list<br />
Then image<br />

Split when data (exlucing the first 8 caracters) is = 400)


#### Images

TBD

----

## Receiving messages

The answer is always in this format:
`01 LLLL 04 CC 55 PAYLOAD CRCR 02`

`01`: Start of the message<br />
`LLLL`: the length of the command which is between the first `01` and the last `02` in LSB First<br />
`PAYLOAD`: The content of the message<br />
`CRCR`: The CRC of the message<br />
`02`: Fixed

The `PAYLOAD` will usually be of this format:<br />
`04`: Fixed AFAIK<br />
`CC`: Command number<br />
`55`: Fixed AFAIK<br />
`CMDDATA`: The data associated to the command

```js
var hexlify = function(str) {
    var result = '';
    var padding = '00';
    for (var i=0, l=str.length; i<l; i++) {
      var digit = str.charCodeAt(i).toString(16);
      var padded = (padding+digit).slice(-2);
      result += padded;
    }
    return result;
  };

function divoomBufferToString(raw) {
  return hexlify(raw.toString('ascii'));
}

function parseDivoomMessage(msg) {
  let answer = {};
  answer.ascii = msg;
  answer.crc = msg.slice(-6, msg.length - 2);
  answer.payloadLength = msg.slice(2, 6);
  answer.command = msg.slice(8, 10);
  answer.fixed = msg.slice(10, 12);
  answer.cmddata = msg.slice(12, msg.length - 6);
  return answer;
}
```

### command 46 (WIP)

Example `PAYLOAD`: `044655 CC 00004a007f BB 7f010b BB 017f007f00010001000100`

`044655`: Fixed String<br />
`CC`: Channel currently displayed (See [here](#channels) for the code list)<br />
`BB`: Brightness in Hexadecimal (from `0` to `100` dec - `0x0` to `0x64` hex). It seems the value is at 2 positions<br />

### command 44 & 45

Example `PAYLOAD`:
* `044455 CC`
* `044555 CC`

`044455` or `044555`: Fixed String<br />
`CC`: Channel currently displayed (See [here](#channels) for the code list)<br />

### command 31 & 32
Example `PAYLOAD`:
* `043155 BB`
* `043255 BB`

`043155` or `043255`: Fixed String<br />
`BB`: Brightness in Hexadecimal (from `0` to `100` dec - `0x0` to `0x64` hex)<br />
