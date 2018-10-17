export default {
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
  },
  /**
   * 获取微信用户信息
   * @returns {Promise}
   */
  getWXUserInfo() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              resolve(res.userInfo);
            },
            fail: (error) => {
              reject(error);
            }
          });
        }
      });
    });
  },
  authorize() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: () => {
          wx.authorize({
            success: (res) => {
              resolve(res);
            },
            fail: (error) => {
              reject(error);
            }
          });
        }
      });
    });
  }
};
