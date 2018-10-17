<template>
  <div class='wrapper'>
    <h-input label="手机号" :type="`number`" v-model="username" placeholder="您的手机号" maxlength="22"
             name="username">
    </h-input>

    <div style="position: relative">
      <h-input label="验证码" :type="`number`" v-model="code" placeholder="您收到的验证码" maxlength="8"
               name="code" :inputClass="`width-212`"></h-input>
      <div class="captcha" @tap="verify">
        {{btnTxt}}
      </div>
    </div>

    <div style="position: relative">
      <h-input label="图形验证码" :type="`number`" v-model="code" placeholder="您收到的验证码" maxlength="8" name="code"
               :inputClass="`width-212`"></h-input>
      <image :src='passimage' class="Captchimg" mode='mode' @tap='clickpassimage'></image>
    </div>
    <div class="btn_confirm" :class="{'disable': !hasValue}" @tap='nextStep'>下一步</div>
    <register-agreement v-if="type==='register'"></register-agreement>
  </div>
</template>

<script>
  /**
   * 注册、找回密码的第一个页面
   */
  import hInput from 'public/components/h-input/h-input.vue';
  import registerAgreement from 'public/components/register-agreement/register-agreement.vue';

  export default {
    data() {
      return {
        btnTxt: '获取验证码',
        username: '',
        code: '',
        time: 60,
        type: '',
        passimage: 'data:image/png;base64,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'
      };
    },
    computed: {
      hasValue() {
        if (this.username.trim() === '' || this.code.trim() === '') {
          return false;
        }
        return true;
      }
    },
    components: {
      hInput, registerAgreement
    },
    created() {
    },
    onLoad(options) {
      this.type = options.type;
      if (this.type === 'register') {
        wx.setNavigationBarTitle({
          title: '注册'
        });
      } else if (this.type === 'forgetPassword') {
        wx.setNavigationBarTitle({
          title: '找回密码'
        });
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/login";

  .captcha {
    display: inline-block;
    color: #ea281a;
    font-size: rpx(32);
    position: absolute;
    right: rpx(18);
    top: 0;
    z-index: 9;
    line-height: rpx(90);
  }

  .Captchimg {
    height: rpx(64);
    width: rpx(130);
    position: absolute;
    right: rpx(18);
    top: rpx(14);
    z-index: 2;

  }
</style>

