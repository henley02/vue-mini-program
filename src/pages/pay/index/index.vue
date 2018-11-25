<template>
  <div>
    <div>
      <div class='userContainer' @tap='selectAddress' v-if="address.id">
        <image :src='stripedImg' class='v-cell'/>
        <div class='useDesStyle'>
          <text class='nameStyle2'>{{address.contactName}}</text>
          <text class='nameStyle'>{{address.contactPhone}}</text>
        </div>
        <div class='c-address'>
          <image class='addressSty' :src='positionImg'/>
          <text class='detail-address'>
            {{address.provinceName}}{{address.cityName}}{{address.districtName}}{{address.detailedaddress}}
          </text>
        </div>
        <image :src='arrowsRightImg' class='i-img'/>
      </div>
      <div class='userContainer user-addre' @tap='selectAddress' v-else>
        <image :src='stripedImg' mode="aspectFill" class='v-cell'/>
        <div class="m-cell-address">
          <image class='addressSty' :src="positionImg" style='padding-right:20rpx;'/>
          <text>您还没有添加地址，点击添加地址吧</text>
        </div>
      </div>
      <div class="m-product-all">
        <div class="m-product-list" v-for="(item,index) in cartDetailList" :key="index">
          <div class="m-product-item">
            <div class="m-product-img" style='width:178rpx;height:178rpx'>
              <image :src="item.pictureUrl"/>
            </div>
            <div class="m-product-info">
              <div class="m-product-name" style='padding-top:8rpx'>
                <div class='m-sty-name' style='color:black'>{{item.commodityTitle}}</div>
                <div class='m-sty-name'>
                  规格:{{item.itemSpec1AttributeName}} {{item.itemSpec1ValueName}} {{item.itemSpec2AttributeName}} {{item.itemSpec2ValueName}} {{item.itemSpec3AttributeName}} {{item.itemSpec3ValueName}}
                </div>
              </div>
              <div class="m-product-price" style='color:#ea281a;padding-bottom:30rpx'>
                <div>
                  <label>￥</label>{{item.unitPrice}}
                </div>
                <div class='m-te'>x{{item.quantity}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 备注 -->
      <div class="m-cell p-cell" style='font-size:28rpx;margin-top:20rpx;'>
        <div class="m-cell-bd">
          <input class="u-textarea" maxlength="45" v-model="memberMessage" placeholder='选填：给商家留言(45字以内)'/>
        </div>
      </div>
      <div class="total-info">
        <div class="m-cell" style='margin-bottom:20rpx' @tap="toggleShowPayList">
          <div class="m-cell-bd">
            <text>支付方式</text>
          </div>
          <div class="m-cell-ft m-order-typetxt" v-if="payType==0">请选择</div>
          <div class="m-cell-ft m-order-typetxt" v-if="payType==1">余额支付</div>
          <div class="m-cell-ft m-order-typetxt" v-if="payType==2">微信支付</div>
          <div class="arrow m-cell-access">
            <div class="m-cell-ft "></div>
          </div>
        </div>

        <div class="m-cell" style='border-bottom:1rpx solid #EEEEEE;' @tap="showCouponList">
          <div class="m-cell-bd">
            <text>优惠券</text>
          </div>
          <block v-if="benefitAmount> 0">
            <div style='color:#EA281A'>-￥{{benefitAmount}}</div>
          </block>
          <block v-else>
            <div class="m-cell-ft m-order-typetxt" style='color:#EA281A'
                 v-if="couponDetailList.length > 0">{{couponDetailList.length}}张可用
            </div>
            <div class="m-cell-ft m-order-typetxt" v-else>暂无可用</div>
            <div class="arrow m-cell-access">
              <div class="m-cell-ft "></div>
            </div>
          </block>
        </div>
        <div class="m-cell" @tap="showPointPop" style='border-bottom:1rpx solid #EEEEEE;'>
          <div class="m-cell-bd">
            <text>积分</text>
          </div>
          <div class="m-cell-ft m-order-typetxt" v-if="numval===0">
            可用{{maxPoint}}积分抵扣,共{{myPoint}} 分
          </div>
          <div class="m-cell-ft m-order-typetxt" v-else>已使用{{numval}}积分,抵扣￥{{pointRulepick}}</div>
          <div class="arrow m-cell-access">
            <div class="m-cell-ft "></div>
          </div>
        </div>

        <div class="m-cell" style='margin-bottom:20rpx' catchtap='HuoDong'>
          <div class="m-cell-bd">
            <text>参与活动</text>
          </div>
          <div class="m-cell-ft m-order-typetxt">省
            <text style='color:#ea281a'>￥{{benefitAmounts}}</text>
            元
          </div>
          <div class="arrow m-cell-access">
            <div style='width:32rpx;'></div>
          </div>
        </div>

        <div class="m-cell" catchtap='SHopp'>
          <div class="m-cell-bd">
            <text>商品金额</text>
          </div>
          <div class="m-cell-ft m-order-typetxt">￥{{totalAmount}}</div>
        </div>

        <div class="m-cell" style='margin-bottom:100rpx;' catchtap='toaoMEN'>
          <div class="m-cell-bd">
            <text>运费</text>
          </div>
          <div class="m-cell-ft m-order-typetxt">￥{{totalFeightFee}}</div>
        </div>
      </div>

      <div class="m-footer-btn">
        <div class="m-footer-btn-listS">实付款：￥{{amount}}</div>
        <div class="m-footer-btn-main m-now" @tap="pay()">
          提交订单
        </div>
      </div>
    </div>
    <!-- 优惠券模板 -->
    <div class="m-panel-sp " v-if="isShowCouponList">
      <div class="m-panel-sp-content">
        <icon type="cancel" class="m-panel-sp-icon" color="#888" @tap="closeCouponList"/>
        <div class="m-panel-sp-listbox-item">
          <div class="m-cells-title">选择优惠券</div>
        </div>
        <div v-if="couponDetailList.length === 0">
          <image :src='noCouponImg' class='shoppingcart'/>
          <div class='text'>无可用优惠券</div>
        </div>
        <scroll-view class="m-panel-sp-listbox" scroll-y="true" v-if="couponDetailList.length>0">
          <div class='y-cell' v-for="(item,index) in couponDetailList" :key="index"
               @tap="toggleSelectedCoupon(index)">
            <div class="quan" style="float: left;margin-top:58rpx;padding:0 16rpx;">
              <icon :type="item.IsCheck?'success':'circle'" :color="item.IsCheck?'#EA281A':'#d5d5d5'"/>
            </div>
            <div class='y-img'>
              <div class='y-cells-bach'>
                <image :src='copyxsImg' style='width:100%;height:100%'/>
                <div class='y-juan'>
                  <div>{{item.couponEntity.couponName}}</div>
                  <div>
                    有效期{{item.couponEntity.usefulStart}}至{{item.couponEntity.usefulEnd}}
                  </div>
                </div>
                <div class='y-con'>￥{{item.benefitAmount}}</div>
              </div>
            </div>
          </div>
        </scroll-view>
        <div class="m-m-panel-sp-btn">
          <div class="m-m-panel-sp-rbtn" @tap="confirmSelectedCoupon()">确定</div>
        </div>
      </div>
    </div>
    <!--积分模板-->
    <div class="m-panel-sp " v-if="isShowPointPop">
      <div class="m-panel-sp-content">
        <icon type="cancel" class="m-panel-sp-icon" color="#888" @tap="closePointPop()"/>
        <scroll-view class="m-panel-sp-listbox" scroll-y="true">
          <div class="m-panel-sp-listbox-item">
            <div class="m-cells-title">使用积分</div>
            <div class='m-inter'>
              <div>总积分:\t{{myPoint}}</div>
              <div>本次最多可使用积分:\t{{maxPoint}}</div>
            </div>
          </div>
          <!--加减-->
          <div class="u-cart-num">
            <div class="u-num-btn" @tap="pointSub">-</div>
            <input type="number" v-model="temporaryPoint" disabled='disabled'/>
            <div class="u-num-btn" @tap="pointAdd">+</div>
          </div>
          <div class='m-inter-cell' @tap='pointMax'>最大使用</div>
        </scroll-view>
        <div class="m-m-panel-sp-btn">
          <div class="m-m-panel-sp-rbtn" @tap="pointPopConfirm()">确定</div>
        </div>
      </div>
    </div>
    <!-- 支付模态框 -->
    <balance-pay-pop v-if="isShowBalancePayPop" @closeBalancePayPop="closeBalancePayPop"
                     :amount="amount" @inputFinished="mergeAccountPaid"></balance-pay-pop>
    <!-- 选择支付方式 -->
    <pay-list v-if="isShowPayList" @changePayType="changePayType" @toggleShowPayList="toggleShowPayList"></pay-list>
  </div>
</template>

<script>
  /**
   * 确认订单
   */
  import {
    fetchOrderInfo,
    fetchAddressList,
    fetchAddressById,
    fetchFreight,
    checkIsSettingPayPassword,
    commitOrder,
    createdOrderAndMergePayInfo,
    payForBalance,
    fetchOpenid
  } from 'api/index';
  import MD5 from 'public/js/util/md5';
  import config from 'public/config/index.js';
  import payList from 'components/pay-list/pay-list.vue';
  import balancePayPop from 'components/balance-pay-pop/balance-pay-pop.vue';

  export default {
    data() {
      return {
        isLoading: true,
        positionImg: require('public/images/location.png'),
        stripedImg: require('public/images/user/striped.png'),
        arrowsRightImg: require('public/images/right.png'),
        noCouponImg: require('public/images/user/nocoupon.png'),
        copyxsImg: require('public/images/copyxs.png'),
        memberMessage: '', // 买家留言
        userInfo: {},
        myPoint: '', // 当前可用积分
        maxPoint: [], // 本次最多使用积分
        pointRule: [], // 积分使用规则
        cartDetailList: [], // 购物清单列表
        totalAmount: 0, // 实付款的商品总额
        selectBenefitList: [], // 可选优惠活动列表
        couponDetailList: [], // 不参加优惠活动的时候可以使用的优惠券
        supplierAndAmountList: [], // 供应商对应优惠金额
        enableElectronicInvoice: false, // 是否启用电子发票
        argumentsStr: '', // 请求数据
        payType: 0, // 支付类型
        locationId: '',
        address: {}, // 收货地址
        isShowPayList: false, // 是否展示支付列表
        benefitAmount: 0, // 使用优惠券减的金额（用于页面展示）
        realBenefitAmount: 0, // 使用优惠券实际减的金额（用于页面展示）
        isShowCouponList: false, // 是否展示优惠券列表
        selectedCouponId: '', // 选中的优惠券id
        pointRulepick: 0, // 积分抵扣的金额
        numval: 0, // 使用的积分
        temporaryPoint: 0, // 积分弹框展示的临时积分
        isShowPointPop: false, // 是否展示积分弹框
        benefitAmounts: 0, // 参与活动的金额
        totalFeightFee: 0, // 运费
        idList: [],
        isShowBalancePayPop: false, // 是否展示余额支付的弹框
        mergePayId: '',
        pms: []
      };
    },
    components: {
      payList, balancePayPop
    },
    computed: {
      /**
       * 计算实际付款的金额
       * 商品的总金额-优惠券的金额 - 活动优惠的金额 - 积分的金额 （如果减下来是小于0 就是0） 再 + 运费的金额
       */
      amount() {
        let s = this.totalAmount - this.realBenefitAmount - this.benefitAmounts - this.pointRulepick;
        if (s <= 0) {
          s = 0;
        }
        return (s + parseFloat(this.totalFeightFee)).toFixed(2);
      }
    },
    methods: {
      closeBalancePayPop() {
        this.isShowBalancePayPop = false;
      },
      /**
       * 提交订单
       */
      async pay() {
        if (!this.address.id) {
          this.$bridge.dialog.alert({title: '提示', content: '请选择收货地址'});
          return false;
        }
        if (this.payType === 0) {
          this.$bridge.dialog.alert({title: '提示', content: '请支付方式'});
          return false;
        }
        if (this.payType === 1) {
          let res = await checkIsSettingPayPassword({passportId: this.userInfo.id, userId: this.userInfo.userId});
          if (res.firstErrorMessage === '' && res.verifyResult) {
            this.acknowledgement();
          } else {
            this.$bridge.dialog.confirm({
              title: '温馨提示',
              confirmText: '去设置',
              content: '为了您的账户安全，请设置支付密码？',
              confirmCallback: async () => {
                this.$bridge.link.navigateTo('/pages/user/account-safety/main?backStepNumber=3');
              },
              cancelCallback: () => {
              }
            });
          }
        } else {
          this.acknowledgement();
        }
      },
      /**
       * 余额支付
       */
      async mergeAccountPaid(paymentCode) {
        let params = {
          mergePayId: this.mergePayId,
          transactionPassword: MD5.hexMD5(paymentCode),
          passportId: this.userInfo.id
        };
        let res = await payForBalance(params);
        this.closeBalancePayPop();
        if (res.firstErrorMessage === '' && res.result) {
          this.$bridge.link.redirectTo(`/pages/pay/result/main?result=success&amount=${this.amount}`);
        } else {
          this.$bridge.dialog.alert({title: '提示', content: res.firstErrorMessage});
        }
      },
      /**
       * 订单合并
       */
      async orderMergePayNews() {
        let params = {
          passportId: this.userInfo.id,
          orderIdList: this.idList,
          payType: 'ACCOUNT',
          storeId: '986901391685849088'
        };
        let res = await createdOrderAndMergePayInfo(params);
        if (res.id !== '') {
          this.isShowBalancePayPop = true;
          this.mergePayId = res.id;
        }
      },
      /**
       * 小程序支付
       */
      gotopay() {
        wx.login({
          success: (datainfo) => {
            wx.getUserInfo({
              success: async (data) => {
                let params = {
                  appId: config.appId,
                  jsCode: encodeURIComponent(datainfo.code),
                  encryptData: encodeURIComponent(data.encryptedData),
                  iv: encodeURIComponent(data.iv)
                };
                let res = await fetchOpenid(params);
                if (res.firstErrorMessage === '' && res.result) {
                  let val = {
                    orderIdList: this.idList, // 单ID集合----------------------- 必填
                    payType: 'MINIAPP', // 支付方式------传"MINIAPP"--------必填
                    storeId: '986901391685849088', // 店铺ID--------------------------- 必填
                    appId: config.appId, // 小程序AppId----------------------必填
                    openId: res.openId // 会员的openId--------------------- 必填
                  };
                  let result = await createdOrderAndMergePayInfo(val);
                  if (result.firstErrorMessage === '') {
                    wx.requestPayment({
                      'timeStamp': result.miniAppPrePayParams.timeStamp,
                      'nonceStr': result.miniAppPrePayParams.nonceStr,
                      'package': result.miniAppPrePayParams.packageStr,
                      'signType': 'MD5',
                      'paySign': result.miniAppPrePayParams.paySign,
                      'success': (res) => {
                        this.$bridge.link.redirectTo(`/pages/pay/result/main?result=success&amount=${this.amount}`);
                      },
                      'fail': (res) => {
                        this.$bridge.link.redirectTo(`/pages/pay/result/main?result=fail&amount=${this.amount}`);
                      }
                    });
                  }
                } else {
                  wx.showToast({
                    title: '支付失败'
                  });
                }
              }
            });
          }
        });
      },
      async acknowledgement() {
        let params = {
          passportId: this.userInfo.id,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE',
          storeId: '986901391685849088',
          locationId: this.address.id, // 收货地址id
          goodsAmount: this.totalAmount, // 商品总额
          freightFee: this.totalFeightFee, // 运费
          memberMessage: this.memberMessage, // 买家留言
          isNeedInvoice: false, // 是否需要开发票
          orderConfirmItemList: this.pms, // 商品清单
          usedPoint: this.numval, // 使用的积分
          pointAmount: this.pointRulepick, // 积分抵扣金额
          ticketAmount: this.realBenefitAmount, // 优惠券实际抵扣金额
          couponEntityIdList: JSON.stringify(this.selectedCouponId.split(',')), // 优惠券id
          promotionAmount: 0, // 促销抵扣金额
          promotionSourceIdList: [], // 促销ID集合
          giftCardAmount: 0, // 礼品卡抵扣总金额
          prePaidCardUseList: [], // 礼品卡实用信息集合
          locationRowVersion: this.address.rowVersion // 地址的RowVersion,
        };
        let res = await commitOrder(params);
        if (res.firstErrorMessage === '') {
          this.idList = res.idList;
          if (res.isZeroOrderPaid) {
            this.$bridge.link.redirectTo(`/pages/pay/result/main?result=success&amount=${this.amount}`);
          } else {
            if (this.payType === 1) {
              this.orderMergePayNews();
            }
            if (this.payType === 2) {
              this.gotopay();
            }
          }
        } else {
          this.$bridge.dialog.alert({title: '提示', content: res.firstErrorMessage});
        }
      },
      /**
       * 积分弹框 -- 减1
       */
      pointSub() {
        if (this.temporaryPoint <= 0) {
          return;
        }
        this.temporaryPoint--;
      },
      /**
       * 积分弹框 -- 加1
       */
      pointAdd() {
        if (this.temporaryPoint === this.maxPoint) {
          return;
        }
        this.temporaryPoint++;
      },
      /**
       * 积分弹框 -- 最大使用
       */
      pointMax() {
        this.temporaryPoint = this.maxPoint;
      },
      /**
       * 积分弹框 -- 确认
       */
      pointPopConfirm() {
        // 积分抵扣的金额
        let pointRulepick = (this.mul(this.division(this.temporaryPoint, this.pointRule.point), this.pointRule.amount)).toFixed(2);
        let s = this.totalAmount - this.realBenefitAmount - this.benefitAmounts;
        if (s < 0) {
          s = 0;
        }
        if (s < pointRulepick) {
          this.$bridge.dialog.alert({title: '提示', content: '不能抵扣这么多'});
          return false;
        }
        // 计算每单最大使用的金额
        let maxPrice = parseFloat(this.mul(this.totalAmount, this.division(this.pointRule.maxPercent, 100)));
        if (pointRulepick > maxPrice) {
          this.$bridge.dialog.alert({title: '提示', content: '不能抵扣这么多'});
        } else {
          this.pointRulepick = pointRulepick;
          this.numval = this.temporaryPoint;
          this.isShowPointPop = false;
        }
      },
      /**
       * 打开积分弹框
       */
      showPointPop() {
        this.temporaryPoint = this.numval;
        this.isShowPointPop = true;
      },
      /**
       * 关闭积分弹框
       */
      closePointPop() {
        this.isShowPointPop = false;
      },
      /**
       * 优惠券弹框--确认
       */
      confirmSelectedCoupon() {
        let arr = this.couponDetailList.filter(item => item.IsCheck);
        if (arr.length === 0) {
          this.selectedCouponId = '';
          this.benefitAmount = 0;
          this.realBenefitAmount = 0;
        } else {
          this.benefitAmount = arr[0].benefitAmount;
          this.selectedCouponId = arr[0].couponEntity.id;
        }
        let needPay = this.totalAmount - this.benefitAmounts; // 支付金额减去 活动优惠金额
        if (this.benefitAmount >= needPay) { // 如果使用的优惠券的金额 大于 (支付金额减去 活动优惠金额) | 直接使用优惠券就够了
          this.realBenefitAmount = this.benefitAmount - needPay;
          this.pointRulepick = 0;
          this.numval = 0;
        } else if (needPay - this.benefitAmount - this.pointRulepick < 0) { // 使用优惠券、积分支付 （积分超标的）
          this.realBenefitAmount = this.benefitAmount;
          this.pointRulepick = this.totalAmount - this.benefitAmount - this.benefitAmounts;
          this.numval = this.mul(this.division(this.pointRulepick, this.pointRule.amount), this.pointRule.point);
        } else { // 使用优惠券、积分支付
          this.realBenefitAmount = this.benefitAmount;
        }
        this.isShowCouponList = false;
      },
      /**
       * 优惠券弹框--选中、取消选中
       * @param index
       */
      toggleSelectedCoupon(index) {
        this.couponDetailList.forEach((item, i) => {
          if (index === i) {
            item.IsCheck = !item.IsCheck;
          } else {
            item.IsCheck = false;
          }
        });
      },
      /**
       * 关闭优惠券弹框
       */
      closeCouponList() {
        this.isShowCouponList = false;
      },
      /**
       * 打开优惠券弹框
       */
      showCouponList() {
        if (this.couponDetailList.length === 0) {
          return;
        }
        this.couponDetailList.forEach(item => {
          if (item.couponEntity.id === this.selectedCouponId) {
            item.IsCheck = true;
          } else {
            item.IsCheck = false;
          }
        });
        this.isShowCouponList = true;
      },
      /**
       * 更改支付方式
       * @param type
       */
      changePayType(type) {
        this.payType = type;
        this.isShowPayList = false;
      },
      toggleShowPayList() {
        this.isShowPayList = !this.isShowPayList;
      },
      selectAddress() {
        this.$bridge.link.navigateTo(`/pages/user/address-list/main?type=1`);
      },
      /**
       * 计算运费
       * @returns {Promise.<void>}
       */
      async getFreight() {
        let params = {
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE',
          cityId: this.address.cityId,
          districtId: this.address.districtId,
          list: this.argumentsStr,
          passportId: this.userInfo.id
        };
        let res = await fetchFreight(params);
        if (res.firstErrorMessage === '') {
          this.totalFeightFee = res.totalFeightFee.toFixed(2); // 运费金额
        }
      },
      async fetchAddressById() {
        let res = await fetchAddressById({ids: this.locationId.split(','), passportId: this.userInfo.id});
        if (res.firstErrorMessage === '') {
          this.address = res.result[0];
          this.getFreight();
        }
      },
      async getDefaultAddress() {
        let res = await fetchAddressList({
          memberId: this.userInfo.memberId,
          passportId: this.userInfo.id,
          pageNumber: 1,
          pageSize: 10
        }, {isLoading: true});
        if (res.firstErrorMessage === '') {
          res.result.forEach(item => {
            if (this.locationId) {
              if (item.id === this.locationId) {
                this.address = item;
              }
            } else {
              if (item.isDefault) {
                this.address = item;
              }
            }
          });
          this.getFreight();
        }
      },
      async getOrderInfo() {
        this.isLoading = true;
        let params = {
          passportId: this.userInfo.id,
          operatingUnitId: this.$bridge.storage.get('operatingUnitId'),
          systemType: 'B2C',
          deviceType: 'MOBILE',
          list: this.argumentsStr
        };
        let res = await fetchOrderInfo(params);
        if (res.firstErrorMessage === '') {
          let arr = [];
          res.cartDetailList.forEach((item) => {
            item.unitPrice = item.unitPrice.toFixed(2);
            let obj = {
              itemId: item.itemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              isGift: false
            };
            if (item.id) {
              obj.cartid = item.id;
            }
            arr.push(obj);
          });
          this.pms = arr;
          res.couponDetailList.forEach(item => {
            item.IsCheck = false;
            item.couponEntity.usefulStart = this._dateFormat(item.couponEntity.usefulStart, 'yyyy-MM-dd');
            item.couponEntity.usefulEnd = this._dateFormat(item.couponEntity.usefulEnd, 'yyyy-MM-dd');
          });
          res.totalAmount = res.totalAmount.toFixed(2);
          if (res.selectBenefitList && res.selectBenefitList.length > 0) {
            this.benefitAmounts = res.selectBenefitList[0].benefitAmount;
          }
          let {myPoint, maxPoint, pointRule, cartDetailList, totalAmount, selectBenefitList, couponDetailList, supplierAndAmountList, enableElectronicInvoice} = res;
          this.myPoint = myPoint;
          this.maxPoint = maxPoint;
          this.pointRule = pointRule;
          this.cartDetailList = cartDetailList;
          this.totalAmount = totalAmount;
          this.selectBenefitList = selectBenefitList;
          this.couponDetailList = couponDetailList;
          this.supplierAndAmountList = supplierAndAmountList;
          this.enableElectronicInvoice = enableElectronicInvoice;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
        this.isLoading = false;
      }
    },
    onUnload() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
    },
    onLoad() {
      this.$bridge.storage.remove('locationId');
    },
    onShow() {
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.argumentsStr = this.$root.$mp.query.data;
      this.locationId = this.$bridge.storage.get('locationId');
      console.log(this.locationId);
      if (this.locationId === '') {
        this.getDefaultAddress();
      } else {
        this.fetchAddressById();
      }
      this.getOrderInfo();
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body
    background-color: rgb(244, 244, 244);
    height: 100%;

  .v-cell {
    width: 100%;
    height: 3px;
  }

  .userContainer {
    display: flex;
    flex-direction: column;
    height: 75px;
    background: #fff;
  }

  .useDesStyle {
    padding: rpx(20) 0 0 rpx(63);
    font-family: PingFang-SC-Regular;
    font-size: rpx(32);
    color: #333;
    font-weight: bold;
  }

  .nameStyle {
    padding-left: rpx(44);
  }

  .c-address {
    padding: rpx(14) 0 0 rpx(26);
    font-size: rpx(28);
    display: flex;
  }

  .addressSty {
    width: rpx(20);
    height: rpx(26);
    padding-top: rpx(8);
  }

  .detail-address {
    position: relative;
    margin-top: rpx(-32);
    padding-left: rpx(20);
  }

  .bootom-img {
    width: 100%;
    height: rpx(4);
  }

  .i-img {
    width: rpx(20);
    height: rpx(30);
    position: relative;
    top: rpx(-53);
    left: rpx(706);
  }

  .m-product-all {
    margin-top: rpx(20);
    background: #fff;
  }

  .m-te {
    color: #666;
    font-size: rpx(32);
  }

  .m-product-price {
    display: flex;
    justify-content: space-between;
    margin-right: rpx(30);
  }

  .m-product-price label {
    padding-left: rpx(20);
  }

  .total-info {
    font-size: rpx(28);
    margin-top: rpx(20);
    padding-bottom: rpx(40);
  }

  .m-sty-name {
    width: 70%;
    margin-left: rpx(203);
    color: #999;
  }

  .m-cells {
    font-size: rpx(28);
    margin-top: rpx(20);
  }

  .u-textarea {
    display: block;
    border: 0;
    width: rpx(680);
    font-size: 1em;
  }

  .p-cell {
    font-size: 14px;
    margin-top: 10px;
    padding: rpx(20);
  }

  .u-textarea-counter {
    color: #b2b2b2;
    text-align: right;
  }

  .u-cell-warn .u-textarea-counter {
    color: #e64340;
  }

  .m-footer-btn {
    border-top: rpx(1) solid #eee;
    line-height: rpx(100);
  }

  .m-footer-btn-main {
    width: 25%;
    height: 100%;
    float: right;
    background-color: #ea281a;
    color: #fff;
    line-height: rpx(100);
    font-size: rpx(32);
  }

  .m-footer-btn-listS {
    color: #ea281a;
    font-size: rpx(30);
    text-align: left;
    padding-left: rpx(30);
    float: left;
  }

  /*选择规格遮罩 start*/

  .m-panel-sp {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .m-panel-sp-content {
    height: rpx(780);
    background-color: #fff;
    position: absolute;
    width: 100%;
    bottom: 0;
    box-shadow: 0px rpx(-10) rpx(15) rgba(0, 0, 0, 0.35);
  }

  .m-panel-sp-pinfo {
    height: rpx(196);
    border-bottom: rpx(1) solid #d5d5d5;
    box-sizing: border-box;
    padding: rpx(20);
    position: relative;
  }

  .m-panel-sp-pimg {
    width: rpx(200);
    height: rpx(200);
    position: absolute;
    top: rpx(-50);
    background-color: #fff;
    border-radius: rpx(8);
    box-sizing: border-box;
    padding: rpx(10);
    box-shadow: 0 0 rpx(10) rgba(0, 0, 0, 0.35);
    float: left;
  }

  .m-panel-sp-pimg image {
    width: 100%;
    height: 100%;
  }

  .m-panel-sp-pname {
    float: left;
    margin-left: rpx(216);
    font-size: rpx(28);
    line-height: rpx(40);
  }

  .m-panel-sp-pname .m-pprice {
    color: #db384c;
    font-size: rpx(32);
    line-height: rpx(50);
    font-weight: bold;
  }

  .m-panel-sp-icon {
    position: absolute;
    right: rpx(10);
    top: rpx(10);
    z-index: 3;
  }

  .m-panel-sp-listbox {
    height: rpx(604);
  }

  .m-panel-sp-listbox-item {
    box-sizing: border-box;
    padding: rpx(10) rpx(20);
  }

  .m-panel-sp-listbox-item .m-cells-title {
    color: black;
    margin: rpx(20) rpx(10);
    padding: 0;
  }

  .m-panel-sp-labellist label {
    display: inline-block;
    font-size: rpx(24);
    padding: rpx(10) rpx(15);
    border-radius: rpx(8);
    margin: rpx(10);
    color: #888;
    border: rpx(1) solid #d5d5d5;
  }

  .m-panel-sp-sellabel {
    color: #db384c !important;
    border: rpx(1) solid #db384c !important;
  }

  .y-cells-bach {
    width: 85%;
    height: rpx(158);
    margin-left: rpx(83);
    color: #fff;
  }

  .y-img {
    width: 100%;
    height: rpx(190);
  }

  .y-con {
    width: 27%;
    height: rpx(146);
    text-align: center;
    line-height: rpx(146);
    position: relative;
    top: rpx(-319);

  }

  .y-juan {
    width: 73%;
    height: rpx(146);
    position: relative;
    top: rpx(-164);
    left: rpx(180);
  }

  .y-juan view:nth-child(1) {
    margin-top: rpx(14);
    padding-left: rpx(10);
    padding-top: rpx(17);
    font-size: rpx(34);

  }

  .y-juan view:nth-child(2) {
    font-size: rpx(24);
    padding-left: rpx(10);
    margin-top: rpx(10);

  }

  .y-juan view:nth-child(3) {
    font-size: rpx(24);
    padding-left: rpx(10);
  }

  .m-inter {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: rpx(28);
    margin-top: rpx(58);
  }

  /*商品数量加减*/

  .u-cart-num {
    position: relative;
    z-index: 2;
    left: rpx(25);
  }

  .u-cart-num {
    display: inline-block;
    border: rpx(1) solid #d5d5d5;
    height: rpx(56);
    line-height: rpx(54);
    border-radius: rpx(4);
    box-sizing: border-box;
    margin-top: rpx(15);
    text-align: center;
  }

  .u-num-btn {
    float: left;
    width: rpx(88);
  }

  .u-cart-num input {
    float: left;
    width: rpx(80);
    height: rpx(54);
    border-left: rpx(1) solid #d5d5d5;
    border-right: rpx(1) solid #d5d5d5;
    font-size: rpx(28);
  }

  .m-inter-cell {
    width: rpx(137);
    height: rpx(62);
    border: rpx(1) solid #ea281a;
    color: #ea281a;
    font-size: rpx(28);
    line-height: rpx(63);
    text-align: center;
    position: relative;
    left: rpx(300);
    top: rpx(-69);
  }

  .m-m-panel-sp-btn {
    height: rpx(100);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 10;
  }

  .m-m-panel-sp-lbtn {
    float: left;
    width: 50%;
    border-top: rpx(1) solid #d5d5d5;
    text-align: center;
  }

  .m-m-panel-sp-rbtn {
    width: 100%;
    float: left;
    background-color: #db384c;
    line-height: rpx(100);
    color: #fff;
    text-align: center;
  }

  .shoppingcart {
    position: relative;
    top: rpx(160);
    height: rpx(171);
    width: rpx(171);
    left: rpx(290);
  }

  .text {
    position: relative;
    top: rpx(180);
    color: #999;
    font-size: rpx(28);
    text-align: center;
  }

  .m-cell-address {
    font-size: rpx(28);
    line-height: rpx(136);
    padding-left: rpx(34);
  }

</style>
