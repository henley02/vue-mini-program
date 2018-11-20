<template>
  <div class='m-record'>
    <block v-for="(item,index) in exchangeData" :key="index">
      <div class='m-product'>
        <image :src='item.orderLineList[0].pictureUrl'></image>
        <div class='m-product-message'>
          <div class='message1'>
            <div class='title'>{{item.orderLineList[0].commodityTitle}}</div>
            <div class='status' v-if="item.status == 'UN_PAID'">待付款</div>
            <div class='status' v-if="item.status == 'UN_PAID'">待付款</div>
            <div class='status' v-if="item.status == 'UN_PAID'">待付款</div>
            <div class='status' v-if="item.status == 'UN_SHIPMENT'">待发货</div>
            <div class='status' v-if="item.status == 'UN_SIGNED'">待收货</div>
            <div class='status' v-if="item.status == 'SIGNED'">已签收</div>
            <div class='status' v-if="item.status == 'EVALUATION'">已评价</div>
            <div class='status' v-if="item.status == 'CANCELLED'">已取消</div>
            <div class='status' v-if="item.status == 'WAIT_GROUP'">待拼团</div>
          </div>
          <div class='message2'>
            <div class='point'>{{item.orderLineList[0].pointValue}}积分</div>
          </div>
        </div>
      </div>
      <navigator class="u-link-btn" @tap="confirmReceipt(item)" v-if="item.status == 'UN_SIGNED'">确认收货</navigator>
    </block>
    <div v-if="exchangeData.length == 0 && !isLoading">
      <image :src="noDataImg" class='shoppingcart'></image>
      <div class='text'>暂无兑换记录</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 积分兑换记录
  * */
  import {fetchRecordList, orderSign} from 'api/index.js';

  export default {
    name: 'points-record',
    data() {
      return {
        noDataImg: require('public/images/exchange.png'),
        exchangeData: [],
        isLoading: true,
        userInfo: {}
      };
    },
    methods: {
      /**
       * 确认收货
       */
      async confirmReceipt(item) {
        let params = {
          passportId: this.userInfo.id,
          id: item.id,
          signType: 'MANUAL',
          rowVersion: item.rowVersion
        };
        let res = await orderSign(params);
        if (res.firstErrorMessage === '' && res.result) {
          this.$bridge.dialog.alert({content: '收货成功'});
          this.init();
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 获取积分兑换列表
       * @returns {Promise.<void>}
       */
      async init() {
        this.isLoading = true;
        let params = {
          passportId: this.userInfo.id,
          memberId: this.userInfo.memberId,
          systemType: 'POINT',
          isPaid: true,
          mobileType: 'MOBILE'
        };
        let res = await fetchRecordList(params, {isLoading: true});
        if (res.firstErrorMessage === '') {
          this.exchangeData = res.result;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
        this.isLoading = false;
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.init();
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .m-product {
    display: flex;
    height: rpx(230);
    background: #fff;
  }

  .m-product image {
    width: rpx(178);
    height: rpx(178);
    padding-top: rpx(35);
    padding-left: rpx(30);
  }

  .m-product-message {
    margin-left: rpx(20);
    margin-top: rpx(30);
    width: rpx(522);
    border-bottom: rpx(1) solid #eee;
  }

  .message1 {
    display: flex;
    justify-content: space-between;
  }

  .title {
    font-size: rpx(32);
    width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status {
    font-size: rpx(24);
    margin-right: rpx(30);
  }

  .message2 {
    width: 60%;
    margin-top: rpx(99);
    display: flex;
    justify-content: space-between;
  }

  .point {
    color: #ea281a;
    font-size: rpx(32);
  }

  .shoppingcart {
    padding-top: rpx(323);
    padding-left: rpx(290);
    height: rpx(171);
    width: rpx(171);
  }

  .text {
    padding-top: rpx(25);
    padding-left: rpx(295);
    color: #999;
    font-size: rpx(28);
  }

  .u-link-btn {
    margin: 0 rpx(10);
    vertical-align: middle;
    display: inline-block;
    line-height: rpx(52);
    background-color: #fff;
    position: relative;
    left: rpx(566);
    top: rpx(-74)
  }

</style>
