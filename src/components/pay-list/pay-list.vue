<template>
  <div class="auth-pop">
    <div class="auth-box">
      <div class='auth-box-zhi'>选择支付方式</div>
      <div class='a-cell-content' @tap='changePayType(1)'>
        <image :src='yueImg' class='a-cell-con-img'/>
        <div class='a-cell-tetx'>
          <div class='a-cell-title'>余额支付</div>
          <div class='a-cells-te'>使用你的账号余额支付</div>
        </div>
      </div>
      <div class='a-cell-content' @tap='changePayType(2)'>
        <image :src='weiXinImg' class='a-cell-con-img'/>
        <div class='a-cell-tetx' style='margin-top:23rpx;'>
          <div class='a-cell-title'>微信支付</div>
        </div>
      </div>
      <image :src="closeImg" class='auth-box-imgs' @tap='toggleShowPayList'/>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * 支付方式
   */
  export default {
    name: 'pay-list',
    data() {
      return {
        yueImg: require('public/images/pay/yue.png'),
        weiXinImg: require('public/images/pay/weixin.png'),
        closeImg: require('public/images/close.png')
      };
    },
    methods: {
      changePayType(type) {
        this.$emit('changePayType', type);
      },
      toggleShowPayList() {
        this.$emit('toggleShowPayList');
      }
    }
  };
</script>
<style scoped="" lang="stylus" rel="stylesheet/stylus">
  @import "~public/css/pay.styl";
  .auth-box
    top: -20px
    background: #FFFFFF;
    position: relative;
</style>
