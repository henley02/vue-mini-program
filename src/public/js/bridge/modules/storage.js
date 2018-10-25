/**
 * 存储
 */
export default {
  /**
   * 保存数据
   * @param key
   * @param value
   */
  save(key, value) {
    wx.setStorageSync(key, value);
  },
  /**
   * 获取数据
   * @param key
   * @returns {*}
   */
  get(key) {
    return wx.getStorageSync(key);
  },
  /**
   * 删除数据
   * @param key
   */
  remove(key) {
    wx.removeStorageSync(key);
  }
};
