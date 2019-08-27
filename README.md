
# Divoom Timebox Evo
This protocol documentation is for the Divoom Timebox Evo only.
All the code examples are going to be in `javascript`.

This is inspired by:
* https://github.com/MarcG046/timebox
* https://github.com/derHeinz/divoom-adapter
* https://github.com/mumpitzstuff/fhem-Divoom
* https://github.com/MarcG046/timebox/blob/master/doc/protocol.md

## Least Significant Byte first
Numbers (especially lenghts) are coded in LSB first
To find the resulting number:
* `byte1 = value & 0xFF`
* `byte2 = (value >> 8) & 0xFF`
* `Result = (byte1.toHexString() + byte2.toHexString())`

`toHexString()` would be a function to convert a decimal number (`from 0 to 255`) to its hexadecimal string equivalent.

That would be the function for lenght in `js`
```js
function int2hexlittle(value) {
    const byte1 = (value & 0xFF).toString(16).padStart(2, "0");
    const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, "0");
    return `${byte1}${byte2}`;
}
```

## Sending Messages

`01 LLLL PAYLOAD CCCC 02`

* All the messages will start with `01` and end with `02`
* `LLLL` is the length of the `PAYLOAD` string + the lenght of the CRC (`4`) in number of bytes (`FF` is one byte for exemple)
  ```js
  function getLength (payload) {
    // CRC is 4 characters
    // We divide by 2 because 1 byte is 2 Hex char
    const lenght = (payload.length + 4) / 2;
    return int2hexlittle(length);
  }
  ```
* `CCCC` is the CRC of the message including the length (`LLLL PAYLOAD`)
  ```js
  function getCRC(str) {
    let sum = 0;
    for (i = 0, l = str.length; i < l; i += 2) {
      sum += parseInt(str.substr(i, 2), 16)
    }
    const byte1 = (sum & 0xFF).toString(16).padStart(2, "0");
    const byte2 = ((sum >> 8) & 0xFF).toString(16).padStart(2, "0");
    return int2hexlittle(sum);
  }
  ```
  * `PAYLOAD` is anything based on the documentation below

-----

## Setting parameters of the Timebox

### Set Temperature and Weather

Full String: `5F TT WW`

`5F`: Fixed String<br />
`TT`: Temperature encoded on 1 byte<br />
* If temperature is `0 >= Temp > 128`: `TT` is the value of the temperature in Hexadecimal
* If temperature is `-128 < Temp < 0`: `TT` is 256 - temperature value in Hexadecimal
  ```js
  if (temp >= 0) {
      encodedTemp = temp.toString(16).padStart(2, "0");
  } else {
      let value = 256 - temp
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

### Set brightness

Full String: `74 BB`

`74`: Fixed String<br />
`BB`: Brightness in Hex (0 - 100 values only)<br />
```js
brightness = Math.ceil(brightness / highestBrightnessValue * 100).toString(16).padStart(2, "0")
```

----

## Channels

### Switching to a channel

`45`: Fixed to say we're switching to a channel<br />
`XX`: Channel number, followed by...

* `00`: [Time](#time)
* `01`: [Lightning](#lightning)
* `02`: [Cloud Channel](#cloud-channel)
* `03`: [VJ Effects](#vj-effects)
* `04`: [Visualization](#visualization)
* `05`: [Animation](#animation)

There are optional parameters for each channel. If unspecified, it will just switch the channel.

### Specific channel options

#### Time

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

#### Lightning

TBD?

#### Cloud Channel

TDB?

#### VJ Effects

TDB

#### Visualization

TDB

#### Animation

TBD?

## Animations & Images

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
