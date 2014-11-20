var urllib = require('urllib');
var moment = require('moment');
var crypto = require('crypto');
var _ = require('lodash');
var querystring = require('querystring');

/**
 * 根据appid和appsecret创建API的构造函数
 * @param {String} appid       在口袋通申请得到的appid
 * @param {String} appsecret   在口袋通申请得到的app secret
 * @param {String} format      （可选）指定响应格式。默认json,目前支持格式为json
 * @param {String} apiVersion  （可选）API协议版本，可选值:1.0，默认1.0
 * @param {String} signMethod  （可选）参数的加密方法选择。默认为md5，可选值是：md5
 */
var API = function (appid, appsecret, format, apiVersion, signMethod) {
  this.appid = appid;
  this.appsecret = appsecret;
  this.format = format || 'json';
  this.v = apiVersion || '1.0';
  this.signMethod = signMethod || 'md5';
  this.prefix = 'http://open.koudaitong.com/api/entry';
};

API.prototype.get = function(method, apiParams, callback) {
  var url = this.buildRequestUrl(method, apiParams);
  var opts = {
    method: 'GET',
    dataType: 'json',
    timeout: 3000
  };
  urllib.request(url, opts, function (err, data, res) {
    if (err) {
      callback(err);
      return;
    }
    if (res.statusCode === 200) {
      callback(null, data);
    } else {
      callback(new Error('error statusCode'));
    }
  });
};

API.prototype.buildRequestUrl = function(method, apiParams) {
  var params = [];
  params.push({name: 'app_id', value: this.appid});
  params.push({name: 'method', value: method});
  params.push({name: 'timestamp', value: moment().format('YYYY-MM-DD HH:mm:ss')});
  params.push({name: 'format', value: this.format});
  params.push({name: 'v', value: this.v});
  params.push({name: 'sign_method', value: this.signMethod});
  for (key in apiParams) {
    params.push({name: key, value: apiParams[key]});
  }
  params.push({name: 'sign', value: this.sign(params)});
  var _params = {};
  params.forEach(function(item) {
    _params[item.name] = item.value;
  });
  return this.prefix + '?' + querystring.stringify(_params);
};

API.prototype.sign = function(params) {
  var sortedParams = _.sortBy(params, 'name');
  var str = this.appsecret;
  sortedParams.forEach(function (item) {
    str += item.name;
    str += item.value;
  });
  str += this.appsecret;
  var result = crypto.createHash(this.signMethod).update(str).digest('hex');
  return result.toLowerCase();
};

module.exports = API;
