export default {
  /**
   * 判断微信是否授权
   * @returns {Promise}
   */
  isAuthorization() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  },
  /**
   * 微信登录
   * @returns {Promise}
   */
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: () => {
          resolve(true);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
};
