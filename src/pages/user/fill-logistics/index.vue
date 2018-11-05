<template>
  <div class='dataaddress'>
    <div class='bor_top'>
      <div class='u-1'>
        <div class='u-via1'>物流公司</div>
        <input placeholder='填写您退货的物流公司' class='u-name' name="memberReturnCarrierName" v-model="memberReturnCarrierName"
               maxlength='20'/>
      </div>
      <div class='u-1'>
        <div class='u-via1'>物流单号</div>
        <input placeholder='填写您的物流单号' class='u-name' name="memberReturnNumber" v-model="memberReturnNumber"
               maxlength='20'/>
      </div>
    </div>
    <div class='m-address'>
      <div class='u-1-1' @tap='confirm'>提交</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /*
  * 我的账户
  * */
  import {refundMemberReturn} from 'api/index';

  export default {
    name: 'consumption-records',
    data() {
      return {
        userInfo: {},
        rowVersion: '',
        id: '',
        memberReturnNumber: '',
        memberReturnCarrierName: ''
      };
    },
    methods: {
      /**
       * 提交物流公司物流单号
       * @returns {Promise.<boolean>}
       */
      async confirm() {
        let regEn = /[`~!@#$%^&*()_+<>?:"{},./\\;'[\]]/im;
        let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (this.memberReturnNumber.trim() === '') {
          this.$bridge.dialog.alert({content: '物流单号不能为空'});
          return false;
        }
        if (this.memberReturnCarrierName.trim() === '') {
          this.$bridge.dialog.alert({content: '物流名称不能为空'});
          return false;
        }
        if (regEn.test(this.memberReturnCarrierName) || regCn.test(this.memberReturnCarrierName)) {
          this.$bridge.dialog.alert({content: '请输入正确的物流名称'});
          return false;
        }
        let params = {
          rowVersion: this.rowVersion,
          id: this.id,
          memberReturnNumber: this.memberReturnNumber,
          memberReturnCarrierName: this.memberReturnCarrierName,
          passportId: this.userInfo.id
        };
        let res = await refundMemberReturn(params);
        if (res.firstErrorMessage === '') {
          this.$bridge.dialog.alert({
            content: '提交成功',
            confirmCallback: () => {
              wx.navigateBack({
                delta: -1
              });
            }
          });
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      this.memberReturnNumber = '';
      this.memberReturnCarrierName = '';
      this.userInfo = this.$bridge.storage.get('userInfo');
      this.id = this.$root.$mp.query.id;
      this.rowVersion = this.$root.$mp.query.rowVersion;
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  body {
    background-color: rgb(244, 244, 244);
  }

  .dataaddress {
    background-color: rgb(244, 244, 244);
    font-size: rpx(30);
  }

  .m-address {
    margin-top: rpx(33);
  }

  .u-1 {
    display: flex;
    height: rpx(100);
    background-color: white;
    border-bottom: rpx(1) solid rgb(244, 244, 244);
  }

  .u-via1 {
    padding-left: rpx(30);
    line-height: rpx(100);
    width: rpx(128);
  }

  .u-name {
    text-align: right;
    line-height: rpx(100);
    position: relative;
    height: rpx(100);
    width: rpx(560);
  }

  .u-1-1 {
    width: 90%;
    margin: 0 auto;
    height: rpx(84);
    text-align: center;
    line-height: rpx(81);
    color: #fff;
    background: #EA281A;
    border-radius: rpx(15);
  }

  .bor_top {
    border-top: rpx(1) solid rgb(244, 244, 244);
  }
</style>
