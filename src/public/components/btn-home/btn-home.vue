<template>
  <div class="u-tap-btn">
    <navigator url="../index/index" open-type="switchTab" class="u-go-home">
      <div class="iconfont icon-shouyeshouye"></div>
    </navigator>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'btn-home',
    data() {
      return {};
    },
    methods: {},
    created() {
    },
    mounted() {
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/mixin";
  .u-tap-btn {
    position: fixed;
    right: rpx(20);
    bottom: rpx(150);
    z-index: 4;
  }

  .u-go-home {
    border-radius: 100%;
    width: rpx(80);
    height: rpx(80);
    border: 1px solid #eee;
    font-size: rpx(20);
    text-align: center;
    background-color: #fff;
    box-shadow: 0px rpx(4) rpx(8) rgba(0, 0, 0, 0.35);
    z-index: 2;
    opacity: 0.8;
    line-height: rpx(80);
    margin-bottom: rpx(20);
  }

  .iconfont {
    font-size: rpx(40);
  }
</style>
