import {tenantId, apiUrl} from 'public/config/index.js';

import getPostParameter from './postparameter.js';

/**
 * POST请求
 * @param data 数据
 * @param config 配置文件
 * @returns {Promise}
 */
function fetch(data, config) {
  if (config.isLoading) {
    wx.showLoading({title: '拼命加载中...'});
  }
  data.tenantId = tenantId;
  let postParameter = getPostParameter(data);
  console.log(postParameter);
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
        return resolve(res.data || {});
      },
      fail: error => {
        console.log(error);
      },
      complete: res => {
        wx.hideLoading();
      }
    });
  });
};

export default fetch;
