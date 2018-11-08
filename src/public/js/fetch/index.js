import {apiUrl, tenantId} from 'public/config/index.js';

import getPostParameter from './postparameter.js';

/**
 * POST请求
 * @param data 数据
 * @param config 配置文件
 * @returns {Promise}
 */
function fetch(data, config) {
  if (config.isLoading) {
    wx.showLoading({title: '加载中...'});
  }
  if (data.method === 'api.system.member.login') {
    data.tenantid = tenantId;
  } else {
    data.tenantId = tenantId;
  }
  let postParameter = getPostParameter(data);
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${apiUrl}`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: postParameter,
      method: 'POST',
      success: function (res) {
        if (res.statusCode < 200 || res.statusCode > 300) {
          return reject(res.data || {});
        }
        if (res.data.code === '21') {
          wx.redirectTo({
            url: '/pages/user/login/main'
          });
        } else {
          return resolve(res.data || {});
        }
      },
      fail: error => {
        console.log(error);
        if (error.errMsg.indexOf('timeout') > -1) {
          this.$bridge.dialog.alert({content: '请求超时,稍后再试'});
        }
      },
      complete: res => {
        if (config.isLoading) {
          wx.hideLoading();
        }
      }
    });
  });
};

export default fetch;
