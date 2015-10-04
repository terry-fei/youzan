node-kdt
========

nodejs sdk for koudaitong.com
now change to youzan.com

## Usage
```js
var KDT = require('node-kdt');
var api = new KDT(appid, secret);

var params = {
  tid: 'E123456'
};

api.get('kdt.trade.get', params, function (err, result) {
  if (err) return handle(err);
  // deal with the result
});
```
only support `get` method now

## License
The MIT license.
