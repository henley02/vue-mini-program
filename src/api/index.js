import fetch from 'public/js/fetch/index.js';

/**
 * 获取首页--分类
 * @param params
 */
export const getProductClassify = (params) => fetch({method: 'api.ebusiness.allCategoryShow.get', type: 'STANDARD', ...params}, {isLoading: true});
