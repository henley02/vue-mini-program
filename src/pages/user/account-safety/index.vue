<template>
  <div class="container">
    <div class='m-security'>
      <div class='m-account-list'>
        <div class='m-title'>
          <div class='m-title1'>登录密码</div>
          <div class='m-detail'>用于修改您的账户登录密码</div>
        </div>
        <div class='m-btn' @tap='changepassword'>修改密码</div>
      </div>
      <div class='m-account-list'>
        <div class='m-title'>
          <div class='m-title1'>支付密码</div>
          <div class='m-detail'>用于修改您的支付密码</div>
        </div>
        <div class='m-btn' @tap='paymentpassword'>修改密码</div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 账户安全
   */
  export default {
    data() {
      return {};
    },
    components: {},
    computed: {},
    methods: {},
    onShow() {
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  .m-account-list {
    background: #FFFFFF;
    border-top: rpx(1) solid rgb(244, 244, 244);
    height: rpx(163);
  }

  .m-title {
    padding: rpx(39) 0 rpx(40) rpx(30);

  }

  .m-title1 {
    font-size: rpx(32);
  }

  .m-detail {
    padding-top: rpx(4);
    color: #999999;
    font-size: rpx(24);
  }

  .m-btn {
    position: relative;
    top: rpx(-97);
    right: rpx(-554);
    border: rpx(1) solid #999999;
    border-radius: rpx(4);
    height: rpx(52);
    width: rpx(150);
    text-align: center;
    line-height: rpx(52);
    font-size: rpx(28);
  }
</style>
