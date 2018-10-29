<template>
  <div class="wrapper padding-top-100">
    <h-input label="手机号" :type="`number`" v-model="username" placeholder="您的手机号" maxlength="11"
             name="username"></h-input>
    <h-input label="密码" :type="`password`" v-model="password" placeholder="输入密码" maxlength="10"
             name="password"></h-input>
    <div class="btn_confirm" :class="{'disable': !hasValue}" @tap='login'>登录</div>
    <div class='input_gather_btn'>
      <text class="btn_register" @tap='register'>快速注册</text>
      <text class="btn_forget_password" @tap='forgetPassword'>忘记密码</text>
    </div>
    <authorization :isAuthorization.sync="isAuthorization" v-if="!isAuthorization"></authorization>
    <btn-home></btn-home>
  </div>
</template>

<script>
  /**
   * 用户登录
   */
  import hInput from 'public/components/h-input/h-input.vue';
  import authorization from 'public/components/authorization/authorization.vue';
  import btnHome from 'public/components/btn-home/btn-home.vue';
  import MD5 from 'public/js/util/md5';
  import {login} from 'api/index.js';

  export default {
    data() {
      return {
        username: '',
        password: '',
        isAuthorization: true
      };
    },
    components: {
      hInput, btnHome, authorization
    },
    computed: {
      hasValue() {
        if (this.username.trim() === '' || this.password.trim() === '') {
          return false;
        }
        return true;
      }
    },
    methods: {
      register() {
        this.$bridge.link.navigateTo('/pages/user/register/main?type=register');
      },
      forgetPassword() {
        this.$bridge.link.navigateTo('/pages/user/register/main?type=forgetPassword');
      },
      async login() {
        if (!this.hasValue) {
          return false;
        }
        if (!(/^1\d{10}$/.test(this.username))) {
          this.$bridge.dialog.alert({content: '请输入正确的手机号'});
          return false;
        }
        let params = {
          username: this.username,
          password: MD5.hexMD5(this.password)
        };
        let res = await login(params);
        if (res.code === 'BUSINESS_ERROR') {
          this.$bridge.dialog.alert({content: res.message});
        } else {
          this.$bridge.storage.save('userInfo', res);
          this.$bridge.link.goIndex();
          // wx.navigateBack({
          // delta: 1
          // });
        }
      }
    },
    async onShow() {
      this.isAuthorization = await this.$bridge.user.isAuthorization();
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
