<template>
  <div class="wrapper">
    <h-input :label="`${type==1?'密码':'新密码'}`" :type="`password`" v-model="password" placeholder="输入6~10位密码"
             maxlength="10"
             name="username"></h-input>

    <h-input :label="`${type==1?'确认密码':'确认新密码'}`" :type="`password`" v-model="affirmPassword" placeholder="再次输入您的密码"
             maxlength="10"
             name="username"></h-input>

    <button class="btn_confirm" :class="{'disable': !hasValue}" @tap='confirm'>
      {{type == 'register' ? '注册完成' : '确认'}}
    </button>

    <register-agreement v-if="type==='register'"></register-agreement>
  </div>
</template>

<script>
  import {loginnewId, register, changeLoginPassword} from 'api/index';
  import MD5 from 'public/js/util/md5';
  /**
   * 修改登录密码、设置登录密码
   */
  import hInput from 'public/components/h-input/h-input.vue';
  import registerAgreement from 'public/components/register-agreement/register-agreement.vue';

  export default {
    data() {
      return {
        password: '',
        affirmPassword: '',
        type: '',
        id: '', // 主键
        code: ''
      };
    },
    computed: {
      hasValue() {
        if (this.password.trim() === '' || this.affirmPassword.trim() === '') {
          return false;
        }
        return true;
      }
    },
    components: {
      hInput, registerAgreement
    },
    methods: {
      /**
       * 变更登录密码
       * @returns {Promise.<void>}
       */
      async changePassword() {
        let userName = this.$bridge.storage.get('userName');
        let params = {
          account: userName,
          password: MD5.hexMD5(this.password),
          code: this.code,
          verificationType: 'SHORT_MOBILE'
        };
        let res = await changeLoginPassword(params);
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '更改成功',
            icon: 'success',
            duration: 3000
          });
          this.$bridge.storage.remove('userName');
          setTimeout(() => {
            this.$bridge.link.goLogin();
          }, 1500);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 注册
       * @returns {Promise.<void>}
       */
      async register() {
        let userName = this.$bridge.storage.get('userName');
        let params = {
          id: this.id,
          isCustomer: false,
          isDistributor: false,
          isActive: true,
          userNameForAccount: userName,
          loginPassword: this.password,
          name: userName,
          mobilePhone: userName
        };
        let res = await register(params);
        if (res.firstErrorMessage === '') {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 3000
          });
          this.$bridge.storage.remove('userName');
          setTimeout(() => {
            this.$bridge.link.goLogin();
          }, 1500);
        } else {
          this.$bridge.dialog.alert({content: res.firstErrorMessage});
        }
      },
      /**
       * 确定
       */
      confirm() {
        if (this.password.trim() === '') {
          this.$bridge.dialog.alert({content: '密码不能为空'});
          return;
        }
        if (this.password.length < 6) {
          this.$bridge.dialog.alert({content: '请输入正确密码'});
          return;
        }
        if (this.password.length > 10) {
          this.$bridge.dialog.alert({content: '请输入正确密码'});
          return;
        }
        if (this.affirmPassword.trim() === '') {
          this.$bridge.dialog.alert({content: '确认密码不能为空'});
          return;
        }
        if (this.password !== this.affirmPassword) {
          this.$bridge.dialog.alert({content: '两次输入的密码不一致'});
          return;
        }
        if (this.type === 'register') {
          this.register();
        } else if (this.type === 'forgetPassword') {
          this.changePassword();
        }
      },
      /**
       * 获取主键
       * @returns {Promise.<void>}
       */
      async getPrimaryKey() {
        let res = await loginnewId({});
        this.id = res;
      }
    },
    onLoad(options) {
      this.code = options.code;
      this.type = options.type;
      if (this.type === 'register') {
        wx.setNavigationBarTitle({
          title: '设置新密码'
        });
      } else if (this.type === 'forgetPassword') {
        wx.setNavigationBarTitle({
          title: '设置登录密码'
        });
      }
      this.getPrimaryKey();
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/css/login";
</style>

