<template>
  <div class="wrapper">
    <h-input :label="`${type==1?'密码':'新密码'}`" :type="`password`" v-model="password" placeholder="输入6~10位密码"
             maxlength="10"
             name="username"></h-input>

    <h-input :label="`${type==1?'确认密码':'确认新密码'}`" :type="`password`" v-model="affirmPassword" placeholder="再次输入您的密码"
             maxlength="10"
             name="username"></h-input>

    <button class="btn_confirm" :class="{'disable': !hasValue}" bindtap='loginInfo'>
      {{type == 'register' ? '注册完成' : '确认'}}
    </button>

    <register-agreement v-if="type==='register'"></register-agreement>
  </div>
</template>

<script>
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
        type: ''
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
    created() {
    },
    onLoad(options) {
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
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/css/login";
</style>

