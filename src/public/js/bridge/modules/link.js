function jump(url) {
  wx.navigateTo({url});
}

export default {
  navigateTo(url) {
    jump(url);
  },
  /**
   * 跳转到登录
   */
  goLogin() {
    jump('/pages/user/login/main');
  },
  /**
   * 跳转到首页
   */
  goIndex() {
    jump('/pages/index/main');
  },
  /**
   * 跳转到注册协议
   */
  goRegisterAgreement() {
    jump('/pages/user/register-agreement/main');
  },
  goSearch() {
    jump('/pages/search/main');
  }
};
