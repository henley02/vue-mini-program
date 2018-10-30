<template>
  <div class="container">
    <div class='m-security'>
      <div class='m-account-list' v-for="(item,index) in list" :key="index">
        <div class='m-title'>
          <div class='name'>{{item.name}}</div>
          <div class='desc'>{{item.desc}}</div>
        </div>
        <div class='m-btn' @tap='jump(item.url)'>{{item.btnText}}</div>
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
      return {
        list: [
          {name: '登录密码', desc: '用于修改您的账户登录密码', btnText: '修改密码', url: '/pages/user/change-password/main'},
          {name: '支付密码', desc: '用于修改您的支付密码', btnText: '修改密码', url: '/pages/user/change-payment-code/main'}
        ]
      };
    },
    methods: {
      jump(url) {
        this.$bridge.link.navigateTo(url);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  body, html {
    background-color: rgb(244, 244, 244)
  }

  .m-account-list {
    background: #FFFFFF;
    border-top: rpx(1) solid rgb(244, 244, 244);
    height: rpx(163);
  }

  .m-title {
    padding: rpx(39) 0 rpx(40) rpx(30);
  }

  .name {
    font-size: rpx(32);
  }

  .desc {
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
