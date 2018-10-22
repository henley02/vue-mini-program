<template>
  <div class="register-agreement">
    <text>用户注册即代表同意</text>
    <label @tap='registration'>《注册协议》</label>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'register-agreement',
    methods: {
      registration() {
        this.$bridge.link.goRegisterAgreement();
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .register-agreement {
    font-size: rpx(24);
    color: #666666;
    margin-left: rpx(49);
  }

  .register-agreement label {
    color: #EA281A
  }
</style>
