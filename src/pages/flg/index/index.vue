<template>
  <div class="container">
    <div class="banner">
      <div class="banner-wrapper">
        <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">获取用户信息</button>
        <div style="border-radius: 50%;height: 60px;width:60px; ">
          <open-data type="userAvatarUrl" class="" class="head-img"></open-data>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 芳聊馆首页
   */
  export default {
    data() {
      return {
        userInfo: {}
      };
    },
    components: {},
    computed: {},
    methods: {
      onGotUserInfo(e) {
        console.log(e.detail.userInfo);
        console.log(e.detail.rawData);
      }
    },
    async onShow() {
      console.log(1);
      this.userInfo = await this.$bridge.user.getWXUserInfo();
      console.log(this.userInfo);
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable";
  @import "~public/stylus/mixin";
  .container {
    padding-top: rpx(30);
  }

  .banner {
    margin: 0 auto;
    width: 92%;
    height: rpx(297)
    border: 1px solid red;
    border-radius: rpx(10)
  }

  .banner-wrapper {
    padding-top: rpx(90);
  }

  .head-img {
    display: inline-block;
    width: rpx(120);
    height: rpx(120);
    border-radius: 50%;
  }
</style>
