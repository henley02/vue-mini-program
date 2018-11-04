<template>
  <div>
    <div class='userContainer'>
      <image :src='stripedImg' class='v-cell'/>
      <block v-if="orderLogistcsStatus">
        <navigator class="m-cell m-cell-access">
          <div class="m-cell-hd">
            <image :src='carImg' class='m-cell-img'/>
          </div>
          <div class=" order-logistcs m-cell-bd m-cell-primary" v-if="orderLogistcsStatus!==''">
            <div class="order-logistcs" v-if="orderLogistcsStatus == 0">在途中 {{orderLogisticsContent}}</div>
            <div class="order-logistcs" v-if="orderLogistcsStatus == 1">已发货 {{orderLogisticsContent}}</div>
            <div class="order-logistcs" v-if="orderLogistcsStatus == 2">疑难件 {{orderLogisticsContent}}</div>
            <div class="order-logistcs" v-if="orderLogistcsStatus == 3">已签收 {{orderLogisticsContent}}</div>
            <div class="order-logistcs" v-if="orderLogistcsStatus == 4">已退货 {{orderLogisticsContent}}</div>
          </div>
          <image :src='arrowsRightImg' class='i-img'/>
        </navigator>
      </block>
      <div>
        <div class='useDesStyle'>
          <text class='nameStyle2'>{{orderShipping.contactName}}</text>
          <text class='nameStyle'>{{orderShipping.contactPhone}}</text>
        </div>
        <div class='c-address'>
          <image class='addressSty' :src="positionImg"/>
          <text class='detail-address'>{{address}}</text>
        </div>
      </div>
    </div>

    <div class="m-product-all">
      <div>
        <div class="m-panel-hd">订单编号：{{orderId}}
          <label>{{order.orderStatus}}</label>
        </div>
      </div>
      <div class="m-product-list" v-for="(item,index) in order.orderLineList" :key="index">
        <div class="m-product-item">
          <div class="m-product-img">
            <image :src="item.pictureUrl"/>
          </div>
          <div class="m-product-info">
            <div class="m-product-name ">
              <div>
                <div class='m-sty-name'>{{item.commodityTitle}}</div>
                <div class='m-sty-name-s'>规格</div>
              </div>
              <div class='m-te'>x{{item.quantity}}</div>


            </div>
            <div class="m-product-name name">
              <label>￥ {{item.unitPrice}}</label>
              <navigator
                :url="'/pages/user/refund-create/main?orderId='+orderId+'&lineId='+item.id+'&orderStatus='+order.orderStatus"
                class="u-link-btn"
                v-if="order.orderStatus=='待发货' || order.orderStatus=='待收货' || order.orderStatus=='待评价'">退款/退货
              </navigator>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="detail-center">
        <div>商品金额</div>
        <div>￥{{order.goodsAmount}}</div>
      </div>
      <div class="detail-center">
        <div>邮费</div>
        <div>+￥{{order.freightFee}}</div>
      </div>
      <div class="detail-center">
        <div>优惠折扣</div>
        <div>-￥{{order.freeAmount}}</div>
      </div>
      <div class="detail-center">
        <div>积分折扣</div>
        <div>-￥{{order.pointAmount}}</div>
      </div>
      <div class="detail-center" style='font-size:28rpx;padding-top:8rpx;'>
        <div>合计</div>
        <div style='color:#ea281a'>￥{{totalAmount}}</div>
      </div>
    </div>

    <div class="detail">
      <div class="detail-center" style='color:#666666'>
        <text>付款信息</text>
      </div>
    </div>
    <div class="detail">
      <div class="detail-center">
        <text>下单日期: {{order.orderTime}}</text>
      </div>
      <div class="detail-centers">
        <block v-for="(item,index) in paymentLineList" :key="index">
          <div v-if="item.type == 'CASH'">现金支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'BANK'">银行卡支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'THIRD'">第三方支付(微信和支付宝): {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'CARD'">会员卡支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'POINT'">积分支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'TICKET'">优惠券支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'DISCOUNT'">折扣支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'PRE_PAID_CARD'">礼品卡支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
          <div v-else-if="item.type == 'OTHER'">其他支付方式支付: {{item.account}}
            <text>￥{{item.amount}}</text>
          </div>
        </block>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 订单详情
  * */
  import {fetchOrderDetail, fetchOrderLogistics} from 'api/index';

  export default {
    name: 'consumption-records',
    data() {
      return {
        positionImg: require('public/images/location.png'),
        carImg: require('public/images/user/car.png'),
        stripedImg: require('public/images/user/striped.png'),
        arrowsRightImg: require('public/images/arrows-right.png'),
        userInfo: {},
        orderId: '',
        orderShipping: {},
        order: {},
        payment: {},
        paymentLineList: [],
        orderLineList: [],
        totalAmount: '',
        orderLogistcsStatus: null,
        orderLogisticsContent: null
      };
    },
    computed: {
      address() {
        return this.orderShipping.provinceName + this.orderShipping.cityName + this.orderShipping.districtName + this.orderShipping.address;
      }
    },
    methods: {
      /**
       * 获取订单详情
       */
      async getOrderDetail() {
        let params = {
          id: this.orderId,
          passportId: this.userInfo.id
        };
        let res = await fetchOrderDetail(params);
        if (res.firstErrorMessage === '') {
          res.order.orderStatus = '未知';
          if (res.order.status === 'UN_PAID') {
            res.order.orderStatus = '待付款';
          } else if (res.order.status === 'UN_SHIPMENT') {
            res.order.orderStatus = '待发货';
          } else if (res.order.status === 'UN_SIGNED') {
            res.order.orderStatus = '待收货';
          } else if (res.order.status === 'SIGNED') {
            res.order.orderStatus = '待评价';
          } else if (res.order.status === 'EVALUATION') {
            res.order.orderStatus = '已评价';
          } else if (res.order.status === 'CANCELLED') {
            res.order.orderStatus = '已取消';
          } else if (res.order.status === 'WAIT_GROUP') {
            res.order.orderStatus = '待拼团';
          }
          res.order.orderTime = this._dateFormat(res.order.time, 'yyyy-MM-dd hh:mm:ss');
          if (res.payment === undefined || res.payment === null || res.payment === '') {
            this.totalAmount = res.order.paidAmount;
          } else {
            this.totalAmount = res.order.paidAmount;
            this.paymentLineList = res.payment.paymentLineList;
          }
          this.order = res.order;
          this.orderShipping = res.orderShipping;
          this.payment = res.payment;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 获取物流信息
       */
      async getOrderLogistics() {
        let params = {
          id: this.orderId,
          passportId: this.userInfo.id
        };
        let res = await fetchOrderLogistics(params);
        if (res.firstErrorMessage === '') {
          if (res.orderLogisticsList && res.orderLogisticsList.length > 0 && res.orderLogisticsList[0].logisticsStatus !== '') {
            let orderLogistcsStatus = res.orderLogisticsList[0].logisticsStatus;
            let orderLogisticsContent = res.orderLogisticsList[0].logisticsDetailList[0].context;
            this.orderLogistcsStatus = orderLogistcsStatus;
            this.orderLogisticsContent = orderLogisticsContent;
          }
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onLoad(options) {
      this.orderId = options.orderId;
    },
    onShow() {
      if (this.orderId) {
        this.userInfo = this.$bridge.storage.get('userInfo');
        this.getOrderDetail();
        this.getOrderLogistics();
      } else {
        this.$bridge.dialog.alert({
          content: '订单异常！',
          confirmCallback: () => {
            wx.navigateBack();
          }
        });
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .v-cell {
    width: 100%;
    height: rpx(6);
  }

  .m-cell-hd {
    color: #fd690c
  }

  .m-product-img {
    width: rpx(178);
    height: rpx(178)
  }

  .m-cell-access {
    border-bottom: rpx(1) solid #eee;
    padding: rpx(30);
  }

  .userContainer {
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .useDesStyle {
    padding: rpx(30) 0 0 rpx(63);
    font-family: PingFang-SC-Regular;
    font-size: rpx(32);
    color: #333;
    font-weight: bold;
  }

  .nameStyle {
    padding-left: rpx(44);
  }

  .c-address {
    padding: rpx(14) 0 rpx(30) rpx(26);
    font-size: rpx(28);
    display: flex;
  }

  .addressSty {
    width: rpx(20);
    height: rpx(26);
    padding-top: rpx(6);
    padding-left: rpx(6);
  }

  .detail-centers {
    font-size: rpx(24);
  }

  .detail-address {
    padding-left: rpx(10);
  }

  .m-product-list {
    padding: rpx(30);
  }

  .bootom-img {
    width: 100%;
    height: rpx(4);
  }

  .i-img {
    width: rpx(20);
    height: rpx(30);
  }

  .m-product-all {
    margin-top: rpx(20);
    background: #fff;
  }

  .m-product-name {
    display: flex;
    justify-content: space-between;
  }

  .name {
    color: #ea281a;
    height: rpx(70)
  }

  .m-product-name .m-te {
    color: #666;
  }

  .m-cell-img {
    display: flex;
    width: rpx(24);
    height: rpx(20);
    align-self: center;
    top: rpx(5);
  }

  .m-cell-primary {
    padding-left: rpx(10);
    margin-top: rpx(26);
  }

  .m-panel-hd label {
    float: right;
    color: #52c26e;
  }

  .m-panel-hd {
    padding: rpx(30);
  }

  .detail {
    padding: rpx(20) rpx(20) rpx(29) rpx(39);
    font-size: rpx(30);
    color: #333;
    background: #fff;
    position: relative;
    margin-bottom: rpx(20);
  }

  .detail::before {
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

  .detail::after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .detail-center {
    display: flex;
    justify-content: space-between;
    font-size: rpx(24);
    line-height: rpx(39);
  }

  .m-sty-name {
    width: rpx(410);
  }

  .m-sty-name-s {
    width: rpx(410);
    font-size: rpx(24);
    color: #999;
  }

  .order-logistcs {
    font-size: rpx(24);
    height: rpx(64);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }

  .u-link-btna {
    margin: 0 rpx(10);
    vertical-align: middle;
    display: inline-block;
    line-height: rpx(52);
    background-color: #fff;
    color: #000000;
    border: rpx(1) #999999 solid;
  }

</style>
