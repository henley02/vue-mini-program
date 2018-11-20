<template>
  <div>
    <div class="m-product-all">
      <div class="m-tab">
        <div class="m-navbar">
          <block v-for="(item,index) in tabList" :key="index">
            <div class="m-navbar-items" :class="{'m-navbar-item-on':type == item.status}" @tap="changeTab(item)">
              {{item.name}}
            </div>
          </block>
        </div>
      </div>
      <scroll-view scroll-y="true" class="m-orderlist" @scrolltolower="dropDown">
        <block v-for="(item,index1) in list" v-if="type=='EVALUATION'" :key="index1">
          <div class="m-panel m-panel-access">
            <div class="m-panel-hda" style='border-bottom:0;'>服务单号{{item.number}}
              <label v-if="item.status == 'UN_APPROVED'">待审核</label>
              <label v-if="item.status == 'DISAGREED'">审核不通过</label>
              <label v-if="item.status == 'AGREED'">审核通过</label>
              <label v-if="item.status == 'WAIT_RECEIPT'">等待退款</label>
              <label v-if="item.status == 'WAIT_REFUND'">待退款</label>
              <label v-if="item.status == 'REFUND'">已退款</label>
              <label v-if="item.status == 'CANCELLED'">已取消</label>
            </div>
            <div class="m-panel-hda" style='border-top:0;'>订单编号：{{item.id}}</div>

            <div class="m-product-list">
              <navigator class="m-product-item" :url="'/pages/user/refund-detail/main?id='+item.id">
                <div class="i-product-img">
                  <image :src="item.refundLineList[0].pictureUrl"/>
                </div>
                <div class="m-product-info">
                  <div class="m-product-name">{{item.refundLineList[0].commodityTitle}}</div>
                </div>
              </navigator>
            </div>

            <div class="m-total-info">
              共{{item.refundLineList[0].quantity}}件商品 实付款：
              <label class="m-total-price" style='margin-right:10rpx'>￥{{item.paidAmount}}</label>
              <text>退款金额：
                <text class="m-total-price" style='font-size:28rpx;color:#ea281a;'>￥{{item.requestedAmount}}</text>
              </text>
            </div>
            <div class="m-total-btn">
              <div v-if="item.status == 'UN_APPROVED'" class="u-link-btn" @tap="cancelRefund(item)">取消退单</div>
              <navigator v-if="item.status == 'AGREED'" class="u-link-btn"
                         :url="'/pages/user/fill-logistics/main?id='+item.id+'&rowVersion='+item.rowVersion"
                         style='width:181rpx;'>填写物流信息
              </navigator>
            </div>
          </div>
        </block>

        <block v-for="(order,index) in list" :key="index" v-if="type !=='EVALUATION'">
          <div class="m-panel m-panel-access">
            <div class="m-panel-hd">订单编号：{{order.id}}
              <label v-if="order.status == 'UN_PAID'">待付款</label>
              <label v-if="order.status == 'UN_SHIPMENT'">待发货</label>
              <label v-if="order.status == 'UN_SIGNED'">待收货</label>
              <label v-if="order.status == 'SIGNED'">已签收</label>
              <label v-if="order.status == 'EVALUATION'">已评价</label>
              <label v-if="order.status == 'CANCELLED'">已取消</label>
              <label v-if="order.status == 'WAIT_GROUP'">待拼团</label>
            </div>

            <div class="m-product-list">
              <navigator class="m-product-item"
                         :url="'/pages/detail/main?id='+order.orderLineList[0].commodityId">
                <div class="i-product-img">
                  <image :src="order.orderLineList[0].pictureUrl"/>
                </div>
                <div class="m-product-info">
                  <div class="m-product-name">{{order.orderLineList[0].commodityTitle}}</div>
                </div>
              </navigator>
            </div>

            <div class="m-total-info">
              共{{order.totalCount}}件商品 实付款：
              <label class="m-total-price">￥{{order.paidAmount}}</label>
            </div>

            <div class="m-total-btn">
              <div v-if="order.status == 'UN_PAID'" class="u-link-btn" @tap="cancelOrder(order)">取消订单</div>
              <div v-if="order.status == 'UN_PAID'" class="u-link-btn i-link-btn" @tap='pay(order)'>去付款
              </div>
              <navigator v-if="order.status == 'SIGNED'" class="u-link-btn"
                         :url="'/pages/user/order-comment/main?orderId='+order.id">评价
              </navigator>
              <navigator v-if="order.status == 'UN_SIGNED'" :url="'/pages/user/logistics/main?orderId='+order.id"
                         class="u-link-btn">查看物流
              </navigator>
              <div v-if="order.status == 'UN_SIGNED'" class="u-link-btn i-link-btn" @tap="confirmReceipt(order)">
                确认收货
              </div>
              <navigator v-if="order.status == 'UN_SHIPMENT' || order.status =='EVALUATION'"
                         :url="'/pages/user/order-detail/main?orderId='+order.id" class="u-link-btn">订单详情
              </navigator>
              <navigator v-if="order.status == 'UN_SIGNED'" :url="'/pages/user/order-detail/main?orderId='+order.id"
                         class="u-link-btn">订单详情
              </navigator>
              <navigator v-if="order.status == 'SIGNED'" :url="'/pages/user/order-detail/main?orderId='+order.id"
                         class="u-link-btn">订单详情
              </navigator>
              <navigator v-if="order.status == 'UN_PAID'" :url="'/pages/user/order-detail/main?orderId='+order.id"
                         class="u-link-btn">订单详情
              </navigator>
            </div>
          </div>
        </block>
        <div v-if="isLoading && pageNumber !== 1" class="drop-down-status">正在加载ing</div>
        <div v-if="isEnd && pageNumber > 1" class="drop-down-status">亲，已经到底部了</div>
        <div v-if="list.length===0 && isEnd">
          <image :src='noDataImg' class='shoppingcart' mode='scaleToFill'/>
          <div class='no-order-text'>暂无订单</div>
        </div>
      </scroll-view>
    </div>
    <!-- 支付模态框 -->
    <balance-pay-pop v-if="isShowBalancePayPop" @closeBalancePayPop="closeBalancePayPop"
                     :amount="payData.paidAmount" @inputFinished="mergeAccountPaid"></balance-pay-pop>
    <!-- 选择支付方式 -->
    <pay-list v-if="isShowPayList" @changePayType="changePayType" @toggleShowPayList="toggleShowPayList"></pay-list>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 全部订单
  * */
  import {
    fetchRecordList,
    fetchRefundList,
    cancelRefund,
    cancelOrder,
    orderSign,
    checkIsSettingPayPassword,
    createdOrderAndMergePayInfo,
    payForBalance,
    fetchOpenid
  } from 'api/index';
  import payList from 'components/pay-list/pay-list.vue';
  import balancePayPop from 'components/balance-pay-pop/balance-pay-pop.vue';
  import MD5 from 'public/js/util/md5';
  import config from 'public/config/index.js';

  export default {
    name: 'consumption-records',
    components: {
      payList, balancePayPop
    },
    data() {
      return {
        isShowBalancePayPop: false,
        isShowPayList: false,
        payType: 0, // 支付类型
        noDataImg: require('public/images/user/noorder.png'),
        tabList: [
          {
            status: 'UN_PAID',
            name: '待付款'
          },
          {
            status: 'UN_SHIPMENT',
            name: '待发货'
          },
          {
            status: 'UN_SIGNED',
            name: '待收货'
          },
          {
            status: 'SIGNED',
            name: '待评价'
          },
          {
            status: 'EVALUATION',
            name: '退售后'
          }
        ],
        userInfo: {},
        list: [],
        type: '',
        isLoading: false,
        pageSize: 10, // 页数
        pageNumber: 1, // 页码
        isEnd: false,
        canDropDown: true, // 是否可以下拉加载
        payData: {}, // 去支付的数据
        mergePayId: ''
      };
    },
    methods: {
      /**
       * 小程序支付
       */
      async gotopay() {
        let loginCode = await this.$bridge.user.wxLogin();
        console.log(loginCode);
        wx.login({
          success: (datainfo) => {
            console.log('-----datainfo----');
            console.log(datainfo);
            wx.getUserInfo({
              success: async (data) => {
                console.log('-----data----');
                console.log(data);
                let params = {
                  appId: config.appId,
                  jsCode: encodeURIComponent(datainfo.code),
                  encryptData: encodeURIComponent(data.encryptedData),
                  iv: encodeURIComponent(data.iv)
                };
                let res = await fetchOpenid(params);
                if (res.firstErrorMessage === '' && res.result) {
                  let val = {
                    passportId: this.userInfo.id,
                    orderIdList: this.payData.id.split(','), // 单ID集合----------------------- 必填
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
      closeBalancePayPop() {
        this.isShowBalancePayPop = false;
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
          this.$bridge.link.redirectTo(`/pages/pay/result/main?result=success&amount=${this.payData.paidAmount}`);
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
          orderIdList: this.payData.id.split(','),
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
       * 更改支付方式
       * @param type
       */
      async changePayType(type) {
        this.payType = type;
        if (type === 1) {
          let res = await checkIsSettingPayPassword({passportId: this.userInfo.id, userId: this.userInfo.userId});
          if (res.firstErrorMessage === '' && res.verifyResult) {
            this.isShowPayList = false;
            this.isShowBalancePayPop = true;
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
          this.orderMergePayNews();
        } else if (type === 2) {
          this.isShowPayList = false;
          this.gotopay();
        }
      },
      pay(order) {
        this.payData = order;
        this.isShowPayList = true;
      },
      toggleShowPayList() {
        this.isShowPayList = !this.isShowPayList;
      },
      /**
       * 确认收货
       */
      async confirmReceipt(item) {
        if (!item.id) {
          this.$bridge.dialog.alert({content: '订单信息异常！'});
        } else {
          let params = {
            id: item.id,
            type: 'MEMBER',
            rowVersion: item.rowVersion,
            passportId: this.userInfo.id
          };
          let res = await orderSign(params);
          if (res.firstErrorMessage === '') {
            if (!res.result) {
              this.$bridge.dialog.alert({content: '确认收货失败，请重试！'});
            } else {
              this.$bridge.dialog.alert({
                content: '确认收货成功！',
                confirmCallback: () => {
                  this.pageNumber = 1;
                  this.isEnd = false;
                  this.canDropDown = true;
                  this.list = [];
                  this.getOrderList();
                }
              });
            }
          } else {
            this.$bridge.dialog.alert({content: res.firstErrorMessage});
          }
        }
      },
      /**
       * 取消订单
       */
      async cancelOrder(item) {
        let params = {
          id: item.id,
          type: 'MEMBER',
          rowVersion: item.rowVersion,
          passportId: this.userInfo.id
        };
        let res = await cancelOrder(params);
        if (res.firstErrorMessage === '') {
          if (!res.result) {
            this.$bridge.dialog.alert({content: '取消订单失败，请重试！'});
          } else {
            this.$bridge.dialog.alert({
              content: '取消订单成功！',
              confirmCallback: () => {
                this.pageNumber = 1;
                this.isEnd = false;
                this.canDropDown = true;
                this.list = [];
                this.getOrderList();
              }
            });
          }
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 取消退貨
       */
      async cancelRefund(item) {
        let param = {
          id: item.id,
          type: 'MEMBER',
          rowVersion: item.rowVersion,
          passportId: this.userInfo.id
        };
        let res = await cancelRefund(param);
        if (res.firstErrorMessage === '') {
          this.$bridge.dialog.alert({
            content: '取消成功',
            confirmCallback: () => {
              this.pageNumber = 1;
              this.isEnd = false;
              this.canDropDown = true;
              this.list = [];
              this.getReFundList();
            }
          });
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 下拉加载
       */
      dropDown() {
        if (this.isEnd || !this.canDropDown) {
          return false;
        }
        this.canDropDown = false;
        if (this.type === 'EVALUATION') {
          this.getReFundList();
        } else {
          this.getOrderList();
        }
      },
      changeTab(item) {
        this.type = item.status;
        this.pageNumber = 1;
        this.isEnd = false;
        this.canDropDown = true;
        this.list = [];
        if (this.type === 'EVALUATION') {
          this.getReFundList();
        } else {
          this.getOrderList();
        }
      },
      /**
       * 获取退换货的数据
       */
      async getReFundList() {
        let params = {
          systemType: 'B2C',
          passportId: this.userInfo.id,
          memberId: this.userInfo.memberId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          storeId: '986901391685849088'
        };
        let res = await fetchRefundList(params, {isLoading: this.pageNumber === 1});
        this.list = this.list.concat(res.result);
        // 判断数据是否全部加载完
        if (res.result.length < this.pageSize) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      },
      async getOrderList() {
        var params = {
          memberId: this.userInfo.memberId,
          passportId: this.userInfo.id,
          isReturn: false,
          deviceType: null,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          status: this.type,
          systemType: 'B2C'
        };
        if (this.type === 'ALL') {
          delete params.status;
        }
        let res = await fetchRecordList(params, {isLoading: this.pageNumber === 1});
        this.list = this.list.concat(res.result);
        // 判断数据是否全部加载完
        if (res.result.length < this.pageSize) {
          this.isEnd = true;
          this.canDropDown = false;
        } else {
          this.canDropDown = true;
          this.pageNumber++;
        }
        this.isLoading = false;
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.type = this.$root.$mp.query.type || 'ALL';
      this.userInfo = this.$bridge.storage.get('userInfo');
      if (this.type === 'EVALUATION') {
        this.getReFundList();
      } else {
        this.getOrderList();
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .m-navbar-items.m-navbar-item-on {
    background-color: #fff;
    color: #db384c;
  }

  .m-navbar-items.m-navbar-item-on::before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: rpx(6);
    border-bottom: rpx(6) solid #db384c;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 3;
  }

  .m-orderlist {
    padding-top: rpx(90);
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .m-panel-hd label {
    float: right;
    color: #ea281a;
  }

  .m-panel-hda label {
    float: right;
    color: #333;
    margin-top: rpx(42);
  }

  .m-product-name {
    line-height: rpx(55);
  }

  .i-product-img {
    padding: rpx(29);
    float: left;
    text-align: center;

  }

  .i-product-img image {
    width: rpx(120);
    height: rpx(120);
  }

  .m-product-item {
    height: rpx(176);
    overflow: hidden;
    background-color: #f7f7fc;
  }

  .m-product-item:last-child .m-product-info::before {
    content: "";
    border: none;
  }

  .m-product-info {
    width: 99%;
    margin-top: rpx(60);
  }

  .m-product-list {
    background-color: f8f8f8 !important;
  }

  .u-pa .m-product-list {
    padding-top: rpx(68);
  }

  .m-product-info1 {
    height: rpx(210);
    width: rpx(538);
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-flow: row wrap;
    align-content: space-between;
  }

  .m-product-info1::before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: rpx(1);
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 3;
  }

  .m-total-info {
    text-align: right;
    padding: rpx(29);
    font-size: rpx(24);
  }

  .m-total-info label {
    font-size: rpx(28);
    color: #333;
  }

  .m-total-btn {
    text-align: right;
    padding: rpx(20) rpx(20) rpx(20) rpx(20);
    position: relative;
  }

  .m-total-btn::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .m-total-btn .u-link-btn {
    margin: 0 rpx(10);
    vertical-align: middle;
    display: inline-block;
    line-height: rpx(52);
    background-color: #fff;
  }

  .i-link-btn {
    border: rpx(1) solid #ea281a;
    color: #ea281a;
  }

  .m-navbar-items {
    position: relative;
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: rpx(26) 0;
    text-align: center;
    font-size: rpx(28);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    z-index: 2;
  }

  .m-total-price {
    position: relative;
    top: 0;
    font-weight: bold;
  }

  .m-navbar-items:after {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    color: #ccc;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }

  .m-navbar-items:last-child:after {
    display: none;
  }

  .shoppingcart {
    padding-top: rpx(321);
    padding-left: rpx(290);
    height: rpx(171);
    width: rpx(171);
  }

  .no-order-text {
    padding-top: rpx(20);
    padding-left: rpx(310);
    color: #999999;
    font-size: rpx(32);
  }

  .auth-box {
    width: rpx(640);
    background-color: #f4f4fb;
    box-shadow: 0 rpx(10) rpx(30) rgba(0, 0, 0, 0.5);
    height: rpx(515);
    border-radius: rpx(4);
    position: relative;
    top: rpx(-222);
  }

  .auth-box-title {
    margin-top: rpx(40);
    font-size: rpx(32);
    font-family: PingFangSC-Semibold;
  }

  .auth-box-meny {
    margin-top: rpx(40);
    font-size: rpx(72);
  }

  .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    float: left;
    position: relative;
    top: rpx(51);
    left: rpx(26);
    background: #fff;
    border-radius: rpx(4);
  }

  .iptbox {
    width: rpx(94.5);
    height: rpx(94);
    border: rpx(1) solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .ipt {
    width: 0;
    height: 0;
  }

  .btn-area {
    width: 80%;
    background-color: orange;
    color: white;
  }

  .auth-box-img {
    width: rpx(20);
    height: rpx(20);
    position: relative;
    top: rpx(-355);
    z-index: 2;
  }

  /*支付方式*/

  .auth-box-zhi {
    margin-top: rpx(27);
    font-size: rpx(32);
    color: #999;
  }

  .a-cell-con-img {
    width: rpx(100);
    height: rpx(100);
  }

  .a-cell-content {
    display: flex;
    flex-direction: row;
    margin-left: rpx(47);
    margin-top: rpx(28);
  }

  .a-cell-title {
    font-size: rpx(35);
    color: black;
  }

  .a-cell-tetx {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: rpx(54);
    margin-left: rpx(26);
    width: 72%;
  }

  .a-cells-te {
    font-size: rpx(28);
    color: #666;
    width: 92%;
  }

  .m-panel-sp-listbox {
    height: rpx(604);
  }

  .auth-box-imgs {
    width: rpx(20);
    height: rpx(20);
    position: absolute;
    top: rpx(38);
    right: rpx(40);
    z-index: 2;
  }

  .text {
    position: relative;
    top: rpx(180);
    color: #999;
    font-size: rpx(28);
    text-align: center;
  }

  .auth-pop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    z-index: 999;
  }

  .auth-box {
    width: rpx(640);
    background-color: #f4f4fb;
    box-shadow: 0 rpx(10) rpx(30) rgba(0, 0, 0, 0.5);
    height: rpx(515);
    border-radius: rpx(4);
    position: relative;
    top: rpx(-222);
  }

  .auth-box-title {
    margin-top: rpx(40);
    font-size: rpx(32);
    font-family: PingFangSC-Semibold;
  }

  .auth-box-meny {
    margin-top: rpx(40);
    font-size: rpx(72);
  }

  .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    float: left;
    position: relative;
    top: rpx(51);
    left: rpx(26);
    background: #fff;
    border-radius: rpx(4);
  }

  .iptbox {
    width: rpx(94.5);
    height: rpx(94);
    border: rpx(1) solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .ipt {
    width: 0;
    height: 0;
  }

  .btn-area {
    width: 80%;
    background-color: orange;
    color: white;
  }

  .auth-box-imgs {
    width: rpx(20);
    height: rpx(20);
    position: absolute;
    top: rpx(38);
    right: rpx(40);
    z-index: 2;
  }

  .m-panel-hda {
    padding: rpx(28) rpx(30) rpx(20);
    color: #999;
    font-size: rpx(24);
    position: relative;
  }
</style>
