import axios from 'axios';

axios.defaults.adapter = function (config) {
  wx.showLoading({title: '拼命加载中...'});
  return new Promise((resolve, reject) => {
    console.log(config);
    wx.request({
      ...config,
      url: config.url,
      data: config.params,
      success: res => {
        if (res.statusCode < 200 || res.statusCode > 300) {
          return reject(res.data || {});
        }
        return resolve(res.data || {});
      },
      complete: res => {
        wx.hideLoading();
      }
    });
  });
};
export default axios;
