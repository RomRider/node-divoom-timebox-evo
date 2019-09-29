# node-divoom-timebox-evo

This module helps you generate the appropriate message to use against the divoom timebox evo.

The communication part is not implemented here and you can use the [bluetooth-serial-port](https://github.com/eelcocramer/node-bluetooth-serial-port) module to communicate with the timebox.

Here's how you could do it:
```js
const TIMEBOX_ADDRESS = "11:22:33:44:55:66";
var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
var Divoom = require('node-divoom-timebox-evo');

btSerial.findSerialPortChannel(TIMEBOX_ADDRESS, function(channel) {
  btSerial.connect(address, channel, function() {
    console.log('connected');

    btSerial.on('data', function(buffer) {
      console.log(buffer.toString('ascii'));
    });
  }, function () {
    console.log('cannot connect');
  });
}, function() {
  console.log('found nothing');
});


var d = (new Divoom.TimeboxEvo()).createRequest('animation');
d.read('animation.gif').then(result => {
  result.asBinaryBuffer().forEach(elt => {
    btSerial.write(elt,
      function(err, bytesWritten) {
        if (err) console.log(err);
      }
    );
  })
}).catch(err => {
  throw err;
});

```

# Protocol Documentation

See [Protocol](PROTOCOL.md)

# Install

```sh
npm i node-divoom-timebox-evo
```

# Some Examples

See the complete documentation [here](https://romrider.github.io/node-divoom-timebox-evo/docs/)

## Create a request

You'll always have to create a request first:
```js
var Divoom = require('node-divoom-timebox-evo');
var d = (new Divoom.TimeboxEvo()).createRequest('REQUEST_TYPE');

// d.messages.asBinaryBuffer() is an array of messages you have to send to your Timebox Evo over bluetooth as is. It returns an array of Buffers with Binary content.
console.log(d.messages.asBinaryBuffer());
```

The different `REQUEST_TYPE` are:
* `cloud`: Will interact with the [Cloud Channel](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/cloudchannel.html)
* `custom`: Will interact with the [Custom Channel](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/customchannel.html)
* `lightning`: Will interact with the [Lightning Channel](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/lightningchannel.html)
* `scoreboard`: Will interact with the [Scoreboard](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/scoreboardchannel.html)
* `time`: Will interact with the [Time Channel](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/timechannel.html)
* `vjeffect`: Will interact with the [VJ Effect Channel](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/vjeffectchannel.html)
* `brightness`: Will set the [brightness](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/brightnesscommand.html)
* `temp_weather`: Will set the [temperature and the weather](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/tempweathercommand.html)
* `text`: Will display some [text](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/displaytext.html)
* `picture` or `animation`: Will display a [picture or an animation](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/displayanimation.html)
* `raw`: To send a [RAW](https://romrider.github.io/node-divoom-timebox-evo/docs/classes/timeboxevorequest.html) command

## RAW Command

There's no need to calculate the size or the CRC of the messages. This will be done automatically.

```js
var Divoom = require('node-divoom-timebox-evo');

var d = (new Divoom.TimeboxEvo()).createRequest('raw');
d.push("4505");
d.messages.forEach(m => {
  console.log(m.message);
}) // Will display the list of messages as hexadecimals strings
console.log(d.messages.asBinaryBuffer());
```

## Displaying an animation or a picture

```js
var Divoom = require('node-divoom-timebox-evo');

var d = (new Divoom.TimeboxEvo()).createRequest('animation');
d.read('file.png').then(result => {
  console.log(result.asBinaryBuffer());
  // send toSend to the Divoom
  // use https://github.com/eelcocramer/node-bluetooth-serial-port
}).catch(err => {
  throw err;
});
```

## Displaying Text

You have a number of baked in palettes:
* `PALETTE_TEXT_ON_BACKGROUND(text?: ColorInput, background?: ColorInput)`: Sets the text color and the background color
* `PALETTE_BLACK_ON_RAINBOW`: Black text on a rainbow background
* `PALETTE_BLACK_ON_CMY_RAINBOW`: Black text on a CMY rainbow background

And a number of baked in animations:
* `ANIM_STATIC_BACKGROUND`: Background will not change color (useful with `PALETTE_TEXT_ON_BACKGROUND`)
* `ANIM_UNI_GRADIANT_BACKGROUND`: Uniform background which will loop over all the colors of your palette
* `ANIM_VERTICAL_GRADIANT_BACKGROUND`: Vertical gradient background which will loop over all the colors of your palette
* `ANIM_HORIZONTAL_GRADIANT_BACKGROUND`: Horizontal gradient background which will loop over all the colors of your palette

```js
var Divoom = require('node-divoom-timebox-evo');

var d = (new Divoom.TimeboxEvo()).createRequest('text', {text: "Hi friends!"});
d.paletteFn = d.PALETTE_BLACK_ON_CMY_RAINBOW; // Baked in color palette, but you can define your own
d.animFn = d.ANIM_HORIZONTAL_GRADIANT_BACKGROUND; // Baked in animation, but you can define your own

// This contains what is required to bootstrap the display on the Timebox
console.log(d.messages.asBinaryBuffer());

// Then you have to send your animation frame by frame, I suggest that you do no go over 30 message per second, if you do, the timebox will disconnect.
// This would generate 512 animation frames.
for (i = 0; i < 512; i++){
    console.log(d.getNextAnimationFrame().asBinaryBuffer());
}
```

You can define your own palette, the function has to return an array of 256 colors in Hex.<br/>
The text's color will be the item `(background_color + 127) % 256`.
This is the code which generates the `PALETTE_BLACK_ON_RAINBOW`:
```typescript
d.paletteFn = function() {
  function number2HexString(int: number): string {
    return Math.round(int).toString(16).padStart(2, "0");
  }

  let palette: string[] = [];
  const size = 127;
  function sin_to_hex(i: number, phase: number) {
    let sin = Math.sin(Math.PI / size * 2 * i + phase);
    let int = Math.floor(sin * 127) + 128;
    return number2HexString(int);
  }

  for (let i = 0; i < size; i++) {
    let red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
    let blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
    let green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg
    palette.push(red + green + blue);
  }

  // Completes the palette (everything after the 127th item in the array) with black color so that the text is actually only black
  for (let i = palette.length; i < 256; i++) {
    palette.push("000000");
  }
  return palette;
}
```

You can also define your own animation. It should be an array of 256 entries each one representing a pixel and referencing the index of the color to be displayed, taken from the palette. The function takes a frame number as a parameter.<br/>
Example which generated the horizontal gradient background (`ANIM_HORIZONTAL_GRADIANT_BACKGROUND`):
```typescript
d.animFn = function(frame) {
  let pixelArray = [];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      pixelArray.push((x + frame) % 127)
    }
  }
  return pixelArray;
}
```
