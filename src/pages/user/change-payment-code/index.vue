<template>
  <div class='wrapper'>
    <h-input label="手机号" :type="`number`" v-model="mobilePhone" placeholder="请输入手机号码" maxlength="11"
             name="mobilePhone">
    </h-input>

    <div style="position: relative">
      <h-input label="验证码" :type="`number`" v-model="SMSVerificationCode" placeholder="您收到的验证码" maxlength="8"
               name="SMSVerificationCode" :inputClass="`width-212`"></h-input>
      <div v-if="!isSend" class="captcha" @tap="verify">获取验证码</div>
      <div v-else="" class="captcha" style="color:#999">{{countdown}}s</div>
    </div>
    <button class="btn_confirm" :class="{'disable': !hasValue}" @tap='nextStep'>下一步</button>
  </div>
</template>

<script>
  /**
   * 修改交易密码--第一步
   */
  import {fetchMobileVerificationCode, mobileVerificationCodeCheck} from 'api/index';

  export default {
    data() {
      return {
        t: '',
        mobilePhone: '',
        code: '',
        SMSVerificationCode: '', // 短信验证码
        countdown: 60,
        isSend: false,
        userInfo: {},
        errorImg: require('public/images/fail.png')
      };
    },
    computed: {
      hasValue() {
        if (this.mobilePhone.trim() === '' || this.SMSVerificationCode.trim() === '') {
          return false;
        }
        return true;
      }
    },
    methods: {
      async nextStep() {
        if (!(/^1\d{10}$/.test(this.mobilePhone))) {
          this.$bridge.dialog.alert({content: '请输入正确的手机号'});
          return;
        }
        if (this.SMSVerificationCode.trim() === '') {
          this.$bridge.dialog.alert({content: '请输入验证码'});
          return;
        }
        let params = {
          mobilephone: this.mobilePhone,
          code: this.SMSVerificationCode,
          type: 'SHORT_MOBILE'
        };
        let res = await mobileVerificationCodeCheck(params);
        if (res.firstErrorMessage === '') {
          if (res.isVerificated) {
            wx.showToast({
              title: '验证成功',
              icon: 'success'
            });
            setTimeout(() => {
              let url = `/pages/user/change-payment-code-sutry/main`;
              if (this.$root.$mp.query.backStepNumber) {
                url += `?backStepNumber=${this.$root.$mp.query.backStepNumber}`;
              }
              this.$bridge.link.navigateTo(url);
            }, 1500);
          } else {
            this.$bridge.dialog.alert({content: '验证码错误'});
          }
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
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
        if (this.mobilePhone !== this.userInfo.userAccount) {
          this.$bridge.dialog.alert({content: '与当前账户不一致'});
          return;
        }
        let params = {
          mobilePhone: this.mobilePhone,
          type: 'CHECK'
        };
        let res = await fetchMobileVerificationCode(params);
        if (res.firstErrorMessage === '') {
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
      }
    },
    onShow() {
      clearInterval(this.t);
      Object.assign(this.$data, this.$options.data());// 还原原始数据
      this.userInfo = this.$bridge.storage.get('userInfo');
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";

  .wrapper {
    margin-top: rpx(30)
  }

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

  .btn_confirm {
    margin: rpx(76) rpx(30)
    background-color: #EA281A;
    color: white;
    font-size: rpx(32)
  }
</style>

