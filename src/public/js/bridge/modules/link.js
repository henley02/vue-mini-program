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
    wx.redirectTo({
      url: '/pages/user/login/main'
    });
  },
  /**
   * 跳转到首页
   */
  goIndex() {
    wx.switchTab({
      url: '/pages/index/main'
    });
  },
  /**
   * 跳转到注册协议
   */
  goRegisterAgreement() {
    jump('/pages/user/register-agreement/main');
  },
  /**
   * 跳转到查询页面
   */
  goSearch() {
    jump('/pages/search/main');
  },
  /**
   * 跳转到商品详情页面
   * @param id
   */
  goProductDetail(id) {
    jump('/pages/detail/main?id=' + id);
  },
  /**
   * 跳转到账户安全
   */
  goAccountSafety() {
    jump('/pages/user/account-safety/main');
  }
};
