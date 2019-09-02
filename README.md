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


var d = new Divoom.DivoomTimeBoxEvoProtocol;
d.displayAnimation('animation.gif').then(result => {
  result.messages.asBinaryBuffer().forEach(elt => {
    btSerial.write(elt,
      function(err, bytesWritten) {
        if (err) console.log(err);
      }
    );
  })
});

```

# Protocol Documentation

See [Protocol](PROTOCOL.md)

# Install

```sh
npm i node-divoom-timebox-evo
```

# Usage (TBD)

* javascript
  ```js
  var Divoom = require('node-divoom-timebox-evo');

  var d = new Divoom.DivoomTimeBoxEvoProtocol;
  d.displayAnimation('file.png').then(result => {
    console.log(result.messages);
    // send toSend to the Divoom
    // use https://github.com/eelcocramer/node-bluetooth-serial-port
  });
  ```

See the complete documentation [here](https://romrider.github.io/divoom-timebox-evo/docs/)
