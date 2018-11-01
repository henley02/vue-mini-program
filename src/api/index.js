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
export const fetchUserInfo = (params, config) => fetch({method: 'api.ebusiness.memberDetailIndex.get', ...params}, config);

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
 * 注册设置登录密码
 * @param params
 */
export const registerSetLoginPassword = (params) => fetch({method: 'api.security.loginPassword.updateByVerifyCode', ...params}, {isLoading: true});

/**
 * 修改登录密码
 * @param params
 */
export const changeLoginPassword = (params) => fetch({method: 'api.security.loginPassword.modify', ...params}, {isLoading: true});

/**
 * 修改支付密码
 * @param params
 */
export const changePaymentCode = (params) => fetch({method: 'api.security.userTransactionPassword.update', ...params}, {isLoading: true});

/**
 * 更新用户头像
 * @param params
 */
export const changeAvatar = (params) => fetch({method: 'api.master.user.avatar.update', ...params}, {isLoading: true});

/**
 * 更新个人资料
 * @param params
 */
export const updateMember = (params) => fetch({method: 'api.master.membership.member.update', ...params}, {isLoading: true});

/**
 * 获取收货地址列表
 * @param params
 * @param config
 */
export const fetchAddressList = (params, config) => fetch({method: 'api.master.membership.memberLocation.find', ...params}, config);

/**
 * 根据某条收货地址id获取对应的信息
 * @param params
 */
export const fetchAddressById = (params) => fetch({method: 'api.master.membership.memberLocation.find', ...params}, {isLoading: true});

/**
 * 删除收货地址
 * @param params
 */
export const delAddress = (params) => fetch({method: 'api.master.membership.memberLocation.delete', ...params}, {isLoading: true});

/**
 * 添加新的收货地址
 * @param params
 */
export const addAddress = (params) => fetch({method: 'api.master.membership.memberLocation.create', ...params}, {isLoading: true});

/**
 * 更新收货地址
 * @param params
 */
export const updateAddress = (params) => fetch({method: 'api.master.membership.memberLocation.update', ...params}, {isLoading: true});

/**
 * 获取省市区的信息
 * @param params
 */
export const getAreaListByPid = (params) => fetch({method: 'api.data.areaListByPid.get', ...params}, {isLoading: false});

/**
 * 获取积分兑换记录
 * @param params
 * @param config
 */
export const fetchPointRecordList = (params, config) => fetch({method: 'api.ebusiness.orderNew.find', ...params}, config);

/**
 * 积分确认收货按钮
 * @param params
 */
export const pointConfirmReceiving = (params) => fetch({method: 'api.ebusiness.order.sign', ...params}, {isLoading: true});

/**
 * 获取消费记录
 * @param params
 * @param config
 */
export const fetchConsumptionRecords = (params, config) => fetch({method: 'api.ebusiness.memberTransactionNew.find', ...params}, config);

/**
 * 我的账户 - 获取会员信息
 * @param params
 * @param config
 */
export const fetchMembership = (params) => fetch({method: 'api.master.membership.member.get', ...params}, {isLoading: true});

/**
 * 我的账户 - 查询我的余额
 * @param params
 */
export const fetchMemberBalance = (params) => fetch({method: 'api.membership.memberBalance.get', ...params}, {isLoading: true});
