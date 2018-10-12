import http from 'public/js/fetch/index';

export const groupDetail = () => {
  return http({url: 'http://ustbhuangyi.com/sell/api/goods', method: 'get'});
};
