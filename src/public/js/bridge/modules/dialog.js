export default {
  /**
   * 确认弹框
   * @param options
   */
  confirm(options) {
    wx.showModal({
      title: options.title || '',
      content: options.content,
      confirmText: options.confirmText || '确认',
      cancelText: options.cancelText || '取消',
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          if (options.confirmCallback) {
            options.confirmCallback();
          }
        } else {
          if (options.cancelCallback) {
            options.cancelCallback();
          }
        }
      }
    });
  },
  /**
   * alert弹框
   * @param options
   */
  alert(options) {
    wx.showModal({
      content: options.content,
      showCancel: false,
      text: '111取消',
      success: function (res) {
        if (res.confirm) {
          if (options.confirmCallback) {
            options.confirmCallback();
          }
        }
      }
    });
  }
};
