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
    console.log(result.getDivoomBinaryBuffer());
    // send toSend to the Divoom
    // use https://github.com/eelcocramer/node-bluetooth-serial-port
  });
  ```

See the complete documentation [here](https://romrider.github.io/divoom-timebox-evo/)
