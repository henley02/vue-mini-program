<template>
  <div class="wrapper padding-top-100">
    <h-input label="原密码" :type="`number`" v-model="oldPassword" placeholder="请输入原密码" maxlength="10"
             name="oldpwd"></h-input>
    <h-input label="新密码" :type="`password`" v-model="newPassword" placeholder="请输入新密码" maxlength="10"
             name="newpwd"></h-input>
    <h-input label="确认密码" :type="`password`" v-model="confirmNewPassword" placeholder="请输入确认密码" maxlength="10"
             name="newpwd2"></h-input>
    <div class="btn_confirm" @tap='confirm'>保存</div>
  </div>
</template>

<script>
  /**
   * 用户登录
   */
  import MD5 from 'public/js/util/md5';
  import {changeLoginPassword} from 'api/index.js';

  export default {
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        userInfo: {}
      };
    },
    methods: {
      async confirm() {
        if (this.oldPassword.trim() === '') {
          this.$bridge.dialog.alert({content: '原密码不能为空'});
          return;
        }
        if (this.newPassword.trim() === '') {
          this.$bridge.dialog.alert({content: '新密码不能为空'});
          return;
        }
        if (this.newPassword.length < 6 || this.newPassword.length > 10) {
          this.$bridge.dialog.alert({content: '请输入正确的新密码'});
          return;
        }
        if (this.newPassword === this.oldPassword) {
          this.$bridge.dialog.alert({content: '新密码与原密码不能一致'});
          return;
        }

        if (this.confirmNewPassword.trim() === '') {
          this.$bridge.dialog.alert({content: '请确认密码'});
          return;
        }
        if (this.newPassword !== this.confirmNewPassword) {
          this.$bridge.dialog.alert({content: '两次的密码输入不一致'});
          return;
        }
        this.userInfo = this.$bridge.storage.get('userInfo');
        let params = {
          passportId: this.userInfo.id,
          oldPassword: MD5.hexMD5(this.oldPassword).toString(),
          password: MD5.hexMD5(this.newPassword).toString()
        };
        let res = await changeLoginPassword(params);
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '设置成功',
            duration: 3000
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            });
          }, 1500);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      }
    },
    onShow() {
      Object.assign(this.$data, this.$options.data());// 还原原始数据
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  @import "~public/css/login";

  .btn_register, .btn_forget_password {
    font-size: rpx(26);
    color: #666666;
  }

  .input_gather_btn {
    margin: rpx(45) rpx(52);
    display: flex;
    justify-content: space-between;
    height: rpx(50);
  }
</style>
