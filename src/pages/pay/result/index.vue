<template>
  <div class="m-payment">
    <image :src="successImg" v-if="result=='success'"/>
    <image :src="failImg" v-if="result=='fail'"/>
    <div class='m-price'>
      <text style="padding-left:0;padding-right:10rpx;">¥</text>
      {{amount}}
    </div>
    <div class='m-btn'>
      <div class='m-btn-1' @tap='goOrderList()'>查看订单</div>
      <text class='p-btn-text'></text>
      <div class='m-btn-2' @tap='goIndex()'>返回首页</div>
    </div>
  </div>
</template>

<script>
  /**
   * 支付结果页面（成功、失败）
   */
  export default {
    data() {
      return {
        result: '',
        amount: 0,
        successImg: require('public/images/pay/paysuccess.png'),
        failImg: require('public/images/pay/payfailed.png')
      };
    },
    methods: {
      goOrderList() {
        this.$bridge.link.navigateTo(`/pages/user/order-list/main`);
      },
      goIndex() {
        this.$bridge.link.goIndex();
      }
    },
    onUnload() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
    },
    onShow() {
      let {result, amount} = this.$root.$mp.query;
      this.result = result;
      this.amount = amount;
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .m-payment {
    background: #FFFFFF;
    height: rpx(594);
  }

  image {
    height: rpx(200);
    width: rpx(200);
    padding-top: rpx(74);
    padding-left: rpx(283);
  }

  .m-price {
    text-align: center;
    font-size: rpx(64);
    margin-top: rpx(20);

  }

  .m-btn {
    margin-top: rpx(70);
    display: flex;
    font-size: rpx(28);
  }

  .m-btn-1 {
    padding-left: rpx(182);
  }

  .p-btn-text {
    padding-left: rpx(82);
    border-right: rpx(1) solid #dddddd;
  }

  .m-btn-2 {
    padding-left: rpx(83);
  }
</style>
