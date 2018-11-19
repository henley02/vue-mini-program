<template>
  <div class="auth-pop">
    <div class="auth-box">
      <div class='auth-box-title'>输入支付密码</div>
      <div class='auth-box-meny'>￥{{amount}}</div>
      <div class="m-panel-bd">
        <div class="m-media-box m-media-box-small-appmsg">
          <div class="m-cell m-cell-access">
            <div class="m-cell-bd m-cell-primary">
              <p>支付方式</p>
            </div>
            <div>余额支付</div>
            <text class="m-cell-ft"></text>
          </div>
        </div>
      </div>
      <form>
        <div class='content'>
          <block v-for="(item,index) in 6" :key="index">
            <input class='iptbox' type="password" :value="paymentCode.length>=index+1?paymentCode[index]:''" disabled
                   @tap='getFocus()'/>
          </block>
        </div>
        <input name="password" type="password" class='ipt' maxlength="6" :focus="isFocus" v-model="paymentCode"
               @blur="lossFocus"/>
      </form>
      <image :src="closeImg" class='auth-box-img' @tap='closeBalancePayPop()'/>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * 余额支付的弹框
   */
  export default {
    name: 'balance-pay-pop',
    props: {
      amount: {}
    },
    watch: {
      paymentCode(newVal, oldVal) {
        if (newVal.length >= 6) {
          this.$emit('inputFinished', newVal);
        }
      }
    },
    data() {
      return {
        paymentCode: '', // 支付密码
        isFocus: false, // 支付密码输入框获取焦点
        closeImg: require('public/images/close.png')
      };
    },
    methods: {
      /**
       * 失去焦点
       */
      lossFocus() {
        this.isFocus = false;
      },
      /**
       * 获取焦点
       */
      getFocus() {
        this.isFocus = true;
      },
      closeBalancePayPop() {
        this.lossFocus();
        this.paymentCode = '';
        this.$emit('closeBalancePayPop');
      }
    },
    created() {
      this.isFocus = true;
    }
  };
</script>
<style scoped="" lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/pay.styl";
  .m-panel-bd
    border-bottom: rpx(1) solid #DDDDDD;

  .m-cell-access
    font-size: 14px;
    background: #F4F4FB;

  .m-cell-primary
    position: relative;
    right: 77px;
</style>
