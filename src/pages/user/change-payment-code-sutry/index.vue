<template>
  <div class='wrapper'>
    <form bindsubmit="formSubmit" v-if="flag==false">
      <text class="info">输入6位数字支付密码</text>
      <div class='content'>
        <block v-for="(item,index) in 6" :key="index">
          <input class='iptbox' :value="Value.length>=index+1?Value[index]:''" disabled :password='ispassword'
                 catchtap='Tap'/>
        </block>
      </div>
      <input name="password" :password="true" class='ipt' maxlength="6" focus="isFocus" bindinput="Focus"/>
      <div>
        <button class="btn-area" formType="submit" bindtap='onSubmit'>确认</button>
      </div>
    </form>
    <form bindsubmit="formSubmit" v-else>
      <text class="info">再次输入</text>
      <div class='content'>
        <block v-for="(item,index) in 6" :key="index">
          <input class='iptbox' :value="Value.length>=index+1?Value[index]:''" disabled password='ispassword'
                 catchtap='Tap'/>
        </block>
      </div>
      <input name="password" :password="true" class='ipt' maxlength="6" focus="isFocus"
             bindinput="Focus"/>
      <div>
        <button class="btn-area" formType="submit" bindtap='onSubmits'>确认</button>
      </div>
    </form>
  </div>
</template>

<script>
  /**
   * 修改交易密码--第二步
   */
  import registerAgreement from 'public/components/register-agreement/register-agreement.vue';

  import {
    fetchIdentifyingCode,
    fetchMobileVerificationCode
  } from 'api/index';

  export default {
    data() {
      return {
        flag: false
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

  .info {
    width: rpx(660);
    margin: rpx(40) auto 0 auto;
    font-size: rpx(36);
    display: block;
    padding-left: rpx(10);
  }

  .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: rpx(660);
    margin: rpx(40) auto 0 auto;
    border: rpx(2) solid #ddd;
    border-radius: rpx(10);
    background: #fff;
    height: rpx(100);
  }

  .iptbox {
    width: rpx(102);
    height: rpx(80);
    border-right: rpx(1) solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .iptbox:last-child {
    border-right: none;
  }

  .ipt {
    width: 0;
    height: 0;
  }

  .btn-area {
    width: rpx(660);
    background-color: #ea281a;
    color: white;
    margin-top: rpx(-20)
  }
</style>

