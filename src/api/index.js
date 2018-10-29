import fetch from 'public/js/fetch/index.js';

/**
 * 首页--获取分类
 * @param params
 */
export const getProductClassify = (params) => fetch({
  method: 'api.ebusiness.allCategoryShow.get',
  type: 'STANDARD',
  ...params
}, {isLoading: true});

/**
 * 首页--根据类别获取商品列表
 * @param params
 */
export const getGoodList = (params, config) => fetch({method: 'api.ebusiness.findCommodityExtend.advanced', ...params}, config);

/**
 * 获取电商承租人设置
 * @param params
 */
export const getMerchant = (params) => fetch({method: 'api.ebusiness.settingNonPassport.get', ...params}, {isLoading: true});

/**
 * 登录
 * @param params
 */
export const login = (params) => fetch({method: 'api.system.member.login', ...params}, {isLoading: true});

/**
 * 获取用户信息
 * @param params
 */
export const fetchUserInfo = (params) => fetch({method: 'api.ebusiness.memberDetailIndex.get', ...params}, {isLoading: true});

/**
 * 获取我的积分
 * @param params
 */
export const fetchPoint = (params, config) => fetch({method: 'api.membership.memberPoint.get', ...params}, config);

/**
 * 签到
 * @param params
 * @param config
 */
export const signIn = (params) => fetch({method: 'api.ebusiness.signInNew.member', ...params}, {isLoading: true});

/**
 * 退出
 * @param params
 */
export const exit = (params) => fetch({method: 'api.security.passport.revoke', ...params}, {isLoading: false});

/**
 * 删除用户的权限
 * @param params
 */
export const deleteUserOauth = (params) => fetch({method: 'api.security.userOauth.delete', ...params}, {isLoading: false});

/**
 * 获取注册协议
 * @param params
 */
export const fetchRegisterAgreement = (params) => fetch({method: 'api.ebusiness.registrationAgreementNew.find', ...params}, {isLoading: true});

/**
 * 获取图形验证码
 * @param params
 */
export const fetchIdentifyingCode = (params) => fetch({method: 'api.security.loginCode.create', ...params}, {isLoading: false});

/**
 * 获取手机验证码
 * @param params
 */
export const fetchMobileVerificationCode = (params) => fetch({method: 'api.ebusiness.mobileVerificationCode.create', ...params}, {isLoading: true});

/**
 * 验证手机验证码
 * @param params
 */
export const mobileVerificationCodeCheck = (params) => fetch({method: 'api.security.valification.check', ...params}, {isLoading: true});

/**
 * 验证图形验证码
 * @param params
 */
export const checkGraphicVerificationCode = (params) => fetch({method: 'api.security.loginCode.check', ...params}, {isLoading: true});

/**
 * 注册获取主键id
 * @param params
 */
export const loginnewId = (params) => fetch({method: 'api.base.newId.get', ...params}, {isLoading: false});
/**
 * 注册
 * @param params
 */
export const register = (params) => fetch({method: 'api.ebusiness.memberNew.register', ...params}, {isLoading: true});

/**
 * 更改登录密码
 * @param params
 */
export const changeLoginPassword = (params) => fetch({method: 'api.security.loginPassword.updateByVerifyCode', ...params}, {isLoading: true});
