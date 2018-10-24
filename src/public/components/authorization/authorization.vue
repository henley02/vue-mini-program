<template>
  <div class="auth-pop" v-if="!isAuthorization">
    <div class="auth-box">
      <image src="http://appicon-1253690476.file.myqcloud.com/auth/shield.png"></image>
      <label>用户授权</label>
      <text>使用微信头像、昵称授权</text>
      <button open-type="getUserInfo" type="primary" @getuserinfo="getUserInfo">一键授权</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * 用户授权
   */
  export default {
    name: 'authorization',
    props: {
      isAuthorization: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      getUserInfo(e) {
        let app = getApp();
        // 允许了授权
        if (e.mp.detail.errMsg === 'getUserInfo:ok') {
          this.$emit('update:isAuthorization', true);
          app.globalData.wxInfo = JSON.parse(e.mp.detail.rawData);
          console.log(app.globalData.wxInfo);
        }
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  /* common/authorization-info.wxss */
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
    width: rpx(600);
    background-color: #fff;
    border-radius: rpx(24);
    box-sizing: border-box;
    padding: rpx(110) rpx(88);
    box-shadow: 0 rpx(10) rpx(30) rgba(0, 0, 0, 0.5);
  }

  .auth-box image {
    width: rpx(166);
    height: rpx(197);
  }

  .auth-box label {
    font-size: rpx(32);
    color: #333;
    margin: rpx(20) 0;
    display: inline-block;
    width: 100%;
  }

  .auth-box text {
    font-size: rpx(24);
    color: #666;
  }

  .auth-box button {
    margin-top: rpx(80);
  }
</style>
