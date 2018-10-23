/* eslint-disable */
const MD5 = require('./../util/md5.js');
// appKey需要提供给商城使用，保持export
const {app_key, secret} = require('public/config/index.js');

const getStorageSync = (key) => {
  try {
    var value = wx.getStorageSync(key);
    if (value) {
      return value;
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
}

//判断obj是否为json对象
function isJson(obj) {
  var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
  return isjson;
}

export default function getPostParameter(request) {

  var param_array = new Object();

  let passportId = getStorageSync("passportId");
  let identityId = getStorageSync("identityId");

  if (passportId && passportId > 0) {
    param_array.passportId = passportId;
  }
  if (identityId && identityId > 0) {
    param_array.identityId = identityId;
  }

  param_array.format = 'json';
  param_array.sign_method = 'md5';
  param_array.timestamp = Date.parse(new Date());
  param_array.app_key = app_key;
  param_array.v = '1.0';

  for (var p in request) { // 方法
    if (request[p] != null && request[p] != undefined && typeof (request[p]) != "function") {
      param_array[p] = request[p];
    }
  }

  var param_sign, post_data;
  var arrayKeyTemp = [];
  for (var p in param_array) { // 方法
    if (typeof (param_array[p]) != "function") {
      arrayKeyTemp.push(p);
    }
  }

  // 最后显示所有的属性
  arrayKeyTemp.sort();

  var strTemp = secret;
  for (var i = 0; i < arrayKeyTemp.length; i++) {

    if (Array.isArray(param_array[arrayKeyTemp[i]])) {
      strTemp = strTemp + arrayKeyTemp[i] + JSON.stringify(param_array[arrayKeyTemp[i]]);
    } else {
      if (isJson(param_array[arrayKeyTemp[i]])) {
        strTemp = strTemp + arrayKeyTemp[i] + JSON.stringify(param_array[arrayKeyTemp[i]]);
      } else {
        strTemp = strTemp + arrayKeyTemp[i] + param_array[arrayKeyTemp[i]];
      }
    }
  }
  strTemp = strTemp + secret;
  param_sign = MD5.hexMD5(strTemp).toString().toUpperCase();
  post_data = 'sign=' + param_sign.toUpperCase();
  for (let i = 0; i < arrayKeyTemp.length; i++) {
    if (Array.isArray(param_array[arrayKeyTemp[i]])) {
      post_data = post_data + '&' + arrayKeyTemp[i] + '=' + encodeURI(JSON.stringify(param_array[arrayKeyTemp[i]]));
    } else {
      if (isJson(param_array[arrayKeyTemp[i]])) {
        post_data = post_data + '&' + arrayKeyTemp[i] + '=' + encodeURI(JSON.stringify(param_array[arrayKeyTemp[i]]));
      } else {
        post_data = post_data + '&' + arrayKeyTemp[i] + '=' + encodeURI(param_array[arrayKeyTemp[i]]);
      }
    }
  }
  return post_data;
};
