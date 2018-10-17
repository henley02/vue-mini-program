/**
 * 存储
 */
export default {
  save(key, value) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: value,
        success: function () {
          resolve(true);
        },
        fail: function () {
          reject(new Error('保存数据失败'));
        }
      });
    });
  },
  get(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: function (data) {
          resolve(data);
        },
        fail: function () {
          reject(new Error('获取数据失败'));
        }
      });
    });
  },
  remove(key) {
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key: key,
        success: function () {
          resolve(true);
        },
        fail: function () {
          reject(new Error('清空数据失败'));
        }
      });
    });
  }
};
