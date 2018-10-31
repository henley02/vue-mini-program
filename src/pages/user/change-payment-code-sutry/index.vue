<template>
  <div class='wrapper'>
    <div>
      <text class="info" v-if="!isNext">输入6位数字支付密码</text>
      <text class="info" v-else>再次输入</text>
      <div class='content'>
        <block v-for="(item,index) in 6" :key="index">
          <input class='iptbox' :value="temporary.length>=index+1?temporary[index]:''" disabled type="password"
                 @tap='getFocus()'/>
        </block>
      </div>
      <input name="password" type="password" class='ipt' maxlength="6" :focus="isFocus" v-model="temporary"
             @blur="lossFocus"/>
      <div>
        <button class="btn-area" @tap='onSubmit'>确认</button>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 修改交易密码--第二步
   */

  import {changePaymentCode} from 'api/index';
  import MD5 from 'public/js/util/md5';

  export default {
    data() {
      return {
        isNext: false,
        temporary: '', // 临时值
        isFocus: true,
        paymentCode: '',
        confirmPaymentCode: '',
        sutry: ''
      };
    },
    computed: {
      showValue() {
        if (!this.isNext) {
          return this.paymentCode;
        } else {
          return this.confirmPaymentCode;
        }
      }
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
      async onSubmit() {
        if (this.temporary.trim() === '') {
          this.$bridge.dialog.alert({content: '支付密码不能为空'});
          return;
        } else if (this.temporary.length < 6) {
          this.$bridge.dialog.alert({content: '请输入正确的支付密码'});
          return;
        }
        if (!this.isNext) {
          this.paymentCode = this.temporary;
          this.temporary = '';
          this.isNext = true;
          this.getFocus();
        } else {
          this.confirmPaymentCode = this.temporary;
          console.log(this.confirmPaymentCode, this.paymentCode);
          if (this.confirmPaymentCode !== this.paymentCode) {
            this.$bridge.dialog.alert({content: '两次支付密码不一致'});
            return;
          }
          let userInfo = this.$bridge.storage.get('userInfo');
          let params = {
            passportId: userInfo.id,
            transactionPassword: MD5.hexMD5(this.paymentCode),
            id: userInfo.userId
          };
          let res = await changePaymentCode(params);
          if (res.firstErrorMessage === '') {
            if (this.sutry === 1) {
              wx.navigateBack({
                delta: -6
              });
            } else if (this.sutry === 2) {
              wx.navigateBack({
                delta: -6
              });
            } else if (this.sutry === 3) {
              wx.navigateBack({
                delta: -6
              });
            } else {
              wx.showToast({
                title: '设置成功',
                duration: 3000
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2
                });
              }, 1500);
            }
          } else {
            this.$bridge.dialog.alert({content: res.firstErrorMessage});
          }
        }
      }
    },
    onLoad(options) {
      this.sutry = options.sutry;
    },
    onShow() {
      this.isNext = false;
      this.temporary = '';
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

