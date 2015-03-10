var kdtApi = require('../');
var config = require('../config')

var api = new kdtApi(config.appid, config.secret);

api.get('kdt.trades.sold.get', {status: 'WAIT_BUYER_CONFIRM_GOODS'}, function (err, result) {
  console.dir(result);
});
