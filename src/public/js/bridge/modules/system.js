export default {
  /**
   * 获取dom元素信息
   * @param el
   * @returns {Promise}
   */
  getElementInfo(el) {
    return new Promise((resolve, reject) => {
      try {
        let query = wx.createSelectorQuery();
        query.select(el).boundingClientRect();
        query.exec((res) => {
          console.log(res);
          resolve(res[0]);
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  }
};
