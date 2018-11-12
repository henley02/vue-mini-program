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
 * 获取商品详情
 * @param params
 */
export const fetchProductDetail = (params) => fetch({method: 'api.ebusiness.commodityNew.get', ...params}, {isLoading: true});

/**
 * 设置定位
 * @param params
 */
export const setLocation = (params) => fetch({method: 'api.temp.addressByLatitude.find', ...params}, {isLoading: false});

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
 * 获取记录列表（积分兑换记录、全部订单记录、待付款记录、待发货、待收货、待评价）
 * @param params
 * @param config
 */
export const fetchRecordList = (params, config) => fetch({method: 'api.ebusiness.orderNew.find', ...params}, config);

/**
 * 获取退售后记录列表
 * @param params
 * @param config
 */
export const fetchRefundList = (params, config) => fetch({method: 'api.ebusiness.refund.find', ...params}, config);

/**
 * 确认收货(积分、订单列表)
 * @param params
 */
export const orderSign = (params) => fetch({method: 'api.ebusiness.order.sign', ...params}, {isLoading: true});

/**
 * 获取消费记录（消费记录、积分记录）
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

/**
 * 获取我的优惠券
 * @param params
 * @param config
 */
export const fetchCouponList = (params, config) => fetch({method: 'api.promotion.couponEntity.find', ...params}, config);

/**
 * 获取退款详情
 * @param params
 */
export const fetchRefundDetail = (params) => fetch({method: 'api.ebusiness.refundDetailNew.get', ...params}, {isLoading: true});
/**
 * 获取订单详情
 * @param params
 */
export const fetchOrderDetail = (params) => fetch({method: 'api.ebusiness.orderDetailNew.get', ...params}, {isLoading: true});

/**
 * 获取物流信息
 * @param params
 */
export const fetchOrderLogistics = (params) => fetch({method: 'api.ebusiness.orderLogisticsNew.get', ...params}, {isLoading: true});

/**
 * 获取预退单信息
 * @param params
 */
export const fetchOrderRefundInfo = (params) => fetch({method: 'api.ebusiness.refundOrder.pre', ...params}, {isLoading: true});

/**
 * 删除图片
 * @param params
 */
export const deleteUploadFile = (params) => fetch({method: 'api.foundation.attachment.delete', ...params}, {isLoading: true});

/**
 * 申请退款
 * @param params
 */
export const applyRefund = (params) => fetch({method: 'api.ebusiness.refund.commit', ...params}, {isLoading: true});

/***
 * 获取评论信息
 * @param params
 */
export const fetchCommentDetail = (params) => fetch({method: 'api.ebusiness.order.get', ...params}, {isLoading: true});

/**
 * 创建评论
 * @param params
 */
export const createComment = (params) => fetch({method: 'api.ebusiness.createComment.batch', ...params}, {isLoading: true});

/**
 * 取消退款退货
 * @param params
 */
export const cancelRefund = (params) => fetch({method: 'api.ebusiness.refund.cancel', ...params}, {isLoading: true});

/**
 * 填写物流信息
 * @param params
 */
export const refundMemberReturn = (params) => fetch({method: 'api.ebusiness.refundMemberReturn.upload', ...params}, {isLoading: true});

/**
 * 取消订单
 * @param params
 */
export const cancelOrder = (params) => fetch({method: 'api.ebusiness.order.cancel', ...params}, {isLoading: true});

/**
 * 获取默认收货地址
 * @param params
 */
export const fetchDefaultAddress = (params) => fetch({method: 'api.ebusiness.memberDefalutLocation.get', ...params}, {isLoading: true});

/**
 * 获取商品物料的价格、库存及促销信息
 * @param params
 */
export const fetchCommoditySkuInfo = (params) => fetch({method: 'api.ebusiness.commoditySkuInfo.find', ...params}, {isLoading: true});

/**
 * 领取优惠券
 * @param params
 */
export const receiveCoupon = (params) => fetch({method: 'api.ebusiness.coupon.receive', ...params}, {isLoading: true});

/**
 * 获取商品评价总数和平均评分
 * @param params
 */
export const fetchCommodityEvaluationNumber = (params) => fetch({method: 'api.ebusiness.commodityEvaluationNumber.find', ...params}, {isLoading: true});

/**
 * 获取评论列表
 * @param params
 * @param config
 */
export const fetchEvaluateList = (params, config) => fetch({method: 'api.ebusiness.evaluationNew.find', ...params}, config);

/**
 * 搜索商品
 * @param params
 */
export const fetchSearchProductList = (params, config) => fetch({method: 'api.ebusiness.findCommodityExtend.advanced', ...params}, config);

/**
 * 加入购物车
 * @param params
 */
export const addToCart = (params) => fetch({method: 'api.ebusiness.batchCart.add', ...params}, {isLoading: true});

/**
 * 获取购物车列表
 * @param params
 */
export const fetchCartList = (params) => fetch({method: 'api.ebusiness.cardList.get', ...params}, {isLoading: true});

/**
 * 从购物车删除记录(单个)
 * @param params
 */
export const cartDelete = (params) => fetch({method: 'api.ebusiness.cart.delete', ...params}, {isLoading: true});

/**
 * 从购物车删除记录(多个)
 * @param params
 */
export const cartBatchDelete = (params) => fetch({method: 'api.ebusiness.batchCart.delete', ...params}, {isLoading: true});

/**
 * 根据Id获取微分销会员信息
 * @param params
 */
export const fetchWFXMember = (params) => fetch({method: 'api.wfx.wfxMember.get', ...params}, {isLoading: true});
