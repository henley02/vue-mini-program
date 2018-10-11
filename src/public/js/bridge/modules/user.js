export default {
  login() {
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
  getUserInfo() {
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
