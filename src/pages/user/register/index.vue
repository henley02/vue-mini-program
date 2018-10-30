<template>
  <div class='wrapper'>
    <h-input label="手机号" :type="`number`" v-model="mobilePhone" placeholder="您的手机号" maxlength="11"
             name="mobilePhone">
    </h-input>

    <div style="position: relative">
      <h-input label="验证码" :type="`number`" v-model="SMSVerificationCode" placeholder="您收到的验证码" maxlength="8"
               name="SMSVerificationCode" :inputClass="`width-212`"></h-input>
      <div v-if="!isSend" class="captcha" @tap="verify">获取验证码</div>
      <div v-else="" class="captcha" style="color:#999">{{countdown}}s</div>
    </div>

    <div style="position: relative">
      <h-input label="图形验证码" :type="`number`" v-model="graphicVerificationCode" placeholder="" maxlength="8"
               name="graphicVerificationCode"
               :inputClass="`width-212`"></h-input>
      <image :src='verifyCode.img' class="Captchimg" @tap='fetchIdentifyingCode'></image>
    </div>
    <div class="btn_confirm" :class="{'disable': !hasValue}" @tap='nextStep'>下一步</div>
    <register-agreement v-if="type==='REGISTER'"></register-agreement>
  </div>
</template>

<script>
  /**
   * 注册、找回密码的第一个页面
   */
  import registerAgreement from 'public/components/register-agreement/register-agreement.vue';

  import {
    fetchIdentifyingCode,
    fetchMobileVerificationCode,
    mobileVerificationCodeCheck,
    checkGraphicVerificationCode
  } from 'api/index';

  export default {
    data() {
      return {
        t: '',
        mobilePhone: '',
        code: '',
        graphicVerificationCode: '', // 图形验证码
        SMSVerificationCode: '', // 短信验证码
        countdown: 60,
        isSend: false,
        type: '',
        verifyCode: {
          img: '',
          uID: ''
        }
      };
    },
    computed: {
      hasValue() {
        if (this.mobilePhone.trim() === '' || this.graphicVerificationCode.trim() === '' || this.SMSVerificationCode.trim() === '') {
          return false;
        }
        return true;
      }
    },
    methods: {
      /**
       * 下一步
       */
      async nextStep() {
        if (this.mobilePhone.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入您的手机号'});
          return;
        }
        if (!(/^1\d{10}$/.test(this.mobilePhone))) {
          this.$bridge.dialog.alert({content: '请输入正确的手机号'});
          return;
        }
        if (this.SMSVerificationCode.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入验证码'});
          return;
        }
        if (this.graphicVerificationCode.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入图形验证码'});
          return;
        }
        let res = await mobileVerificationCodeCheck({code: this.SMSVerificationCode, type: 'SHORT_MOBILE'});
        if (res.isVerificated) {
          let res1 = await checkGraphicVerificationCode({code: this.graphicVerificationCode, id: this.verifyCode.uID});

          if (res1.verified) {
            if (this.type === 'REGISTER') {
              this.$bridge.link.navigateTo('/pages/user/register-set-login-password/main?type=register');
            } else {
              this.$bridge.link.navigateTo(`/pages/user/register-set-login-password/main?type=forgetPassword&code=${this.SMSVerificationCode}`);
            }
          } else {
            this.$bridge.dialog.alert({content: '图形验证码错误'});
            this.fetchIdentifyingCode();
          }
        } else {
          this.$bridge.dialog.alert({content: '验证码错误'});
          this.fetchIdentifyingCode();
        }
      },
      /**
       * 获取手机验证码
       */
      async verify() {
        if (!(/^1\d{10}$/.test(this.mobilePhone))) {
          this.$bridge.dialog.alert({content: '请输入正确的手机号'});
          return;
        }
        let params = {
          mobilePhone: this.mobilePhone,
          type: this.type
        };
        let res = await fetchMobileVerificationCode(params);
        if (res.firstErrorMessage === '') {
          this.$bridge.storage.save('userName', this.mobilePhone);
          this.countdown = 60;
          this.isSend = true;
          this.t = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) {
              this.isSend = false;
              clearInterval(this.t);
            }
          }, 1000);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 获取图形验证码
       * @returns {Promise.<void>}
       */
      async fetchIdentifyingCode() {
        let res = await fetchIdentifyingCode({});
        if (res.firstErrorMessage === '') {
          res.verifyCode.img = 'data:image/png;base64,' + res.verifyCode.img;
          this.verifyCode = res.verifyCode;
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    components: {
      registerAgreement
    },
    onLoad(options) {
      if (options.type === 'register') {
        this.type = 'REGISTER';
        wx.setNavigationBarTitle({
          title: '注册'
        });
      } else if (options.type === 'forgetPassword') {
        this.type = 'CHECK';
        wx.setNavigationBarTitle({
          title: '找回密码'
        });
      }
      this.fetchIdentifyingCode();
    },
    onShow() {
      clearInterval(this.t);
      this.isSend = false;
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
    right: rpx(34);
    top: 0;
    z-index: 9;
    line-height: rpx(90);
  }

  .Captchimg {
    height: rpx(64);
    width: rpx(130);
    position: absolute;
    right: rpx(34);
    top: rpx(14);
    z-index: 2;

  }
</style>

